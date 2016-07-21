#!/usr/bin/env node

'use strict';

var webpack = require('webpack'),
	WebpackDevServer = require('webpack-dev-server'),
    yargs = require('yargs'),
	devConfig, prodConfig;
    

var baseConfig = function(config, contentBase) {
  return new WebpackDevServer(webpack(config), {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    contentBase: contentBase,
    stats: { colors: true },
    port: global.port
  });
};

global.argv = yargs.boolean(['stdout', 'production', 'quiet'])
    .alias('P', 'production')
    .alias('p', 'port')
    .default('p', 9000)
    .argv;
global.port = global.argv.p;
global.prod = global.argv.production;

var server;
if(global.prod) {
    prodConfig = require('./webpack.config.prod.js');
    console.log("production mode...");
    webpack(prodConfig).run(function(a, stats){
        console.log(stats.toString({
            colors: true
        }));
    });
} else {
    devConfig = require('./webpack.config.dev.js');
    server = baseConfig(devConfig, "/app");
    console.log("development mode...");
    server.listen(global.port, "localhost", function(err) {
        if(err) {
            console.log(err);
        }
        console.log('==> 🌎 Listening on port ' + global.port);
    });
}



