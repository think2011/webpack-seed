var path              = require("path");
var webpack           = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var precss            = require('precss');
var autoprefixer      = require('autoprefixer');

const PRODUCTION = process.env.NODE_ENV === 'production'

module.exports = {
    devtool  : 'eval-source-map',
    devServer: {
        hot   : true,
        inline: true,
        port  : 3000
    },
    entry    : './app.js',
    output   : {
        path    : './dist',
        filename: 'bundle.js'
    },
    module   : {
        loaders: [
            {
                test  : /\.html$/,
                loader: "raw!html"
            },
            {
                test  : /\.css$/,
                loader: PRODUCTION ? ExtractTextPlugin.extract("style", "css!postcss") : "style!css!postcss"
            },
            {
                test  : /\.scss$/,
                loader: PRODUCTION ? ExtractTextPlugin.extract("style", "css!postcss!sass") : "style!css!postcss!sass"
            },
            {
                test   : /\.js$/,
                loader : 'babel',
                exclude: /node_modules/
            },
            {
                test  : /\.json$/,
                loader: 'json'
            },
            {
                test  : /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url',
                query : {
                    limit: 10000
                }
            },
            {
                test  : /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url',
                query : {
                    limit: 10000
                }
            },
        ]
    },
    postcss  : function () {
        return [precss, autoprefixer];
    },
    plugins  : [
        new webpack.NoErrorsPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new HtmlWebpackPlugin(
            {
                minify  : false,
                template: './index.html'
            }
        ),
    ]
}

if (PRODUCTION) {
    module.exports.devtool         = ''
    module.exports.devServer       = {}
    module.exports.output.filename = 'bundle.[hash:7].js'
    module.exports.plugins.splice(1, 1)
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
        new ExtractTextPlugin("[name].[hash:7].css"),
        new webpack.optimize.CommonsChunkPlugin('common.[hash:7].js'),
        new webpack.optimize.OccurenceOrderPlugin()
    ])
}