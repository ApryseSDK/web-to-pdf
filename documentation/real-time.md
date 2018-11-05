# Real time PDF Building

Real time mode allows you to view your PDF in the browser as you build it! Any change to a file will rebuild the PDF and hot reload it in the browser.

**To enable real time mode, please follow these two (three if you're using react) steps:**

## 1) Export renderOptions from a different file.
In order for us to get your new render params when they change, we need to be able to dynamically require them. In order to do this, your render params must be exported from another file, and you must pass us a path to this file. This file must export (default) a function that returns your params. This function may be asyncronous if you need to do some network fetching here.

See [here](./api.md#renderrenderoptions) for possible renderOptions

Example of real time building [here](./../examples/real-time)

**index.js**
```js
  const renderer = new Renderer({ dirname: __dirname });

  const render = () => {
    renderer.render('options.js');
  }

  renderer.on('change', render);
  render();
```

**options.js**
```js

module.exports = () => {
  return {
    templateSource: "<html><div class='Page'>Hey!!!</div></html>",
    // ...other renderOptions
  }
}

```

## 2) Add a change listener

To trigger re-renders, you need to hook into the `onchange` event. Follow this pattern to do so:

```js
const renderer = new Renderer({ dirname: __dirname });

const render = () => {
  renderer.render('options.js');
}

renderer.on('change', render);
render();
```

Web-to-pdf will trigger your render function any time a file changes.

## 3) React components (server rendered)

If you are using a React component as a source and you want hot reloading, you need to use our special `pathTo` function to require it.

In the function exported from your [options file](#1-export-renderoptions-from-a-different-file), use the first parameter to reference your react component.

Example: 

**options.js**
```js
module.exports = async (pathTo) => {

  return {
    templateSource: pathTo('./root'), // ./root exports the root react component
  }
  
}
```

[Here is an example](../examples/complex-2) of this method in use.

