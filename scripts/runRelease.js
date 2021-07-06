const argv = require('./utils/commander').releaseArgv();
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const semver = require('semver');
const currentVersion = require('../package.json').version;
const {prompt} = require('enquirer');
const execa = require('execa');
const gitBranch = require('./utils/gitBranch');

const preId
  = argv.preid
  || (semver.prerelease(currentVersion) && semver.prerelease(currentVersion)[0]);
const isDryRun = argv.dry;
const packages = fs
    .readdirSync(path.resolve(__dirname, '../packages'))
    .filter(p => !p.endsWith('.ts') && !p.startsWith('.'));

const versionIncrements = [
    'patch',
    'minor',
    'major',
    ...(preId ? ['prepatch', 'preminor', 'premajor', 'prerelease'] : []),
];

const inc = i => semver.inc(currentVersion, i, preId);
const run = (bin, args, opts = {}) =>
    execa(bin, args, {stdio: 'inherit', ...opts});
const dryRun = (bin, args, opts = {}) =>
    // eslint-disable-next-line no-console
    console.log(chalk.blue(`[dryrun] ${bin} ${args.join(' ')}`), opts);
const runIfNotDry = isDryRun ? dryRun : run;
const getPkgRoot = pkg => path.resolve(__dirname, '../packages/' + pkg);
// eslint-disable-next-line no-console
const step = msg => console.log(chalk.cyan(msg));

async function main() {
    let {targetVersion} = argv;

    if (!targetVersion) {
        // no explicit version, offer suggestions
        const {release} = await prompt({
            type: 'select',
            name: 'release',
            message: 'Select release type',
            choices: versionIncrements.map(i => `${i} (${inc(i)})`).concat(['custom']),
        });

        if (release === 'custom') {
            targetVersion = (await prompt({
                type: 'input',
                name: 'version',
                message: 'Input custom version',
                initial: currentVersion,
            })).version;
        }
        else {
            targetVersion = release.match(/\((.*)\)/)[1];
        }
    }

    if (!semver.valid(targetVersion)) {
        throw new Error(`invalid target version: ${targetVersion}`);
    }

    const {yes} = await prompt({
        type: 'confirm',
        name: 'yes',
        message: `Releasing v${targetVersion}. Confirm?`,
    });

    if (!yes) {
        return;
    }

    // update all package versions and inter-dependencies
    step('\nUpdating version...');
    updateVersions(targetVersion);

    // build all packages with types
    step('\nBuilding all packages...');
    await run('yarn', ['build', '--stats', 'errors-only', '--release']);

    // generate changelog
    await run(`yarn`, ['changelog']);

    const {stdout} = await run('git', ['diff'], {stdio: 'pipe'});
    if (stdout) {
        step('\nCommitting changes...');
        await runIfNotDry('git', ['add', '-A']);
        await runIfNotDry('git', ['commit', '-m', `release: v${targetVersion}`]);
    }
    else {
        // eslint-disable-next-line no-console
        console.log('No changes to commit.');
        return;
    }

    // publish packages
    step('\nPublishing packages...');
    for (const pkg of packages) {
        await publishPackage(pkg, targetVersion, runIfNotDry);
    }

    // push to GitHub
    step('\nPushing to GitHub...');
    await runIfNotDry('git', ['tag', `v${targetVersion}`]);
    await runIfNotDry('git', ['push', 'origin', `refs/tags/v${targetVersion}`]);
    await runIfNotDry('git', ['push']);

    if (isDryRun) {
        // eslint-disable-next-line no-console
        console.log(`\nDry run finished - run git diff to see package changes.`);
    }

    // eslint-disable-next-line no-console
    console.log();
}

function updateVersions(version) {
    // 1. update root package.json
    updatePackage(path.resolve(__dirname, '..'), version);
    // 2. update all packages
    packages.forEach(p => updatePackage(getPkgRoot(p), version));
}

function updatePackage(pkgRoot, version) {
    const pkgPath = path.resolve(pkgRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    pkg.version = version;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
}

async function publishPackage(pkgName, version, runIfNotDry) {
    const pkgRoot = getPkgRoot(pkgName);
    const pkgPath = path.resolve(pkgRoot, 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    if (pkg.private) {
        return;
    }

    const releaseTag = argv.tag;

    step(`Publishing ${pkgName}...`);
    try {
        await runIfNotDry(
            'yarn',
            [
                'npm',
                'publish',
                ...(releaseTag ? ['--tag', releaseTag] : []),
                ...['--access', 'public'],
            ],
            {
                cwd: pkgRoot,
                stdio: 'pipe',
            }
        );
        // eslint-disable-next-line no-console
        console.log(chalk.green(`Successfully published ${pkgName}@${version}`));
    }
    catch (e) {
        if (e.stderr.match(/previously published/)) {
            // eslint-disable-next-line no-console
            console.log(chalk.red(`Skipping already published: ${pkgName}`));
        }
        else {
            throw e;
        }
    }
}

main().catch(err => {
    console.error(err);
});
