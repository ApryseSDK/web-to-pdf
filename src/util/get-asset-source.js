const Path = require('path');

module.exports = (html, css, dirname) => {
  const results = {};

  const getter = (m, g1) => {
    g1 = g1.trim();
    
    if (g1.startsWith('http')) return m;

    const fullPath = Path.resolve(dirname, g1);
    results[fullPath] = true;
    return m;
  }

  html.replace(/<(?!script).*?src=['"](.*?)['"].*?>/gm, getter);

  if (css) {
    css.replace(/url\(['"](.*?)['"]\)/gm, getter);
  }

  return Object.keys(results);
}