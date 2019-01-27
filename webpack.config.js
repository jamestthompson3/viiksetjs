const path = require('path')
module.exports = {
  mode: 'development',
  entry: './examples/index.js',
  output: {
    /* eslint-disable-next-line */
    path: __dirname,
    filename: './examples/bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    /* eslint-disable-next-line */
    modules: [path.resolve(__dirname, 'src/front/src'), 'node_modules']
  },
  target: 'web'
}
