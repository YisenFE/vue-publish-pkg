const {spawn} = require('child_process');
const {join} = require('path');

const {prompt} = require('enquirer');
const logger = require('./utils/logger');
const rootDir = require('./utils/rootDir');

const selectWorkspace = require('./utils/selectWorkspace');

selectWorkspace(async ({name: workspaceName, location}) => {
    const {scripts} = require(join(rootDir, location, 'package.json'));
    if (!scripts) {
        return logger.warn(`There is no scripts field in package.json of ${workspaceName}`);
    }
    const {script} = await prompt([{
        type: 'select',
        name: 'script',
        message: 'Select a script to run.',
        choices: Object.keys(scripts),
    }]);

    logger.script(`yarn workspace ${workspaceName} ${script}`);

    spawn(
        'yarn',
        [
            'workspace',
            workspaceName,
            script,
        ],
        {stdio: 'inherit'}
    );
});
