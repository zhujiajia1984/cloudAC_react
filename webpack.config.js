const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
        main: ['./src/index.js'],
        vendor: ['react', 'react-dom', 'react-router-dom']
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    devServer: {
        contentBase: [path.join(__dirname, "dist"), path.join(__dirname, "assets/images"), ],
        port: 18202,
        historyApiFallback: true,
    },
    devtool: 'source-map', // source-map
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
            }
        }, {
            test: /\.less$/,
            use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                use: [
                    { loader: "css-loader" },
                    {
                        loader: "less-loader",
                        options: {
                            modifyVars: {
                                '@primary-color': '#1DA57A',
                            }
                        }
                    }
                ]
            })
        }]
    },
    plugins: [
        new ExtractTextPlugin('style.css'),
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: Infinity,
        }),
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'cloudAC',
            template: './src/TemplateHtml/index.html',
        })
    ]
}