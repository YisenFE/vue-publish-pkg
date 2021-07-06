const chalk = require('chalk');
const {log} = console;

function script(msg) {
    const prefix = chalk.gray('> ');
    const cmd = chalk.bold(msg);
    log(prefix + cmd);
}

function success(msg) {
    log(chalk.green('[SUCCESS]: ' + msg));
}

function warn(msg) {
    log(chalk.yellow('[WARN]: ') + msg);
}

function error(msg) {
    log(chalk.red('[ERROR]: ') + msg);
}

module.exports = {
    script,
    success,
    warn,
    error,
};
