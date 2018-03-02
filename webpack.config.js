const webpack = require('webpack');
const path = require('path');
const ClearPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const inProduction = process.env.NODE_ENV == 'production';

module.exports = {

    entry: {
        app: [
            './src/app.js',
            './src/app.scss',
        ],
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

            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    use: ['css-loader', 'postcss-loader', 'sass-loader'],
                    fallback: 'style-loader'
                }),
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
        new ExtractTextPlugin('app.css'),
        new webpack.LoaderOptionsPlugin({
            minimize: inProduction
        }),
    ],

    resolve: {
        extensions: ['*', '.js'],
    }

};