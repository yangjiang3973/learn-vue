const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development', //can also passed by cli: webpack --mode=production
    devtool: 'eval-source-map',
    devServer: {
        host: '0.0.0.0',
        contentBase: 'dist',
        publicPath: '/',
        compress: true,
        port: 8989,
        hot: true,
        inline: true,
        hotOnly: true,
        overlay: true,
        open: true,
        // historyApiFallback: {
        //     index: '/index.html',
        // },
        historyApiFallback: true,
        // when my own backend server is running
        // proxy: {
        //     "/api": "http://localhost:3000"
        // }
    },
    plugins: [new webpack.HotModuleReplacementPlugin()],
});
