const webpack = require('webpack');
const path = require('path');
const ClearPlugin = require('clean-webpack-plugin');

module.exports = {

    entry: {
        app: './src/app.js'
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'app.js'
    },

    module: {

        rules: [

            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },

            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/,
            },

        ]

    },

    plugins: [
        new ClearPlugin(['build'], {
            dist: __dirname,
            verbose: true,
            dry: false,
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
    ],

    resolve: {
        extensions: ['*', '.js'],
    }

};