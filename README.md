# Web to PDF Converter
Easily create beautiful PDFs using your favorite Javascript and CSS framework!

Created and maintained by [PDFTron](https://pdftron.com).

**This project is still in development and should not be used in a production environment! It has not been tested in all use cases.** 

## Features
- 💥 JS is fully supported, meaning you can use your favorite frameworks to generate your PDF.
- 🔄 Comes with a powerful [content replacement](./documentation/content.md) system that allows for dynamic content.
- 🔢 Insert [page numbers](./documentation/creating-pages.md#page-numbers) in your pages dynamically.
- 💃 [Full SCSS support](./documentation/api.md#styles)
- 👸 Support for [headers and footers](./documentation/headers-footers.md)
- 🔗 Support for reusuable [HTML chunks](./documentation/chunks.md)
- 🎥 [Real time mode](./documentation/real-time.md) with hot reloading, meaning you can build your PDF in real time
- 🌏 Support for [rendering remote pages](./documentation/remote-api.md) (You can even inject your own css and js!)
- 🚦 Memory management system so you can render 1000's of PDFs with a single script.
- 👍 Much more!

## Roadmap
- Examples (external repos?) of usage with other frameworks 
- Splitting of non-list content on page break
- Support for form inputs

## Installation
```
npm i @pdftron/web-to-pdf
```

## Example
```js
const Renderer = require('@pdftron/web-to-pdf');

const r = new Renderer({ dirname: __dirname });

const htmlString = `
  <html>
    <head>
      <link rel='stylesheet' href='style.scss'>
    </head>
    <body>
      <div class='Page'>
        Page1: {{myText}}
      </div>

      <div class='Page'>
        Page2: Goodbye world!
      </div>
    </body>
  </html>
`;

r.render({
  templateSource: htmlString,
  contentSource: {
    myText: "Hello world!"
  },
  outputName: 'example'
});

// Pdf will be rendered at ./outputs/example.pdf !
```

See more examples [here](examples/).

## Documentation
- [Creating pages + Dynamic page numbers](./documentation/creating-pages.md)
- [API](./documentation/api.md)
- [Rendering remote pages](./documentation/remote-api.md)
- [Headers and footers](./documentation/headers-footers.md)
- [Reusable Chunks](./documentation/chunks.md)
- [Lists](./documentation/lists.md)
- [Real time PDF building](./documentation/real-time.md)
- [Styling with CSS & SASS](./documentation/api.md#styles)
- [Assets](./documentation/assets.md)
- [Dynamic content](./documentation/content.md)

## Real time PDF Building
With a few changes to your options you can enable real time PDF building!
See [the docs](./documentation/real-time.md) for more info.

## Development
```
git clone https://github.com/PDFTron/web-to-pdf.git
cd web-to-pdf
npm i
```

There are examples you can test on in the `examples` folder. These examples are run via scripts in `package.json`

## Contributing
Before created a PR, please make sure tests pass:

`npm run test`

If you would like to contribute but aren't sure how, please open a ticket saying you would like to contribute.

Feel free to add tests you feel needed.

## Caveats
- Creation of PDF input fields is not supported (not supported by chromium).
