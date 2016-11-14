#!/usr/bin/env node

'use strict';
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const yargs = require('yargs');
const fs = require('fs');
const proxy = require('http-proxy-middleware');
let baseConfig, devConfig, prodConfig, server;

const pack = path.resolve('./pack.js');

if(!fs.existsSync(pack)){
    console.log('no pack.js found.');
    global.pack = {};
}else{
    global.pack = require(pack);
}

baseConfig = function(config, contentBase) {
	var cao = new WebpackDevServer(webpack(config), {
		historyApiFallback: true,
		hot: true,
		inline: false,
		progress: true,
		contentBase: contentBase,
		stats: { colors: true },
		port: global.port,
	});
	return cao;
};

global.argv = yargs.boolean(['production'])
    .alias('P', 'production')
    .alias('p', 'port')
    .default('p', 9009)
    .argv;
    
global.port = global.argv.p;
global.prod = global.argv.production;
global.target = global.pack.target || 'http://localhost:8080';

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
    var options = {
        target: global.target,
        changeOrigin: true
    },
    	exampleProxy = proxy(options);

    server.use('/wlt_ebp_web_dev_1.6.0', exampleProxy);

    console.log('development mode...');
    server.listen(global.port, 'localhost', function(err) {
        if(err) {
            console.log(err);
        }
        console.log('==> 🌎 Listening on port ' + global.port);
    });
}



