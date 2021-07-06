const execa = require('execa');

async function gitBranch() {
    const {stdout} = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
    return stdout.toString().trim();
}

module.exports = gitBranch;

