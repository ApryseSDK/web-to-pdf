import Renderer from '../../src';

const r = new Renderer({ dirname: __dirname });

r.render({
  templateSource: 'index.html',
  outputName: 'pageNumbers'
})
