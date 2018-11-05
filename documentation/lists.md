# Lists

When rendering lists of data, its possible that the contents of the list will overflow off the page. We solve this problem by dynamically altering your lists to fit to individual pages.

To use this feature, simply wrap your list contents in a `.List` class. We will take any overflow content and insert it into a new page!

```js
<div className='Page'>
  <div className='List'>
    {
      myItems.map(item => {
        return <h1>{item}</h1>
      })
    }
  </div>
</div>

```