# Dynamic Content

We use mustache syntax to do content replacements. You may use mustache syntax in any html [templateSource](api.md#templateSource). The replacement happens AFTER the html is generated on the server.

Your content can be loaded by the [contentSource](api.md#contentSource) option.

If you are using client side JS (like React) to generate your DOM, mustaches will not be replaced. In this case, the content will be available at `window.content` for you to use dynamically.

Content can be nested (see examples below)

## Examples:

- [In HTML](#in-html-file)
- [In templateSource function](#in-templatesource-function)
- [In react component](#in-react-component)

## In HTML file

index.js
```js
const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  contentSource: 'content.json',
  templateSource: 'index.html',
});
```

index.html
```html
<html>
  <body>
    <p>{{ myData }}</p>
    <p>{{ my.nested.data }}</p>
  </body>
</html>
```

content.json
```json
{
  "myData": "Hello world!",
  "my": {
    "nested": {
      "data": "Goodbye world!"
    }
  }
}
```

output:
```html
<html>
  <body>
    <p>Hello world!</p>
    <p>Goodbye world!</p>
  </body>
</html>
```

## In templateSource function

index.js
```js
const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  contentSource: 'content.json',
  templateSource: (content) => {
    return `
      <html>
        <body>
          <p>${content.myData}</p>

          ${
            content.my.nested.data.map(item => {
              return `<p>${item}</p>`
            })
          }
        </body>
      </html>
    `
  }
});
```

content.json
```json
{
  "myData": "Hello world!",
  "my": {
    "nested": {
      "data": ["hey", "how", "are", "you"]
    }
  }
}
```

output:
```html
<html>
  <body>
    <p>Hello world!</p>
    <p>hey</p>
    <p>how</p>
    <p>are</p>
    <p>you</p>
  </body>
</html>
```

## In react component (server side)
Content is passed as a prop to the React component, but you can even use the mustache in your react component if you want.

index.js
```js
class Comp extends React.Component {
  render() {
    const { content } = this.props;
    return (
      <div>
        <p>{`{{ myData }}`}</p>
        <p>{content.myData}</p>
      </div>
    )
  }
}

const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  contentSource: 'content.json',
  templateSource: Comp, // passing this directly does a server render
});
```

content.json
```json
{
  "myData": "Hello world!"
}
```

output
```html
<html>
  <body>
    <div>
      <p>Hello world!</p>
      <p>Hello world!</p>
    </div>  
  </body>
</html>
```

