'use strict';
/* jshint node: true*/
var conf = require('./karma.shared.conf.js')();

conf.files = [
  'node_modules/jquery/dist/jquery.js',
  'node_modules/typeahead.js/dist/typeahead.jquery.js',
  'node_modules/angular/angular.js',
  'node_modules/angular-mocks/angular-mocks.js',
  'build/angular-typeahead.spec.js',
  'angular-typeahead.js'
];
conf.preprocessors['angular-typeahead.js'] = ['coverage'];
conf.reporters.push('coverage', 'threshold');

conf.coverageReporter = {
  type : 'html',
  dir : 'build/coverage/'
};

conf.thresholdReporter = {
  statements: 100,
  branches: 100,
  functions: 100,
  lines: 100
};

module.exports = function(config) {
  conf.logLevel = config[conf.logLevel];
  config.set(conf);
};
