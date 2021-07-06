const {join} = require('path');
const rootDir = require('../utils/rootDir');

// TODO: get请求mock方式
module.exports = function proxyServer(req, res, next) {
    let path = req.path;
    try {
        if (req.headers.isajax === 'true') {
            const mockPath = join(rootDir, `mock/${path}/index.js`);
            // eslint-disable-next-line no-console
            console.log(`request: ${path} mock to ${mockPath}`);
            // res.writeHead(200, {'Content-Type': 'text/html;charset:UTF-8'});
            res.end(JSON.stringify(require(mockPath)(req.body)));
            delete require.cache[require.resolve(mockPath)];
        }
    }
    catch (error) {
        console.error(error);
    }
    return next();
};
