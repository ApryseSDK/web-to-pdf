const fs = require('fs-extra')

module.exports = (from, to) => {
  return new Promise(async (resolve) => {

    var cbCalled = false;

    var rd = fs.createReadStream(from);
    rd.on("error", function(err) {
      done(err);
    });
    var wr = fs.createWriteStream(to);
    wr.on("error", function(err) {
      done(err);
    });
    wr.on("close", function(ex) {
      done();
    });
    rd.pipe(wr);
  
    function done(err) {
      if (!cbCalled) {
        return resolve();
        cbCalled = true;
      }
    }

  })
}