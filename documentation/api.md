# API

## new Renderer(options)

```js
const Renderer = require('@pdftron/web-to-pdf');
const renderer = new Renderer(options);
```
**options**

- [dirname](#dirname-required) (required)
- [width](#width)
- [height](#height)
- [margin](#margin)
- [keepAlive](#keepAlive)
- [debug](#debug)
- [port](#port)
- [host](#host)
- [autoOpen](#autoopen)

### dirname (required)
Directory of the file you are working in. Please pass `__dirname` for this option.

```js
const renderer = new Renderer({ dirname: __dirname });
```

### width
Width of each page in pixels. Must be an interger

**default**: 612

### height
Height of each page in pixels. Must be an interger value **or** set to 'auto' to match the height of the page.

**default**: 792

### margin
Object specifying page margins. `top`, `bottom`, `left` and `right` are accepted object values. Uses normal CSS values.

```js
const Renderer = require('@pdftron/web-to-pdf');
const r = new Renderer({
  margin: {
    top: '20px',
    left: '1in',
    right: '20px',
    bottom: '20px',
  }
})
```

### keepAlive
Set to true to keep the instance in memory when it's done rendering. Useful for using the tool as a service.

**default**: false

### debug
Set to true to enable some debugging logs. Setting this to true will also leave all the source files in your output directory (these are normally deleted after the PDF is generated.)

**default**: false

### port
Port to run the local server on. 

**default**: 8080

### host
Host to run the local server on. 

**default**: 127.0.0.1

### autoOpen
Set to true to auto open the PDF once its done rendering. Ignored if you are in real time mode.

**default**: false

## .render(renderOptions)

```js
const Renderer = require('@pdftron/web-to-pdf');
const renderer = new Renderer(options);

const result = await renderer.render(renderOptions); // see below for renderOptions
```

**NOTE** For `realTime` mode, you must pass a path to an options file instead of an options object. See [this](./real-time.md) for more details.

**NOTE** If you want to render a remote URL, also see [this guide](./remote-api.md)

#### Returns:

Returns a promise that resolves with the following object:

```
{
  sourceMap: {
    ...list of read/writes that were made. Used mostly for debugging.
  },
  output: 'path to where the PDF was written, relative to CWD',
  metadata: {
    numberOfPages: 'how many pages the PDF is'
  }
}
```


**Render options:**
- [templateSource](#templatesource-required) (required)
  - [react component](#react-component)
  - [html string](#html-string)
  - [html file](#html-file)
  - [function](#function)
  - [url](#url)
- [contentSource](#contentsource)
- [pageClass](#pageClass)
- [chunks](#chunks)
- [outputFolder](#outputfolder)
- [outputName](#outputname)
- [styles](#styles)
- [ignoreWatch](#ignorewatch)
- [middleware](#middleware)


### templateSource (required)
The source for your PDF structure. Can be one of the following:

#### react component
If you pass a React component, it will be rendered to HTML via React.renderToString(). **Keep in mind that this is a server render**, so you dont have access to browser APIs, and you won't get all the lifecycle functions.


```js
class Component extends React.Component {
  render() {
    return (
      <div className='Page'>
        <p>My content here!</p>
      </div>
    )
  }
}

const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  templateSource: Component
});
```

#### html (string)
If you pass a valid html string, it will be used directly to render the PDF.

```js
const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  templateSource: `
    <html>
      <body>
        <div class='Page'>
          My content goes here!
        </div>
      </body>
    </html>
  `
});
```

#### html (file)
If you pass a path to a html file, it will be used directly to render the PDF.

```js
const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  templateSource: 'index.html'
});
```

#### function
If you pass a function, it will be called and the result will be used to render the PDF. This means the function should return valid HTML, **or a promise that resolves with valid HTML**.

The function is passed the content that is passed via the [contentSource](#contentSource) option. This makes dynamic HTML structures possible.

```js
const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  templateSource: (content) => {
    return `
      <html>
        <body>
          <div class='Page'>
            ${
              content.list.map((item) => {
                return `<p>${item}</p>`
              })
            }
          </div>
        </body>
      </html>
    `
  }
});
```

#### url
If you pass a URL, the remote page will be rendered.

Url must start with `http` or `https`.

Also see [this guide](./remote-api.md)

```js
const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  templateSource: 'https://google.com'
});
```

### contentSource
Either a JS object or a path to a JSON file containing your content. This content will be used to replace your [mustaches](content.md), and is also passed into the [templateSource function method.](#function). The content is also available at `window.content` if you are using some client side rendering. If not supplied, no content will be replaced.

**NOTE:** content replacement will only work if you pass in raw HTML, or pass a [react component](#react-component) to templateSource. If you are using Javascript to generate the DOM on the client, content replacement will not work. In this case you can access your data at `window.content`.

default: `null`

#### json (file)

```js

const html = `
<html>
  <body>
    <div class='Page'>
      {{myString}}
    </div>
  </body>
</html>
`

const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  templateSource: html,
  contentSource: 'content.html'
});
```

#### json (object)

```js
const renderer = new Renderer({ dirname: __dirname });

const html = `
<html>
  <body>
    <div class='Page'>
      {{myString}}
    </div>
  </body>
</html>
`

renderer.render({
  templateSource: html,
  contentSource: {
    "myString": "Hello world!"
  }
});
```


### pageClass
Use your own custom class to seperate pages.

By default, each div with a `Page` class will be its own page. You can change this by setting this property.

```js
const html = `
<html>
  <body>
    <div class='CustomPage'>
      {{header}}
      Hi!

      {{copy}}
    </div>
  </body>
</html>
`

renderer.render({
  templateSource: html,
  pageClass: 'CustomPage'
});
```


### chunks
A map of HTML snippets to reuse throughout your template.

Accepts any of the types that [templateSource](#templatesource) accepts (except a remote url). Whatever is passed will replace any {{chunkName}} mustaches.

See [here](./content.md) for more info on mustache syntax.
See [here](./chunks.md) for more info and examples on chunks.

```js
const renderer = new Renderer({ dirname: __dirname });

const html = `
<html>
  <body>
    <div class='Page'>
      {{header}}
      Hi!

      {{copy}}
    </div>
  </body>
</html>
`

const header = `
<div>
  My Header here
</div>
`

const mainCopy = `
<div class='copy'>
  My main copy
</div>
`

renderer.render({
  templateSource: html,
  contentSource: {
    "myString": "Hello world!"
  },
  chunks: {
    header: header,
    copy: mainCopy
  }
});
```

### outputFolder
A string containing the name of the desired output folder. Will be created relative to the CWD.

default: `outputs`

```js
const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  templateSource: 'template.html',
  outputFolder: 'pdf-outputs'
});
```

Will create `./pdf-outputs/index.pdf`

### outputName
Name of the PDF file that is generated.

default `index`

```js
const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  templateSource: 'template.html',
  outputFolder: 'pdf-outputs',
  outputName: 'report-card'
});
```

Will create `./pdf-outputs/report-card.pdf`

### styles

**IMPORTANT: If your css/scss is referenced (via link tags) in your html, then you don't need to do this. [See the examples to learn more](../examples)**

An array of string representing paths to css files or actual css or scss you want to use to style your PDF. If you provide a `.scss` file, it (and any linked files) will be automatically compiled to css. These styles will be automatically injected into the HTML generated by your [templateSource](#templateSource). **This is only useful if you cant link the css in your HTML for some reason.**


default: `[]`

```js
const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  templateSource: 'template.html',
  styles: [
    'style.css', // paths to css
    'customStyle.scss', // paths to scss
    `
      #test {
        color: red /
      }
    ` // or actual css or scss
  ],
});
```

### ignoreWatch
Sometimes you will have your own file watcher and you won't have to reply on our on change function for certain files.

Accepts an [anymatch](https://www.npmjs.com/package/anymatch) array or glob of files to ignore.

default: null

```js
const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  templateSource: 'template.html',
  ignoreWatch: "**/bundle.js" // ignore bundle.js
});
```

### middleware
An array of functions used to transform HTML. Each function will be called one after the other. Each function recieves HTML as a parameter and should return the transformed HTML string.

Middleware functions can be asyncronous. The next middleware in the chain won't get called until the previous one is finished

```js
const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  templateSource: 'template.html',
  middleware: [
    (html) => {
      html = html.replace(/p/g, "h5");
      return html;
    }
  ]
});
```

## .on(key, callback)
Subscribe to event throughout the render process. Possible keys are

`change` - called when a file used to render changes, useful for [real time pdf building](./real-time.md).


`html` - called when the final HTML is determined (useful for debugging). Callback is passed an html string. Not called when using a remote URL.

## .stop()
Closes down all services.



