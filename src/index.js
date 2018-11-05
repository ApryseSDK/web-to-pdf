require('@babel/polyfill');

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  require('./styles/index.css') 
}
const readFile = require('./util/read-file');
const server = require('./server');
const printPDF = require('./util/print-pdf');
const ensureExists = require('./util/ensure-exists');
const injectStyles = require('./util/inject-styles');
const cleanHTML = require('./util/clean-html');
const getScriptSrc = require('./util/get-script-src');
const toAbsolute = require('./util/to-absolute');
const listenToChanges = require('./util/listen-to-changes');
const getCssSrc = require('./util/get-css-src');
const getHTMLFromSource = require('./util/get-html-from-source');
const insertContent = require('./util/insert-content');
const replacePageNumbers = require('./util/replace-page-numbers');
const getAssetSources = require('./util/get-asset-source');
const getContent = require('./util/get-content');
const injectCustomScripts = require('./util/inject-custom-scripts');
const ensurePage = require('./util/ensure-page');
const injectHeaderAndFooter = require('./util/inject-header-footer');
const deleteDir = require('./util/delete-dir');
const getCustomCSS = require('./util/get-custom-css');
const getCustomScripts = require('./util/get-custom-scripts');
const getOptions = require('./util/get-options');

const puppeteer = require('puppeteer');
const pretty = require('pretty');
const Writer = require('./writer');
const exec = require('child_process').exec;

const Path = require('path');
const chalk = require('chalk');

class Renderer {
  constructor(options = {}) {
    this.debug = options.debug || false;
    this.port = options.port || 8080;
    this.host = options.host || '127.0.0.1';
    this.width = options.width || 612;
    this.height = options.height || 792;
    this.autoOpen = options.autoOpen || false;
    this.dirname = options.dirname;
    this.keepAlive = options.keepAlive || false;
    this.margin = options.margin || {
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px'
    }

    this.__openBrowser = options.__openBrowser || false;
    
    if (!options.dirname) {
      throw new Error(`Missing required parameter 'dirname'. Please add { dirname: __dirname } to your constructor options`);
    }

    // internal stuff
    this._listening = false;
    this._injectedScripts = [];
    this._lastObject = null;

    this._changeFunc = null;
    this._renderedHTML = null;

    this._queue = []
    this._activeWorkers = 0;
    this._maxWorkers = 20;
    this._lastPageSplitClass = 'Page';

    const args = [];
    this.__browserPromise = new Promise(async (resolve) => {
      this.browser = await puppeteer.launch({
        headless: !this.__openBrowser,
        args,
        defaultViewport: {
          width: this.width,
          height: this.height === 'auto' ? 792 : this.height,
          deviceScaleFactor: 2
        }
      });
      resolve();
    })
  }

  on = (key, func) => {
    switch (key) {
      case 'change':
        this._changeFunc = func;
        break;
      case 'html':
        this._renderedHTML = func;
        break;
    }
  }

  _stop = async (err) => {
    if (!this.keepAlive) {
      return this.stop(err);
    }
  }

  stop = async (err) => {

    await this.__browserPromise;

    if (this.listener) {
      this.listener.close();
    }

    if (this.server) {
      server.close(this.server);
    }

    if (this.browser) {
      await this.browser.close();
    }

    if (err) throw err;
  }

  _autoOpen = (outputFolder, outputName) => {
    if (this.autoOpen && !this._changeFunc) {
      const getCommandLine = () => {
        switch (process.platform) { 
           case 'darwin' : return 'open';
           case 'win32' : return 'start';
           case 'win64' : return 'start';
           default : return 'xdg-open';
        }
      }

      exec(getCommandLine() + ' ' + `${outputFolder}/${outputName}/${outputName}.pdf`);
    }
  }

  _pushQueue = (f) => {
    this._queue.push(f);
    this._flush();
  }

  _flush = async () => {
    if (this._activeWorkers < this._maxWorkers && this._queue.length > 0) {
      const next = this._queue.pop();
      this._activeWorkers++;

      await this.__browserPromise;
  
      await next();
      this._activeWorkers--;

      if (this._queue.length === 0 && this._activeWorkers === 0) {
        if (!this._changeFunc) {
          this._stop();
        }

        return;
      }

      this._flush();
    }

  }

  render(options) {
    return new Promise(async (r) => {
      const optionsResult = await getOptions(options, this.dirname);
      let optionsPath = '';
      ({ options, optionsPath } = optionsResult);
      this._pushQueue(async () => {
        let result;
        if (typeof options.templateSource === 'string') {
          const src = options.templateSource.trim();
          if ((src.startsWith('http') || src.startsWith('https'))) {
            result = await this._renderRemote(optionsResult).catch(this._stop);
          }
        }

        if (!result) {
          result = await this._render(optionsResult).catch(this._stop);
        }
        
        r(result);
      });
    }).catch(this._stop)
  }


