

module.exports = (html, pageClass, header = '', footer = '') => {

  const pageRegex = new RegExp(`<div.*?class=['"].*?${pageClass}.*?['"].*?>(.*?)<\/div>`, 'gms')

  return html.replace(pageRegex, (m, g1) => {
    const r = m.replace(g1, (match) => {
      return `<div class='webpdf-element webpdf-header'>${header}</div>
      ${match}
      <div class='webpdf-element webpdf-footer'>${footer}</div>`;
    });

    return r;
  })
}