module.exports = {
  default: {
    requireModule: ['ts-node/register'],
    require: ['src/**/*.ts'],
    format: [
      '@cucumber/pretty-formatter',
    ],
    paths: ['features/**/*.feature'],
    formatOptions: {
      snippetInterface: 'async-await'
    }
  }
};
