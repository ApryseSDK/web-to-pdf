const cheerio = require('cheerio')

module.exports = (html, pageClass) => {
  const $ = cheerio.load(html);

  const pages = $(`.${pageClass}`);

  if (pages.length > 0) return html;

  const bodyRegex = /<body.*?>(.*?)<\/body>/gms;

  return html.replace(bodyRegex, (m ,g1) => {
    return `<body><div class='${pageClass}'>${g1}</div></body>`
  })

}