// Invoked on the commit-msg git hook by yorkie.

const chalk = require('chalk');
const msgPath = process.env.GIT_PARAMS;
const msg = require('fs')
    .readFileSync(msgPath, 'utf-8')
    .trim();
const {log, error} = console;


// eslint-disable-next-line
const commitRE = /^(Revert: )?(feat|fix|docs|dx|style|refactor|perf|test|workflow|build|ci|chore|types|wip|release)(\(.+\))?: .{1,50}/;

if (!commitRE.test(msg)) {
    log();
    error(
        `  ${chalk.bgRed.white(' ERROR ')} ${chalk.red(
            `invalid commit message format.`
        )}\n\n`
        + chalk.red(
            `  Proper commit message format is required for automated changelog generation. Examples:\n\n`
        )
        + `    ${chalk.green(`feat(axios): add 'beforeRequest' hook (#123)`)}\n`
        + `    ${chalk.green(
            `fix(axios): handle hooks on apm (close #123)`
        )}\n\n`
        // + chalk.red(`  See .icode/commit-convention.md for more details.\n`)
    );
    process.exit(1);
}
