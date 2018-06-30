module.exports = {
  mode: 'development',
  entry: './assets/js/main.js',
  watch: false,
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

