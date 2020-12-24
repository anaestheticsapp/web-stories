import nodeResolve from '@rollup/plugin-node-resolve';
import rimraf from 'rimraf';
import resolveDirs from './lib/resolve-dirs.js';
import copyPlugin from './lib/copy-plugin.js';
import html from './lib/html-plugin.js';

const isProduction = process.env.BUILD === 'production';

function build() {
  return {
    input: {
      main: 'src/main.js',
    },
    preserveEntrySignatures: false,
    output: {
      entryFileNames: 'js/[name].[hash].js',
      chunkFileNames: 'js/[name]-[hash].js',
      assetFileNames: 'assets/[name].[hash][extname]',
      dir: 'dist/',
      format: 'esm',
      plugins: [],
      sourcemap: isProduction ? false : true,
    },
    plugins: [
      nodeResolve(),
      resolveDirs(['logic', 'components', 'helpers']),
      copyPlugin([
        { from: './src/assets/stories/', to: './dist/assets/stories/' },
      ]),
      html(),
    ],
  };
}

rimraf.sync('dist/');
export default build();
