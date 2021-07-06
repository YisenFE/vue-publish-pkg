const {prompt} = require('enquirer');
const logger = require('./logger');
const {readDone} = require('./yarnWorkspacesList');

module.exports = function selectWorkspace(callback) {
    readDone.tapPromise('selectWorkspace', async childProjects => {
        const {workspaceName} = await prompt([{
            type: 'select',
            name: 'workspaceName',
            message: 'Select a workspace.',
            choices: childProjects,
        }]);
        const workspace = childProjects.find(p => p.name === workspaceName);
        if (!workspace) {
            logger.warn('The selected workspace does not exist');
        }
        callback(workspace);
    });
};