  async _renderRemote(optionsResult) {
    let options;
    let optionsPath = '';
    ({ options, optionsPath } = optionsResult);

    let {
      styles = [],
      scripts = [],
      templateSource: url,
      outputFolder = 'outputs',
      outputName = 'index',
      ignoreWatch
    } = options;

    let style = await getCustomCSS(styles, this.dirname, this.debug);
    let { linkedStyles } = style;

    style = style.css;
    const renderedScripts = await getCustomScripts(scripts, this.dirname, this.debug);

    await ensureExists(`${outputFolder}`);

    const result = await printPDF({
      url,
      scripts: renderedScripts,
      style,
      browser: this.browser,
      outputFolder,
      outputName,
      width: this.width,
      height: this.height,
      realtime: !!this._changeFunc,
      openBrowser: this.__openBrowser
    }); 

    console.log(chalk.green.bold(`Succesfully finished rendering ${chalk.bold(`${outputFolder}/${outputName}.pdf\n\n`)}`));

    if (this._changeFunc && !this._listening) {
      this.listener = listenToChanges([
          ...toAbsolute(scripts, this.dirname),
          ...toAbsolute(styles, this.dirname),
          ...linkedStyles
        ],
        this._changeFunc,
        this.debug,
        ignoreWatch
      );

      this._listening = true;
    }

    this._autoOpen(outputFolder, outputName);

    return {
      sourceMap: {
        html: result.html
      },
      output: `${outputFolder}/${outputName}.pdf`,
      metadata: {
        numberOfPages: null
      }
    };
  }

