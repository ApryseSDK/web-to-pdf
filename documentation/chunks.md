# Chunks

Chunks are reusable snippets of HTML. They are referenced with mustache syntax, the same as [dynamic content](./content.md);

These are useful for any reusuable chunks of code.

Chunks can be any format that [templateSource](./api.md#templatesource-required) can be (html string, html file, react component, function, etc)

To set the chunk content, use the [chunks](./api.md#chunks) render options.

Chunks can be used to automatially append html to the top and bottom of every page - aka **headers and footers**. See [this guide](./headers-footers.md) for details

## Example

```js
const renderer = new Renderer({ dirname: __dirname });

// main template
const templateSource = `
<div class='Page'>
  {{chunkOne}}
  My page 1 content here
</div>

<div class='Page'>
  {{chunkTwo}}
  My page 2 content here
</div>

<div class='Page'>
  {{chunkOne}}
  My page 3 content here
  {{chunkTwo}}
</div>
`

// Headers
const chunkOne = `
<div class='myChunk'>
  PDFTron.com
</div>
`

// Footers
const chunkTwo = `
<div class='myChunk2'>
  Page {{pageNumber}}
</div>
`

renderer.render({
  templateSource: html,
  chunks: {
    chunkOne,
    chunkTwo
  }
});
```

HTML output:
```html
<div class='Page'>
  <div class='myChunk'>
    PDFTron.com
  </div>
  My page 1 content here
</div>

<div class='Page'>
  <div class='myChunk2'>
    Page 2
  </div>
  My page 2 content here
</div>

<div class='Page'>
  <div class='myChunk'>
    PDFTron.com
  </div>
  My page 3 content here
  <div class='myChunk2'>
    Page 3
  </div>
</div>
```

