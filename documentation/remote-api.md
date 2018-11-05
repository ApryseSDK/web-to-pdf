# Remote API

Passing a URL to templateSource allows you to render a remote page. The API is the same as rendering a local PDF, but here are some ways you can edit the remote PDF.

## new Renderer(options)
See [renderer api](./api.md#new-rendereroptions) for constructor options

```js
const Renderer = require('@pdftron/web-to-pdf');
const renderer = new Renderer(options);
```

## .render(renderOptions)
- [templateSource](#templateSource) (required)
- [styles](#styles),
- [scripts](#scripts),
- [outputFolder](#outputfolder)
- [outputName](#outputname)
- [ignoreWatch](#ignorewatch)

**NOTE** For `realTime` mode, you must pass a path to an options file instead of an options object. See [this](./real-time.md) for more details.

**NOTE** If you want to render a local html file, please see [this guide](./api.md)

### templateSource
The URL of the page to render. 

```js
const renderer = new Renderer(options);

renderer.renderRemote({
  templateSource: 'http://google.com'
});
```

### styles
An array of paths to `css` or `scss` files to inject into the page. Useful for removing unwanted elements from the page.

Paths are relative to the current file.

```js
const renderer = new Renderer(options);

renderer.renderRemote({
  templateSource: 'http://google.com',
  styles: [
    'style.css',
    'style.scss',
  ]
});
```

### scripts
An array of paths to javscript files to inject into the page. Useful for running custom scripts before the PDF is generated.

Scripts are injected into the top of the page.

Paths are relative to the current file.

```js
const renderer = new Renderer(options);

renderer.renderRemote({
  templateSource: 'http://google.com',
  scripts: [
    'myScript.js',
  ]
});
```

### outputFolder
A string containing the name of the desired output folder. Will be created relative to the CWD.

default: `outputs`

```js
const renderer = new Renderer({ dirname: __dirname });
renderer.renderRemote({
  templateSource: 'http://google.com',
  outputFolder: 'pdf-outputs'
});
```

Will create `./pdf-outputs/index.pdf`

### outputName
Name of the PDF file that is generated.

default `index`

```js
const renderer = new Renderer({ dirname: __dirname });
renderer.renderRemote({
  templateSource: 'http://google.com',
  outputFolder: 'pdf-outputs',
  outputName: 'report-card'
});
```

Will create `./pdf-outputs/report-card.pdf`

### ignoreWatch
Sometimes you will have your own file watcher and you won't have to reply on our on change function for certain files.

Accepts an [anymatch](https://www.npmjs.com/package/anymatch) array or glob of files to ignore.

default: null

```js
const renderer = new Renderer({ dirname: __dirname });
renderer.renderRemote({
  templateSource: 'http://google.com',
  ignoreWatch: "**/style.scss" // ignore style.scss
});
```



