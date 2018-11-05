// this script checks that at least one .Page exists

module.exports = (html) => {
  return html.match(/class=['"]\s?Page\s?['"]/gms);
}