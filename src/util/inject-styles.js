

module.exports = (html, hasCustom) => {

  let match = false;

  const css = `
    <link rel='stylesheet' href='index.css'>
    ${hasCustom ? `    <link rel='stylesheet' href='custom.css'>` : ''}
  `;

  html = html.replace(/<link.*?href=['"].*?scss.*?['"].*>/gm, '');

  // if there is a head tag present
  html = html.replace(/<head>(.*)<\/head>/ms, (fm, g1) => {
    match = true;
    return `
    <head>
      ${g1.trim()}
      ${css.trim()}
    </head>
    `;
  });

  // if there is no head tag present
  if (!match) {
    html = html.replace(/<html>(.*)<\/html>/ms, (fm, g1) => {
      match = true;
      return `
      <html>
        <head>
          ${css.trim()}
        </head>

        ${g1.trim()}
      </html>
      `;
    });
  }

  if (!match) {
    console.warn("Please make sure your html is formatted properly. CSS styles could not be injected.");
  }


  return html;

}