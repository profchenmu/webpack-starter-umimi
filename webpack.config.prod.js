'use strict';
const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Pack = global.pack;

var config = {
    devtool: 'cheap-source-map',
    entry: [
        Pack.enterPath || './app/index.js'
    ],

    output: {
        path: path.resolve('build'),
        filename: '[chunkhash:8].build.js',
        publicPath: '/'
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
                loaders: ["style", "css", "less"]
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
            template: Pack.tplPath || './app/index.tpl.html',
            filename: 'index.html',
            inject: true
        }),
        new OpenBrowserPlugin({ url: `http://localhost:${global.port}/` })
    ]
};

module.exports = config;
