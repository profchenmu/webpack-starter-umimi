'use strict';
var webpack = require('webpack'),
    path = require('path');

var config = {
  devtool: "source-map",
  
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
        loader: 'babel',
        query: {
            optional: ['runtime'],
            stage: 0
        }
      },
      {
        test: /(\.css|\.less)$/,
        loaders: ["style", "css?sourceMap", "less?sourceMap"]
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          'url?limit=10000&name=img/[hash:8].[name].[ext]',
          'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
        ]
      }
    ]
  }
};

module.exports = config;
