# Dynamic Content Example
This is an example of using dynamic content in your PDFs.

This is useful for writing a script to generate a PDF invoice, report, report card, etc. You can use your own service to fetch the content and dynamically insert it into your template.

### Running

If you dont have the repo installed, do so by running:
```
git clone https://github.com/XodoDocs/web-to-pdf.git
cd web-to-pdf
npm i
```

Run the example:
```
npx babel-node examples/dynamic-content
```

### APIs and Techniques Used
- [HTML File as template source](../../documentation/api.md#html-file)
- [Dynamic content](../../documentation/content.md)
- [Output name](../../documentation/api.md#outputname)