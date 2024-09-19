const path = require('path');

const webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    filename: 'thoman.js',
    path: `${__dirname}/build`,
    libraryTarget: 'commonjs2',
  },

  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
  experiments: {
    topLevelAwait: true,
  },
};
