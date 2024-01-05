require('@rushstack/eslint-patch/modern-module-resolution');
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser'
  },
  extends: ['@vanwei/eslint-config/javascript', '@vanwei/eslint-config/vue2', '@vue/eslint-config-prettier'],
  ignorePatterns: ['public/**/*', 'types/components.d.ts', 'vue.config.js'],
  rules: {}
};
