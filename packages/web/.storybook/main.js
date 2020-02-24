const path = require('path');

module.exports = {
  stories: ['../src/**/*.stories.[tj]sx'],
  addons: [
    '@storybook/addon-knobs/register',
    '@storybook/addon-docs',
    {
      name: '@storybook/preset-typescript',
      options: {
        tsLoaderOptions: {
          configFile: path.resolve(__dirname, '../tsconfig.json'),
        },
        tsDocgenLoaderOptions: {
          tsconfigPath: path.resolve(__dirname, '../tsconfig.json'),
        },
        include: [path.resolve(__dirname, '../src')],
      },
    },
  ],
};
