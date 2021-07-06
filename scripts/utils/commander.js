const {program, InvalidArgumentError} = require('commander');

function buildArgv() {
    return program
        .option('-r, --release', '是否以发版模式运行，编译失败程序强行退出\n若指定发版模式则固定编译所有包。')
        .option('-i, --includes <pkgs>', '指定要编译的包。若指定release选项，此选项失效。', pkgs => {
            return pkgs.split(',').filter(Boolean);
        }, [])
        .option('-s, --stats <stats>', '指定webpack统计信息输出模式。')
        .addHelpText('after', `
Example call:
        $ yarn build --release
        $ yarn build --includes pkg1,pkg2
        $ yarn build --stats errors-only
        $ yarn build
        `)
        .parse(process.argv)
        .opts();
}

function releaseArgv() {
    return program
        .option('-tv, --targetVersion <version>', '发包版本')
        .option('-p, --preid <id>', '预发版本id，如：alpha.0.0、beta.0.0、rc.0.0。')
        .option('-d, --dry', '尝试发版，查看发版流程并不会真正发版。')
        .option(
            '-t, --tag <tag>',
            '使用给定的标签注册已发布的包，以便npm install <name>@<tag>安装此版本'
            + '\n默认情况下，npm发布更新和npm install安装latest标签。',
            value => {
                if (['alpha', 'beta', 'rc'].indexOf(value)) {
                    throw new InvalidArgumentError('可选值为alpha、beta、rc');
                }
                return value;
            }
        )
        .addHelpText('after', `
Example call:
        $ yarn release --targetVersion 1.0.0
        $ yarn release --preid alpha.0.0 --tag alpha
        $ yarn release --preid beta.0.0 --tag beta
        $ yarn release --preid rc.0.0 --tag rc
        $ yarn release
        `)
        .parse(process.argv)
        .opts();
}

module.exports = {
    buildArgv,
    releaseArgv,
};
