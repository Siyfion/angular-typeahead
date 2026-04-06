'use strict';
const fs = require('fs');

function wrapMain(src) {
  return `(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('angular-typeahead', ["angular"], function (a0) {
      return (factory(a0));
    });
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("angular"),require("typeahead.js"));
  } else {
    factory(angular);
  }
}(this, function (angular) {

${src}
}));
`;
}

function wrapSpec(src) {
  return `(function (root, factory) {
  if (root === undefined && window !== undefined) root = window;
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module unless amdModuleId is set
    define('build/angular-typeahead.spec', ["angular","angular-typeahead","angular-mocks"], function (a0,b1,c2) {
      return (factory(a0,b1,c2));
    });
  } else if (typeof module === 'object' && module.exports) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = factory(require("angular"),require("angular-typeahead"),require("angular-mocks"));
  } else {
    factory(root["angular"]);
  }
}(this, function (angular) {

${src}
}));
`;
}

fs.mkdirSync('build', { recursive: true });

const mainSrc = fs.readFileSync('angular-typeahead.js', 'utf8');
fs.writeFileSync('build/angular-typeahead.js', wrapMain(mainSrc));

const specSrc = fs.readFileSync('test/angular-typeahead.spec.js', 'utf8');
fs.writeFileSync('build/angular-typeahead.spec.js', wrapSpec(specSrc));

console.log('UMD build complete.');
