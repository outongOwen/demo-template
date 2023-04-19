module.exports = {
  printWidth: 100,
  semi: true,
  vueIndentScriptAndStyle: false,
  singleQuote: true,
  proseWrap: 'never',
  htmlWhitespaceSensitivity: 'strict',
  endOfLine: 'auto',
  useTabs: false,
  trailingComma: 'none',
  plugins: ['prettier-plugin-packagejson'],
  overrides: [
    {
      files: '.*rc',
      options: {
        parser: 'json'
      }
    }
  ]
};
