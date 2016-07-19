#!/usr/bin/env node

'use strict';
/*eslint no-console: 0*/

var path = require('path'),
    glob = require('glob'),
    // pkg = require('../package.json'),
    yargs = require('yargs'),
    webpack = require('webpack'),
	webpackDevServer = require('webpack-dev-server'),
	devConfig = require('./webpack.config.dev.js'),
	OpenBrowserPlugin = require('open-browser-webpack-plugin'),
	HtmlWebpackPlugin = require('html-webpack-plugin');

var pack = require(path.resolve('./pack.js'));
	// prodConfig = require('./webpack.config.prod.js');

var baseConfig = function(config, contentBase) {
	return new webpackDevServer(webpack(config), {
		historyApiFallback: true,
		hot: true,
		inline: true,
		progress: true,
		contentBase: contentBase,
		stats: { colors: true }
	});
};

global.argv = yargs.boolean(['stdout', 'production', 'quiet'])
    .alias('P', 'production')
    .alias('p', 'port')
    .default('p', 9000)
    .argv;

global.port = global.argv.port;

devConfig.output = {                                   
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
    publicPath: `http://localhost:${global.port}/`
};

devConfig.plugins = [
    new HtmlWebpackPlugin({
      // template: path.resolve(__dirname, 'app/index.tpl.html'),
      template: pack.tplPath,
      inject: 'body',
      filename: path.resolve('./index.html')
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
      __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new OpenBrowserPlugin({ url: `http://localhost:${global.port}/` })
];

devConfig.entry = [
    path.resolve(__dirname, 'node_modules/webpack/hot/dev-server'),
    require.resolve("webpack-dev-server/client/") + "?" +  "http://localhost" + ":" + global.port,
    // path.resolve(__dirname, `node_modules/webpack-dev-server/client/?http://localhost:${global.port}`),
    pack.enterPath
    // path.resolve(__dirname, 'app/index.js')      
];

var server;
// if(isDeveloping) {
	baseConfig.port = global.argv.port;
	server = baseConfig(devConfig, "./app");
	console.log("development mode...");
// } else {
// 	server = baseConfig(prodConfig, "./build");
// 	console.log("production mode...");
// }

server.listen(global.port, "localhost", function(err) {
	if(err) {
		console.log(err);
	}
	console.log('==> 🌎 Listening on port ' + global.port);
});

