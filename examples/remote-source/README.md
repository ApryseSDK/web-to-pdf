# Remote source example
Renders a PDF of https://www.pdftron.com.

This example shows how we can inject CSS into a remote page to format it before render.

### Running

If you dont have the repo installed, do so by running:
```
git clone https://github.com/PDFTron/web-to-pdf.git
cd web-to-pdf
npm i
```

Run the example:
```
npx babel-node examples/remote-source
```

### APIs and Techniques Used
- [Remote URL as source](../../documentation/remote-api.md)
- [Inject SCSS into page](../../documentation/remote-api.md#styles)
- [Width and height](../../documentation/api.md#width)
- [Output name](../../documentation/api.md#outputname)