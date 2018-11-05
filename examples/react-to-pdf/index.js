const React = require('react');
const WebToPDF = require('../../src/index');
// const WebToPDF = require('@pdftron/web-to-pdf'); // or this

class RootComponent extends React.Component {
  render() {
    const data = [
      { firstName: "Homer", lastname: "Simpson" },
      { firstName: "Marge", lastname: "Simpson" },
      { firstName: "Lisa", lastname: "Simpson" },
      { firstName: "Bart", lastname: "Simpson" },
    ]

    return (
      <div className='Root'>
        <h1>Simpsons Characters</h1>
        {
          data.map(({ firstName, lastname }) => <ListItem firstName={firstName} lastname={lastname} key={firstName} />)
        }
      </div>
    )
  }
}

class ListItem extends React.Component {
  render() {
    return (
      <div className='ListItem'>
        <p>{this.props.firstName} {this.props.lastname}</p>
      </div>
    )
  }
}

(async () => {
  const renderer = new WebToPDF({ dirname: __dirname });

  await renderer.render({
    templateSource: RootComponent,
    outputName: 'react-to-pdf',
    styles: [
      `
        .Root {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .ListItem {
          p {
            font-size: 24px;
          }
        }
      `
    ]
  })

})()
