# Creating Pages
Creating pages is easy! All you need to do is apply the class `.Page` to a wrapper div. From this point, anything in that container will be part of the page.

You can also use your own identifier to split pages. Pass in your custom value to the [pageClass](./api.md#pageClass) and it will be used to split pages.

To create multiple pages, simply include mulitple page divs.

**If you do not include a page div, all your content will be wrapped in a page.**

[Click here](./api.md) for the full Renderer API

## Page numbers
Page numbers can be inserted by using `{{pageNumber}}` The mustache will be automatially replaced with the proper page number.

## Examples

### HTML

```js

const html = `
<html>
  <body>
    <div class='Page'>
      page {{pageNumber}}
    </div>

    <div class='Page'>
      page {{pageNumber}}
    </div>

    <div class='Page'>
       page {{pageNumber}}
    </div>
  </body>
</html>
`

const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  templateSource: html,
});

// NOTE: You do not have to include the <html> or <body> tags if you have no header items. So this would be okay as well:
/*
const html = `
  <div class='Page'>
    page {{pageNumber}}
  </div>

  <div class='Page'>
    page {{pageNumber}}
  </div>

  <div class='Page'>
      page {{pageNumber}}
  </div>
`
*/

```

### React

```js
const React = require('react');
const Renderer = require('@pdftron/web-to-pdf');

class Component extends React.Component {
  render() {
    return (
      <React.Fragment>
        <div className='Page'>
          Page {`{{pageNumber}}`}
        </div>

        <div className='Page'>
          Page {`{{pageNumber}}`}
        </div>

        <div className='Page'>
          Page {`{{pageNumber}}`}
        </div>
      </React.Fragment>
    )
  }
}

const renderer = new Renderer({ dirname: __dirname });
renderer.render({
  templateSource: Component,
});
```