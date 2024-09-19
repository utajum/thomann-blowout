// js config because of plugin resolving issue https://github.com/prettier/prettier-vscode/issues/2259
module.exports = {
  tabWidth: 2,
  printWidth: 120,
  useTabs: false,
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  bracketSpacing: true,
  jsxBracketSameLine: false,
  proseWrap: 'always',
  plugins: [require.resolve('prettier-plugin-organize-imports')],
};
