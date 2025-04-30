module.exports = {
  semi: true,
  trailingComma: 'none',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  plugins: ['prettier-plugin-svelte'],
  overrides: [{
    files: '*.svelte',
    options: { parser: 'svelte' }
  }]
};
