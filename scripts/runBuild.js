const argv = require('./utils/commander').buildArgv();
const {readDone} = require('./utils/yarnWorkspacesList');
const genWebpackOption = require('./utils/targetWorkspaceBuildOption');
const webpack = require('webpack');

readDone.tapPromise('filter childProjects', async childProjects => {
    if (argv.includes.length && !argv.release) {
        return argv.includes.reduce((arr, name) => {
            const target = childProjects.find(w => w.name === `@ys/${name}`);
            if (target) {
                arr.push(target);
            }
            return arr;
        }, []);
    }
    return childProjects;
});


readDone.tapPromise('selectWorkspace', async childProjects => {
    if (!childProjects.length) {
        throw new Error('no childProjects');
    }
    const options = childProjects.map(genWebpackOption);

    webpack(options, (err, stats) => {
        if (err) {
            console.error(err.stack || err);
            if (err.details) {
                console.error(err.details);
            }
            if (argv.release) {
                throw 'webpack error';
            }
            return;
        }

        let statsOptions = {
            colors: true,
            preset: argv.stats || 'normal',
        };

        // eslint-disable-next-line no-console
        console.log(stats.toString(statsOptions));

        if (argv.release && stats.hasErrors()) {
            throw 'build error';
        }
    });
});
