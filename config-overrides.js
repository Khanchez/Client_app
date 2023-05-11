const {
    override,
    addBabelPlugin
} = require("customize-cra");

const path = require('path');

const addIgnoreSourceMapError = () => (config) => {
    config.resolve.alias["@core"] = path.resolve(__dirname, 'src');

    config.ignoreWarnings = [/Failed to parse source map/];
    config.optimization.minimize = false;
    config.devtool = 'eval-source-map';
    return config;
}

module.exports = {
    webpack: override(
        addBabelPlugin("babel-plugin-transform-typescript-metadata"),
        addIgnoreSourceMapError()
    )
};