var path = require('path');
var webpack = require('webpack');
module.exports = {
    enterPath: './app/main.js',
    tplPath: './app/index.tpl.html',
    serverRoot: './app',
    plugins: [
    	{
		    $: 'jquery',
		    jQuery: 'jquery',
		    'window.jQuery': 'jquery'
		}
    ],
	alias: {
		marionette: 'backbone.marionette',
		application: path.resolve('app/application'),
		core: path.resolve('app/core'),
		share: path.resolve('app/share'),
		modules: path.resolve('app/modules')
	},
	target: 'http://localhost:8080'
};