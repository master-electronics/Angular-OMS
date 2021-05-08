const { addTailwindPlugin } = require('@ngneat/tailwind');
const tailwindConfig = require('./tailwind.config.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = (config) => {
  addTailwindPlugin({
    webpackConfig: config,
    tailwindConfig,
    patchComponentsStyles: true,
  });
  plugins: [new BundleAnalyzerPlugin()];
  return config;
};
