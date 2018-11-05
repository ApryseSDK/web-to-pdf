const writeFile = require('./util/write-file');
const copyFile = require('./util/copy-dir');
const chalk = require('chalk');

class Writer {
  constructor(debug) {
    this.writes = {};
    this.debug = debug;
  }

  addWrite = (type, method, to, from) => {
    if (!this.writes[type]) {
      this.writes[type] = [];
    }
    this.writes[type].push({
      method,
      to,
      from
    });
  }

  write = async () => {

    if (this.debug) {
      console.log(chalk.bgCyan.whiteBright("\nMaking the following writes:"));
    }

    const p = Object.keys(this.writes).map((type) => new Promise(async (r) => {
      const writesForType = this.writes[type];

      const pp = writesForType.map((writeData) => new Promise(async rr => {
        const { method, to, from } = writeData;

        if (method === METHODS.COPY) {

          if (this.debug) {
            console.log(chalk.cyan(`Copying ${chalk.bold(from)} to ${chalk.bold(to)}`))
          }

          await copyFile(from, to);
        } else {

          if (this.debug) {
            console.log(chalk.cyan(`Writing ${chalk.bold(to)}`))
          }

          await writeFile(to, from);
        }

        rr();
      }))

      await Promise.all(pp);
      r();
    }));

    await Promise.all(p);

    const copy = { ...this.writes };

    this.writes = {};

    console.log('\n');

    return copy;
  }
}

const TYPES = {
  HTML: 'html',
  CSS: 'css',
  SCRIPT: 'script',
  ASSET: 'assets'
}

const METHODS = {
  DATA: "data",
  COPY: "copy"
}

module.exports = Writer;
module.exports.TYPES = TYPES;
module.exports.METHODS = METHODS;