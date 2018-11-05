const path = require('path');

module.exports = (html, templateSource, dirname = __dirname) => {
  const regex = /<link.*href=['"](.*)['"]/g;
  let list = [];
  let pathToHTML = dirname;

  if (typeof templateSource === 'string' && templateSource.endsWith('.html')) {
    pathToHTML = path.resolve(dirname, path.dirname(templateSource));
  }

  html.replace(regex, (m, g1) => {
    if (g1.startsWith('http')) return html;
    
    list.push(path.resolve(pathToHTML, g1));
    return html;
  })

  return list;

}