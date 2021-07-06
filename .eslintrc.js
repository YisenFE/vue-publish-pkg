module.exports = {
    // 参考：https://www.npmjs.com/package/@ecomfe/eslint-config
    extends: [
        '@ecomfe/eslint-config',
        // npm i -D eslint-plugin-import
        // '@ecomfe/eslint-config/import',
        // npm i -D eslint-plugin-react eslint-plugin-react-hooks
        // '@ecomfe/eslint-config/react',
        // npm i -D eslint-plugin-vue
        '@ecomfe/eslint-config/vue',
        // npm i -D @typescript-eslint/parser @typescript-eslint/eslint-plugin
        '@ecomfe/eslint-config/typescript',
    ],
    'rules': {
        'quotes': [
            'error',
            'single',
            {'allowTemplateLiterals': true},
        ],
    },
};
