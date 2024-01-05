module.exports = {
  extends: '@vanwei/stylelint-config',
  overrides: [
    // *默认情况只能支持css文件，如果需要支持其他文件，则需要使用对应的插件和配置
    // 支持html或者vue
    {
      files: ['**/*.html', '**/*.vue'],
      customSyntax: 'postcss-html'
    },
    // 使用less
    {
      files: ['**/*.less'],
      customSyntax: 'postcss-less'
    }
  ]
};
