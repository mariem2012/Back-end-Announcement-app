// import globals from 'globals';
// import pluginJs from '@eslint/js';
// import prettierConfig from 'eslint-config-prettier';
// import prettierPlugin from 'eslint-plugin-prettier';

// export default [
//   {
//     files: ['*.js'],
//     languageOptions: {
//       globals: globals.browser,
//     },
//     plugins: {
//       prettier: prettierPlugin,
//     },
//     rules: {
//       ...pluginJs.configs.recommended.rules,
//       ...prettierConfig.rules,
//       'prettier/prettier': ['error'],
//     },
//   },
// ];

import globals from 'globals';
import pluginJs from '@eslint/js';
import prettierConfig from 'eslint-config-prettier/index.js';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    files: ['*.js'],
    languageOptions: {
      globals: globals.browser,
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      ...pluginJs.configs.recommended.rules,
      ...prettierConfig.rules,
      'prettier/prettier': ['error'],
    },
  },
];
