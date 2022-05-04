const nxPreset = require('@nrwl/jest/preset');

module.exports = {
  ...nxPreset,
  coverageReporters: ['text'],
  collectCoverage: true,
  verbose: true,
};
