'use strict';
const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const prog = require('commander');

var command = function(c) {
    prog
        .command(c.command)
        .description(c.description)
        .action(c.action);
};
prog
    .option('-P, --production', 'release for production')
    .option('-p, --port [port]', 'port of the dev server')
    .option('--quiet', 'quiet compile')
    .option('--stdout', 'output to stdout');

global.port = prog.port || 9090;

console.log(global.port)

const config = {
  devtool: 'cheap-source-map',
  entry: [
    `webpack-dev-server/client?http://localhost:${global.port}`,
    path.resolve(__dirname, 'app/index.js')
  ],
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[chunkhash:8].bundle.js',
    publicPath: '/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
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
