const Path = require('path');

module.exports = (html, dirname) => {
  const results = {};

  html.replace(/<(?!script).*?src=['"](.*?)['"].*?>/gm, (m, g1) => {

    console.log(g1);

    g1 = g1.trim();
    
    if (g1.startsWith('http')) return m;

    const fullPath = Path.resolve(dirname, g1);
    results[fullPath] = true;
    return m;
  });

  return Object.keys(results);

}