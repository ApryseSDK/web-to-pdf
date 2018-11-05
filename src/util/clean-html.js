
module.exports = (input, includeOuter) => {
  input = input.replace(/&amp;/g, '&');
  input = input.replace(/&lt;/g, '<');
  input = input.replace(/&gt;/g, '>');
  input = input.replace(/&#x27;/g, '"')
  input = input.replace(/\\n/g, `
  `)

  if (includeOuter) {
    const html = /<html(.*)<\/html>/gms;
    const body = /<body.*<\/body>/gms;
    const hasBody = input.match(body);

    if (!input.match(html)) {
      if (hasBody) {
        input = `<html>${input}</html>`
      } else {
        input = `<html><body>${input}</body></html>`
      }
    } else if (!hasBody) {
      input = input.replace(html, (m ,g1) => {
        return `<html><body>${g1}</body></html>`
      })
    } 
  }

  return input;  
}