'use strict';
/* jshint node: true*/
var conf = require('./karma.shared.conf.js')();

conf.files = [
  'node_modules/jquery/dist/jquery.js',
  'node_modules/typeahead.js/dist/typeahead.bundle.js',
  {pattern: 'node_modules/angular/angular.js', included: false},
  {pattern: 'node_modules/angular-mocks/angular-mocks.js', included: false},
  {pattern: 'build/angular-typeahead.js', included: false},
  'build/angular-typeahead.spec.js'
];
conf.frameworks.push('requirejs');
conf.files.push('test/test-amd.js');

module.exports = function(config) {
  conf.logLevel = config[conf.logLevel];
  config.set(conf);
};
