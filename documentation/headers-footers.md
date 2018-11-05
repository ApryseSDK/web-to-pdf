# Headers and Footers

Adding headers and footer to each page is easy! Simple add a `header` and/or `footer` [chunk](./chunks.md) to your render options, and it will be automatically added.

The header and footer content can be in any format that [templateSource](./api.md#templatesource-required) accepts (except a remote URL).

### Example

```js
const renderer = new Renderer({ dirname: __dirname });

// main template
const templateSource = `
<div class='Page'>
  My page 1 content here
</div>

<div class='Page'>
  My page 2 content here
</div>
`

// Headers
const header = `
<div class='header'>
  PDFTron.com
</div>
`

// Footers
const footer = `
<div class='footer'>
  Footer
</div>
`

renderer.render({
  templateSource: html,
  chunks: {
    header,
    footer
  }
});
```

Output

```html
<div class='Page'>
  <div class='header'>
    PDFTron.com
  </div>
  My page 1 content here
  <div class='footer'>
    Footer
  </div>
</div>

<div class='Page'>
  <div class='header'>
    PDFTron.com
  </div>
  My page 2 content here
  <div class='footer'>
    Footer
  </div>
</div>
```