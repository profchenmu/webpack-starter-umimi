#!/usr/bin/env node

'use strict';
/*eslint no-console: 0*/

var path = require('path'),
    glob = require('glob'),
    
    webpack = require('webpack'),
	webpackDevServer = require('webpack-dev-server'),
	devConfig = require('./webpack.config.dev.js'),
    prodConfig = require('./webpack.config.prod.js');




var baseConfig = function(config, contentBase) {
  return new webpackDevServer(webpack(config), {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    contentBase: contentBase,
    stats: { colors: true },
    port: global.port
  });
};
var server;
// console.log(prodConfig)
if(global.prod) {
    // webpack(prodConfig);
    console.log("production mode...");
    webpack(prodConfig).run(function(a, stats){
        console.log(stats.toString({
            colors: true
        }));
    });
    
} else {
    server = baseConfig(devConfig, "/app");
    console.log("development mode...");
    server.listen(global.port, "localhost", function(err) {
        if(err) {
            console.log(err);
        }
        console.log('==> 🌎 Listening on port ' + global.port);
    });
}



