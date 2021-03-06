const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    // mode: 'production',
    // entry: './demo/firebase-validation/app.js',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'mini-vue.js',
        devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]', // for vscode debugger to map source files
    },
    resolve: {
        extensions: ['.webpack.js', '.web.js', '.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            // {
            //     test: /\.css$/,
            //     use: ['style-loader', 'css-loader'],
            // },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    // options: {
                    //     presets: ['@babel/preset-env'],
                    // },
                },
            },
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            { test: /\.tsx?$/, loader: 'ts-loader' },

            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, loader: 'source-map-loader' },
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(
                JSON.parse(process.env.BUILD_DEV || 'true')
            ),
        }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            title: 'Output Management',
            template: path.resolve(__dirname, '../index.html'),
        }), // generate html
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(
                        __dirname,
                        '../demo/firebase-validation/style.css'
                    ),
                    to: path.resolve(__dirname, '../dist/'),
                },
            ],
        }),
    ],
};