  async _render(optionsResult) {
    let options;
    let optionsPath = '';
    ({ options, optionsPath } = optionsResult);

    let {
      templateSource,
      contentSource = '',
      outputFolder = 'outputs',
      outputName = 'index',
      styles = [],
      chunks = {},
      assets = [], // not part of API
      ignoreWatch,
      middleware = [],
      pageClass = 'Page'
    } = options;

    // map of writes / sourceMap
    const writer = new Writer(this.debug);

    if (!templateSource) {
      await this._stop(new Error('templateSource is required'));
    }

    let obj = this._lastObject || null;
    // these determine if we should add a change listener on certain source files.
    // they are set throughout the code when source types are determined.
    let listenableContentSource = false;

    // If content source is set, parse it an apply it
    ({ obj, listenableContentSource } = await getContent({
      contentSource, debug: this.debug, dirname: this.dirname
    }))
    this._lastObject = obj;
    

    // pass options into closure to avoid duplicating parameters everywhere
    const htmlGetter = getHTMLFromSource({
      debug: this.debug,
      dirname: this.dirname,
      listening: this._listening,
      obj
    })

    let { html, listenableSource } = await htmlGetter(templateSource, 'templateSource');
    let listenableChunks = [];
    // Chunks!
    const chunkP = Object.keys(chunks).map((chunkName) => {
      return new Promise(async (r) => {
        const { html: chunkData, listenableSource: l  } = await htmlGetter(chunks[chunkName], chunkName);
        html = insertContent(html, { [chunkName]: cleanHTML(chunkData) });
        if (l) {
          listenableChunks.push(chunks[chunkName]);
        }
        r();
      })
    })
    if(chunkP.length) await Promise.all(chunkP);

    if (!html) {
      await this._stop(new Error('Could not parse templateSource to html, please make sure your input is a supported format.'));
    }
    
    this._injectedScripts = [];
    //copy scripts

    const scripts = getScriptSrc(html, templateSource, this.dirname);
    scripts.forEach(({ fullPath, relativePath }) => {
        const to = Path.join(`${outputFolder}/${outputName}/`, relativePath);
        this._injectedScripts.push(to);
        writer.addWrite(Writer.TYPES.SCRIPT, Writer.METHODS.COPY, to, fullPath);
    });

    // copy assets
    assets = [...assets, ...getAssetSources(html, this.dirname)];
    assets.forEach((asset) => {
      const ree = Path.resolve(re, asset);
      const re = Path.relative(ree, process.cwd());
      const count = (re.match(/\//g) || []).length - 1;
      const name = ree.split('/').slice(-1 * (count)).join('/');
      writer.addWrite(Writer.TYPES.ASSET, Writer.METHODS.COPY, `${outputFolder}/${outputName}/${name}`, asset)
    })
    
    styles = [...styles, ...(getCssSrc(html, templateSource, this.dirname) || [])];
    // this will store the paths of any stylesheets linked in the root scss (for listening purposes)
    // Get css

    const cssResult = await getCustomCSS(styles, this.dirname, this.debug);

    let { linkedStyles } = cssResult;
    let customCss = cssResult.css;

    let headerChunk = '';
    let footerChunk = '';

    if (chunks.header) {
      ({ html: headerChunk } = await htmlGetter(chunks.header, 'header'));
    }

    if (chunks.footer) {
      ({ html: footerChunk } = await htmlGetter(chunks.footer, 'footer'));
    }
    
    //HTML transforms
    html = cleanHTML(html, true);
    html = ensurePage(html, pageClass);
    html = injectHeaderAndFooter(html, pageClass, headerChunk, footerChunk);
    html = injectStyles(html, !!customCss);
    html = replacePageNumbers(html, pageClass);
    html = injectCustomScripts(html, obj, pageClass);
    html = pretty(html, { ocd: true });


    const nextMiddleWare = async () => {
      const next = middleware.pop();
      if (!next) return;
      html = await next(html);
      return nextMiddleWare();
    }

    middleware.reverse();
    await nextMiddleWare();

    if (this._renderedHTML) {
      this._renderedHTML(html);
    }

    if (!this._listening) {
      await ensureExists(`${outputFolder}`);
      await ensureExists(`${outputFolder}/${outputName}`);
    }


    if (!!customCss) {
      writer.addWrite(Writer.TYPES.CSS, Writer.METHODS.DATA, `${outputFolder}/${outputName}/custom.css`, customCss);
    }
    
    writer.addWrite(Writer.TYPES.HTML, Writer.METHODS.DATA, `${outputFolder}/${outputName}/index.html`, html);

    // only write this once, so if we are already listening then we dont need to write it again (unless the pageClass changes)
    if (!this._listening || pageClass !== this._lastPageSplitClass) {
      const path = Path.resolve(__dirname, isProd ? './index.css' : `./styles/index.css`);
      let css = await readFile(path);

      css = css.replace(/__WIDTH/g, this.width + 'px');
      css = css.replace(/__HEIGHT/g, this.height + 'px');
      css = css.replace(/__PAGE_NAME/g, pageClass);
      css = css.replace(/__MARGIN/g, `${this.margin.top} ${this.margin.right} ${this.margin.bottom} ${this.margin.left} !important`)

      writer.addWrite(Writer.TYPES.CSS, Writer.METHODS.DATA, `${outputFolder}/${outputName}/index.css`, css);
    }

    this._lastPageSplitClass = pageClass;

    const sourceMap = await writer.write();
    
    if (!this.server) {
      this.server = await server(this.port, this.host, outputFolder, this.debug);
      if (this._changeFunc) {
        console.log(chalk.green(`You can view your live PDF at ${chalk.bgGreen.whiteBright(`http://${this.host}:${this.port}/${outputName}`)}\n`));
      }
    }

    const reg = new RegExp(`class=['"].*?${pageClass}.*?['"].*?>`, 'gm');
    const numberOfPages = (html.match(reg) || []).length

    await printPDF({
      outputFolder,
      outputName,
      numberOfPages,
      browser: this.browser,
      width: this.width,
      height: this.height,
      margin: this.margin,
      realtime: !!this._changeFunc,
      source: `http://${this.host}:${this.port}`
    });

    console.log(chalk.green.bold(`Succesfully finished rendering ${chalk.bold(`${outputFolder}/${outputName}.pdf\n\n`)}`))
    
    if (this._changeFunc && !this._listening) {
      this.listener = listenToChanges(
        [
          ...toAbsolute(styles, this.dirname),
          ...assets,
          ...toAbsolute(scripts, this.dirname),
          ...toAbsolute(listenableChunks, this.dirname),
          listenableSource ? Path.resolve(this.dirname, templateSource) : '',
          listenableContentSource ? Path.resolve(this.dirname, contentSource) : '',
          ...linkedStyles,
          optionsPath
        ],
        this._changeFunc,
        this.debug,
        ignoreWatch
      );

      this._listening = true;
    }

    if (!this.debug && !this._changeFunc) {
      await deleteDir(`${outputFolder}/${outputName}`);
    }

    this._autoOpen(outputFolder, outputName);

    
    return {
      sourceMap,
      output: `${outputFolder}/${outputName}.pdf`,
      metadata: {
        numberOfPages
      }
    };
  }
}

module.exports = Renderer;