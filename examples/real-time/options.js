module.exports = () => {

  const contentSource = {
    title: "Real time PDF building ya ya ya!!!!",
    subtitle: "Try changing me and see what happens wow",
    description: "You can change anything in this file, in src/index.html, or any other referenced files (like index.scss).<br/><br/>  <b>Its magic!</b>"
  }

  return {
    templateSource: './src/index.html',
    contentSource,
    outputName: "real-time",
    pageClass: "Split",
  }
}