import template from '../templates/_index';

const { extname } = require('path');

const getFiles = (bundle) => {
  const files = Object.values(bundle).filter(
    (file) => file.isEntry || (typeof file.type === 'string' ? file.type === 'asset' : file.isAsset)
  );
  const result = {};
  for (const file of files) {
    const { fileName } = file;
    const extension = extname(fileName).substring(1);
    result[extension] = (result[extension] || []).concat(file);
  }
  return result;
};

export default function html() {
  return {
    name: 'htmlPlugin',
    buildStart() {
      this.addWatchFile('templates/_index.js');
      this.addWatchFile('templates/_styles.js');
    },
    async generateBundle(output, bundle) {
      const files = getFiles(bundle);
      this.emitFile({
        fileName: 'index.html',
        name: 'index.html',
        source: await template({ files }),
        type: 'asset',
      });
    },
  };
}
