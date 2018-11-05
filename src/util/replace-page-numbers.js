const cheerio = require('cheerio')


module.exports = (html, pageClass) => {
  
  const regex = /\{\{pageNumber\}\}/gms;

  if (!html.match(regex)) {
    return html;
  }

  const $ = cheerio.load(html);

  $(`.${pageClass}`).map(function (index) {
    let o = $(this);
    let innerText = o.html();
    innerText = innerText.replace(regex, index + 1);
    return o.html(innerText);
  });

  return $.html();
}