module.exports = {
  mode: 'development',
  entry: './js-src/main.js',
  output: {
    path: __dirname + '/assets/js',
    filename: "bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
}

