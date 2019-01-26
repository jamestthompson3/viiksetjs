import rollupBabel from 'rollup-plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'

const deps = Object.keys({
  ...pkg.dependencies,
  ...pkg.peerDependencies
})

export default {
  input: './src/index.js',
  output: { dir: 'lib', format: 'es' },
  external: deps,
  plugins: [
    resolve(),
    rollupBabel({
      exclude: 'node_modules/**'
    }),
    commonjs({
      namedExports: {
        'node_modules/lodash/get.js': ['get'],
        'node_modules/react-sizeme/dist/react-sizeme.js': ['SizeMe']
      }
    })
  ]
}
