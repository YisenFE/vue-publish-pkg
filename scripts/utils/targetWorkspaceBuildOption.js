const {join} = require('path');

const {merge} = require('webpack-merge');
const webpackCommonConfig = require('../webpack/webpack.common');
const rootDir = require('./rootDir');

function genWebpackOption({location}) {
    const packageJSON = require(join(rootDir, location, 'package.json'));
    const {buildOptions} = packageJSON;
    const webpackConfig = merge(webpackCommonConfig, {
        entry: {
            index: join(rootDir, location, 'src/index'),
        },
        output: {
            path: join(rootDir, location, 'dist'),
            filename: '[name].js',
            clean: true,
            library: {
                type: 'umd',
            },
        },
    }, buildOptions || {});

    return webpackConfig;
}

module.exports = genWebpackOption;
