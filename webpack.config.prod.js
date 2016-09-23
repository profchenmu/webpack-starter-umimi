'use strict';
const webpack = require('webpack');
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Pack = global.pack;
const _ = require('lodash');

var config = {
    devtool: 'cheap-source-map',
    entry: [
        Pack.enterPath || './app/index.js'
    ],

    output: {
        path: path.resolve('build'),
        filename: '[chunkhash:8].build.js',
        publicPath: './'
    },
    resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: Pack.alias || {},
        plugins: Pack.plugins || []
    },
    externals: Pack.externals || [],
    resolveLoader: {
        modulesDirectories: [
            'web_loaders', 'web_modules', 'node_loaders', 'node_modules',
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
                loaders: ['style', 'css', 'less']
            },
            {
                test: /\.(tpl|html)$/,
                loader: 'ejs'
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.(jpe?g|png|gif|svg|ttf|eot|woff|woff2)$/i,
                loaders: [
                    'url?limit=10000&name=[hash:8].[name].[ext]',
                    'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
                ]
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(['build'], {
            root: path.resolve(),
            verbose: true, 
            dry: false
        }),
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
            template: Pack.tplPath || './app/index.tpl.html',
            filename: 'index.html',
            inject: true
        }),
        new OpenBrowserPlugin({ url: `http://localhost:${global.port}/` })
    ]
};

if(Pack.plugins && Pack.plugins.length>0){
    _.each(Pack.plugins, function(e, i, l){
        var temp = new webpack.ProvidePlugin(e);
        config.plugins.push(temp);
    });
}

module.exports = config;
