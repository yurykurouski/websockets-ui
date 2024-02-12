module.exports = {
    "parser": "@typescript-eslint/parser",
    parserOptions: {
        sourceType: 'module',
        "ecmaVersion": "latest",
    },
    "env": {
        "browser": true,
        "es2021": true
    },
    "plugins": [
        "@typescript-eslint/eslint-plugin",
        "simple-import-sort",
        "unused-imports"
    ],
    "extends": ["eslint:recommended", "plugin:n/recommended"],
    "overrides": [
        {
            "env": {
                "node": true
            },
            "files": [
                ".eslintrc.{js,cjs}"
            ],
            "parserOptions": {
                "sourceType": "script"
            }
        }
    ],
    "rules": {
        "no-unused-vars": 0,
        "n/no-missing-import": 0,
        semi: 1,
        "simple-import-sort/imports": 2,
        "simple-import-sort/exports": 2,
        "unused-imports/no-unused-imports": "error",
        'unused-imports/no-unused-vars': [
            'warn',
            {
                vars: 'all',
                varsIgnorePattern: '^_',
                args: 'after-used',
                argsIgnorePattern: '^_',
            },
        ],
    }
};
