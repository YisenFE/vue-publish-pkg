// Modules
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const {VueLoaderPlugin} = require('vue-loader');
const isDev = require('../utils/isDev');

// Configs
const {images, svg, media} = require('./assets');
module.exports = {
    mode: 'production',
    target: 'browserslist',
    optimization: {
        minimize: false,
        // runtimeChunk: true,
        minimizer: [
            `...`,
            new CssMinimizerPlugin(),
        ],
    },
    module: {
        rules: [
            {test: /.tsx?$/, use: 'ts-loader', exclude: /node_modules/},
            {
                test: /\.vue$/,
                loader: 'vue-loader',
            },
            {
                test: /.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: [
                                ],
                            },
                        },
                    },
                    'sass-loader',
                ],
            },
            images,
            svg,
            media,
        ],
    },
    resolve: {
        extensions: ['.ts', '.js', '.vue', '.json'],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: isDev ? '[name]/index.css' : '[name].css',
        }),
        new VueLoaderPlugin(),
    ],
};
