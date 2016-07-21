'use strict';
const webpack = require('webpack');
const path = require('path');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Pack = global.pack;

let config = {
    devtool: 'source-map',
    resolve: {                                     
        extensions: ['', '.js', '.jsx'],
        alias: Pack.alias || {},
        plugins: Pack.plugins || [],
    },

    resolveLoader: {
        modulesDirectories: [
            'web_loaders', 'web_modules', 'node_loaders', 'node_modules',
            require('path').resolve(__dirname, 'node_modules')
        ]
    },
    externals: Pack.externals || [],
    output: {                                   
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
        publicPath: `http://localhost:${global.port}/`
    },
    entry: [
        path.resolve(__dirname, 'node_modules/webpack/hot/dev-server'),
        `${require.resolve('webpack-dev-server/client/')}?http://localhost:${global.port}`,
        Pack.enterPath || './app/index.js' 
    ],
    plugins: [
        new HtmlWebpackPlugin({
            template: Pack.tplPath || './app/index.tpl.html',
            inject: 'body',
            filename: 'index.html'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || 'false'))
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new OpenBrowserPlugin({ url: `http://localhost:${global.port}/` })
    ],
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
                loaders: ['style', 'css?sourceMap', 'less?sourceMap']
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
