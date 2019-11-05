const chalk = require('chalk');
const getRenderType = require('./get-render-type');
const insertContent = require('./insert-content');
const reactToHTML = require('./react-to-html');
const Path = require('path');
const readFile = require('./read-file');

const TYPES = getRenderType.TYPES;

module.exports = ({debug, listening, dirname, content}) => async (templateSource, chunkName) => {

  const renderType = getRenderType(templateSource, content);
  let html = null;

  if (debug && !listening) {
    console.log(chalk.black(`Using type ${chalk.whiteBright.bold.bgBlack(' ' + renderType + ' ')} for ${chalk.bold(chunkName)}`));
  }

  switch (renderType) {
    case TYPES.REACT_COMPONENT:
      {
        html = reactToHTML({ Component: templateSource, content })
        break;
      }
    case TYPES.CUSTOM_FUNCTION:
      {
        html = await templateSource(content);
        break;
      }
    case TYPES.HTML_STRING:
      {
        html = templateSource;
        break;
      }
    case TYPES.HTML_FILE:
      {
        html = await readFile(Path.resolve(dirname, templateSource));
        if (html === null) {
          throw new Error(`File ${templateSource} was not found.`);
        }
        break;
      }
  }

   // replace content
   if (content) {
    html = insertContent(html, content);
  }

  return html;
}