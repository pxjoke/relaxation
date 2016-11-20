var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlPlugin = require('html-webpack-plugin');
var path = require('path');
module.exports = {
    entry: "./app/src/app.js",
    output: {
        path: __dirname + "/app/dist",
        filename: "bundle.js"

    },

    module: {
        loaders: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ['es2015']
                }
            }
        ]


    },
    plugins: [
        new webpack.NoErrorsPlugin(),

        new HtmlPlugin({
            filename: 'index.html',
            inject: 'head',
            template: 'app/src/index.html'
        }),
        new ExtractTextPlugin("[name].css", {allChunks: true})
    ],
    devServer: {
        inline: true,
        port: 3333
    }
};
