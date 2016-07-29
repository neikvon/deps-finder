import babel from 'rollup-plugin-babel'

let pkg = require('./package.json');
let external = Object.keys(pkg.dependencies);

export default {
  entry: `src/${process.env.entry}.js`,
  format: 'cjs',
  plugins: [babel({
    presets: ['es2015-rollup']
  })],
  external: external,
  dest: `dst/${process.env.entry}.js`
}