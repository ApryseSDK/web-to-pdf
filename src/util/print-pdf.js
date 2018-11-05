module.exports = ({ url, scripts, style, browser, outputFolder, outputName, width, height, source, numberOfPages = 1 }) => {
  return new Promise(async (resolve) => {

    const page = await browser.newPage();

    const p = page.waitForNavigation();

    if (source) {
      await page.goto(source + '/' + outputName + "#node", {waitUntil: 'networkidle0'});
    } else {
      await page.goto(url, { waitUntil: 'networkidle0' });
    }

    await p;
    
    if (style && url) {
      await page.addStyleTag({
        content: style
      })
    }

    if (scripts && url) {
      await page.addScriptTag({
        content: scripts,
      })
    }

    await page.emulateMedia('screen');
    if (height === 'auto') {
      let override = Object.assign(page.viewport(), { width });
      await page.setViewport(override);

      height = await page.evaluate(() => {
        return document.documentElement.offsetHeight;
      });
    }

    await page.setViewport({ width, height });
    
    await page.pdf({
      path: `${outputFolder}/${outputName}.pdf`,
      printBackground: true,
      width: width + 'px',
      height: height + 'px',
      pageRanges: `1-${Math.max(1, numberOfPages)}`
    })

    const html = await page.content();

    await page.close();
  
    return resolve({
      browser,
      html
    });
  })
}