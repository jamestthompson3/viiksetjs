const path = require('path')
module.exports = {
  mode: 'development',
  entry: './index.js',
  output: {
    /* eslint-disable-next-line */
    path: __dirname,
    filename: './dist/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: [/node_modules/],
        loader: 'babel-loader'
      }
    ]
  },
  resolve: {
    /* eslint-disable-next-line */
    modules: [
      path.resolve(__dirname, 'src/front/src'),
      path.resolve(__dirname, '../packages/web/'),
      'node_modules'
    ]
  },
  target: 'web'
}
