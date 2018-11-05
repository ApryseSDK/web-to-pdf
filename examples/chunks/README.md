# Chunks example
This example shows how to use the chunks api to insert chunks of html throughout your template.

### Running

If you dont have the repo installed, do so by running:
```
git clone https://github.com/PDFTron/web-to-pdf.git
cd web-to-pdf
npm i
```

Run the example:
```
npx babel-node examples/chunks
```

### APIs and Techniques Used
- [Chunks](../../documentation/chunks.md)
- [HTML String as template source](../../documentation/api.md#html-string)
- [HTML File as chunk source](../../documentation/api.md#html-file)
- [React component as chunk source](../../documentation/api.md#react-component)
- [Output name](../../documentation/api.md#outputname)