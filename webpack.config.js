var path = require('path');
var webpack = require('webpack');

var frontendConfig = {
  entry: {
      app: [path.resolve(__dirname, 'js', 'app.js')]
  },
  output: {
      filename: 'app.js',
      path: path.resolve(__dirname, 'dist', 'js')
  },
  module: {
      loaders: [
          {
              exclude: /node_modules/,
              loader: 'babel',
              query: {
                  plugins: ['./build/babelRelayPlugin'],
              },
              test: /\.js$/,
          }
      ]
  },
  plugins: [
      new webpack.HotModuleReplacementPlugin()
  ],
};

module.exports = frontendConfig;
