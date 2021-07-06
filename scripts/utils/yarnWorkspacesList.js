const {spawn} = require('child_process');
const logger = require('./logger');
const {AsyncSeriesWaterfallHook} = require('tapable');

const ls = spawn('yarn', ['workspaces', 'list', '--json']);
const projects = [];
const hooks = {
    readDone: new AsyncSeriesWaterfallHook(['childProjects']),
};

ls.stdout.on('data', data => {
    const workspaces = data.toString()
        .split(/\n/)
        .filter(Boolean)
        .map(JSON.parse);
    projects.push(...workspaces);
});

ls.stderr.on('data', error => {
    logger.error(error);
});

ls.on('close', code => {
    code === 0 ? logger.success(code, '-------') : logger.error(code, '-------');

    const childProjects = Array.from(new Set(projects)).filter(w => w.location !== '.');

    if (childProjects.length === 0) {
        logger.warn('no sub-workspace');
        return;
    }

    hooks.readDone.promise(childProjects);
});

module.exports = hooks;
