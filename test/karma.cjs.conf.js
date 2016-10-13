'use strict';
/* jshint node: true*/
var conf = require('./karma.shared.conf.js')();

conf.files = [
  'node_modules/jquery/dist/jquery.js',
  'node_modules/typeahead.js/dist/typeahead.jquery.js',
  'build/angular-typeahead.spec.js'
];
conf.frameworks.push('browserify');
conf.preprocessors['build/angular-typeahead.spec.js'] = [ 'browserify' ];

module.exports = function(config) {
  conf.logLevel = config[conf.logLevel];
  config.set(conf);
};
