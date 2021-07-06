// Modules
const {merge} = require('webpack-merge');
const webpackCommonConfig = require('./webpack.common');

const devConfig = {
    devtool: 'inline-source-map',
    // https://github.com/webpack/webpack-dev-server/issues/2758
    target: 'web',
    output: {
        filename: '[name]/index.js',
        clean: true,
        library: {
            type: 'umd',
        },
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            cacheGroups: {
                vendors: {
                    chunks: 'all',
                    priority: -20,
                    test: /[\\/]node_modules[\\/]/,
                    name(module) {
                        return module.rawRequest;
                    },
                    filename: () => {
                        return `vendor-[name].js`;
                    },
                },
            },
        },
    },
};

module.exports = merge(webpackCommonConfig, devConfig);
