'use strict'
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
    entry: {
        main: ['./src/main.js']
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            include: path.resolve(__dirname, './src'),
            loaders: 'babel-loader'
        }]
    },
    plugins: [
        new CopyWebpackPlugin([{
            context: './public',
            from: '*.*'
        }])
    ],
    devServer: {
        contentBase: './public',//public 폴더 안  index 파일
        host: 'localhost',
        port:8080
    }
}
