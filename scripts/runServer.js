const bodyParser = require('body-parser');
const {readDone} = require('./utils/yarnWorkspacesList');

readDone.tapPromise('webpack options', async childProjects => {
    const {join} = require('path');
    const rootDir = require('./utils/rootDir');
    const HtmlWebpackPlugin = require('html-webpack-plugin');

    const entry = {};
    const plugins = [];

    childProjects.forEach(w => {
        const name = w.name;
        w.distEntry = `${name}/index.html`;
        w.distName = name;
        entry[name] = join(rootDir, w.location, 'example/main.js');
        plugins.push(
            new HtmlWebpackPlugin({
                filename: w.distEntry,
                // favicon: 'public/favicon.ico',
                template: `public/index.html`,
                title: name,
                chunks: [name],
                minify: false,
            })
        );
    });

    plugins.push(
        new HtmlWebpackPlugin({
            templateContent: `
                <html>
                <head>
                    <style>
                        #components {
                            display: grid;
                            grid-template-columns: repeat(auto-fill, 200px);
                            grid-row-gap: 20px;
                            grid-column-gap: 20px;
                        }
                    </style>
                </head>
                <body>
                    <h1>服务列表</h1>
                    <div id="components">
${
    childProjects.map(
        ({distEntry, distName}) => `<a href="${distEntry}">${distName}</a>`
    ).join(' ')
}
                    </div>
                </body>
                </html>
            `,
        })
    );

    return {
        entry,
        plugins,
    };
});

readDone.tapPromise('dev server', async webpackOptions => {
    const portfinder = require('portfinder');
    const {merge} = require('webpack-merge');
    const webpack = require('webpack');
    const WebpackDevServer = require('webpack-dev-server');

    const BASE_PORT = 3000;
    const HOSTNAME = '0.0.0.0';

    portfinder.basePort = BASE_PORT;
    const port = await portfinder.getPortPromise();
    const config = require('./webpack/webpack.dev.js');
    const options = {
        publicPath: '/',
        // contentBase: './dist',
        hot: true,
        host: HOSTNAME,
        stats: {preset: 'normal', colors: true},
        historyApiFallback: true,
        // transportMode: {server: 'sockjs', client: 'sockjs'},
        before(app, server, compiler) {
            app.use(bodyParser.json());
            app.use(bodyParser.urlencoded({
                extended: true,
            }));
            app.use(require('./webpack/mock.js'));
        },
    };

    const uri = `http://${HOSTNAME}:${port}`;

    WebpackDevServer.addDevServerEntrypoints(config, options);

    const compiler = webpack(merge(config, webpackOptions));

    const server = new WebpackDevServer(compiler, Object.assign(options, {
        reporter: (...args) => reporter(...args, uri),
    }));

    server.listen(port, HOSTNAME);
});

function reporter(middlewareOptions, options, uri) {
    const {log, state, stats} = options;

    if (state) {
        const displayStats = middlewareOptions.stats !== false;
        const statsString = stats.toString(middlewareOptions.stats);

        // displayStats only logged
        if (displayStats && statsString.trim().length) {
            if (stats.hasErrors()) {
                log.error(statsString);
            }
            else if (stats.hasWarnings()) {
                // log.warn(statsString);
            }
            else {
                log.info(statsString);
            }
        }

        let message = 'Compiled successfully.';

        if (stats.hasErrors()) {
            message = 'Failed to compile.';
        }
        else if (stats.hasWarnings()) {
            message = 'Compiled with warnings.';
        }
        log.info(message);
        log.info(`Project is running at \u001b[1m\u001b[34m${uri}\u001b[39m\u001b[22m`);
    }
    else {
        log.info('Compiling...');
    }
}

