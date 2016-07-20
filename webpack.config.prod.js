'use strict';
const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const yargs = require('yargs');
const pack = require(path.resolve('./pack.js'));
const fs = require('fs');
console.log(fs);

fs.mkdirSync(path.resolve('./build'));

global.argv = yargs.boolean(['stdout', 'production', 'quiet'])
    .alias('P', 'production')
    .alias('p', 'port')
    .default('p', 9000)
    .argv;

global.port = global.argv.p;
global.prod = global.argv.production;

const config = {
  devtool: 'cheap-source-map',

entry: [
  require.resolve("webpack-dev-server/client/") + "?" +  "http://localhost" + ":" + global.port,
    pack.enterPath     
],

  output: {
    path: path.resolve('./build'),
    filename: '[chunkhash:8].build.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  resolveLoader: {
      modulesDirectories: [
          "web_loaders", "web_modules", "node_loaders", "node_modules",
          require('path').resolve(__dirname, 'node_modules')
      ]
  },
  module: {
    loaders: [
      {
        test: /\.js|jsx$/,
        exclude: /(node_modules|bower_components)/,
        loaders: ['babel']
      },
      {
        test: /(\.css|\.less)$/,
        loaders: ["style", "css", "less"]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url?limit=10000&name=[hash:8].[name].[ext]',
          'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
        ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production'),
      __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new HtmlWebpackPlugin({
      template: 'app/index.tpl.html',
      filename: 'index.html',
      inject: true
    }),
    new OpenBrowserPlugin({ url: `http://localhost:${global.port}/` })
  ]
};

module.exports = config;
