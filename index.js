#!/usr/bin/env node

'use strict';
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const yargs = require('yargs');
const fs = require('fs');
let baseConfig, devConfig, prodConfig, server;

const pack = path.resolve('./pack.js');

if(!fs.existsSync(pack)){
    console.log('no pack.js found.');
    global.pack = {};
}else{
    global.pack = require(pack);
}

baseConfig = function(config, contentBase) {
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

if(global.prod) {
    prodConfig = require('./webpack.config.prod.js');
    console.log('production mode...');
    webpack(prodConfig).run(function(a, stats){
        console.log(stats.toString({
            colors: true
        }));
    });
} else {
    devConfig = require('./webpack.config.dev.js');
    server = baseConfig(devConfig, global.pack.serverRoot || '/app');
    console.log('development mode...');
    server.listen(global.port, 'localhost', function(err) {
        if(err) {
            console.log(err);
        }
        console.log('==> 🌎 Listening on port ' + global.port);
    });
}



