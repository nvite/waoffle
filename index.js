/**
 * @file Entrypoint. Exports version and package information.
 */
var pkg = require('./package.json');

module.exports = {
  version: pkg.version,
  name: pkg.name
};
