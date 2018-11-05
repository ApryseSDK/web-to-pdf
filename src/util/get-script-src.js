const path = require('path');

module.exports = (html, templateSource, dirname = __dirname) => {
  const regex = /<script.*src=['"](.*)['"]/g;
  let list = [];

  let htmlPath = dirname;
  if (typeof templateSource === 'string' && templateSource.endsWith('.html')) {
    htmlPath = path.resolve(dirname, path.dirname(templateSource));
  }

  html.replace(regex, (m, g1) => {
    if (g1.startsWith('http')) return html;
    
    list.push({
      fullPath: path.resolve(htmlPath, g1),
      relativePath: g1
    });
    return html;
  })

  return list;

}