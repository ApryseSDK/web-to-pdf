# As a service.

You can use web-to-pdf as an online service to render PDFs!

This example uses a node + express server to provide a PDF rendering API. 

When the client presses the submit button, it sends a request to the API that tells it to render whatever remote page the user enters. When its done rendering, it returns the remote location of the generated PDF, and the client navigates there.

**This is a very basic example - more precautions should be taken in a real life scenerio**.

### Running

If you dont have the repo installed, do so by running:
```
git clone https://github.com/XodoDocs/web-to-pdf.git
cd web-to-pdf
npm i
```

Run the example:
```
npx babel-node examples/as-a-service/server.js
```

### Try the sample:
Navigate to http://localhost:8080 and enter a website to render as a PDF. A new tab will open displaying the PDF.