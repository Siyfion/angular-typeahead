'use strict';
/* jshint node: true */
module.exports = function() {
  var fs = require('fs');
  var path = require('path');

  // Get the name of the module in the current working directory.
  var cwd = process.cwd();
  var pkg = require(path.join(cwd, 'package.json'));
  var name = pkg.name;

  // Compute the location and content for the pseudo-module.
  var modulePath = path.join(cwd, 'node_modules', name + '.js');
  var moduleText = "module.exports = require('..');";

  // Create the pseudo-module.
  fs.writeFileSync(modulePath, moduleText);
};
