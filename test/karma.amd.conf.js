'use strict';
/* jshint node: true*/
var conf = require('./karma.shared.conf.js')();

conf.files = [
  'node_modules/jquery/dist/jquery.min.js',
  'node_modules/typeahead.js/dist/typeahead.jquery.js',
  'node_modules/angular/angular.js',
  'node_modules/angular-mocks/angular-mocks.js',
  'build/angular-typeahead.spec.js',
  'dist/angular-typeahead.js'
];
conf.frameworks.push('requirejs');
conf.files.push('test/test-amd.js');

module.exports = function(config) {
  conf.logLevel = config[conf.logLevel];
  config.set(conf);
};
