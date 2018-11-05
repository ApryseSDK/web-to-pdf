# Function to PDF example
Web-to-pdf can accept a function as a source. This function can be async, meaning you can fetch data to use when rendering your PDF.

### Running

If you dont have the repo installed, do so by running:
```
git clone https://github.com/XodoDocs/web-to-pdf.git
cd web-to-pdf
npm i
```

Run the example:
```
npx babel-node examples/function-to-pdf/index.js
```

### APIs and Techniques Used
- [Function as template source](../../documentation/api.md#function)
- [SCSS Strings as styles](../../documentation/api.md#styles)
- [Output name](../../documentation/api.md#outputname)