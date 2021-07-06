const isDev = require('../utils/isDev');

const inlineLimit = 4 * 1024; // 4KB

function genAsset(dir) {
    return {
        publicPath: isDev ? '../' : './',
        filename: `${dir}/[name][ext]`,
    };
}

function genAssetRule(dir, test) {
    return {
        test,
        type: 'asset',
        parser: {
            dataUrlCondition: {maxSize: inlineLimit},
        },
        generator: genAsset(dir),
    };
}

function genAssetResourceRule(dir, test) {
    return {
        test,
        type: 'asset/resource',
        generator: genAsset(dir),
    };
}

// function genAssetInlineRule(dir, test) {
//     return {
//         test,
//         type: 'asset/inline'
//     };
// }

const images = genAssetRule('img', /\.(png|jpe?g|gif|webp)(\?.*)?$/);
const svg = genAssetResourceRule('img', /\.(svg)(\?.*)?$/);
const media = genAssetRule('fonts', /\.(woff2?|eot|ttf|otf)(\?.*)?$/i);

module.exports = {
    images,
    svg,
    media,
};

