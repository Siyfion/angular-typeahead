"use strict";
/* jshint node: true */
module.exports = function (grunt) {

  var karma_browser = process.env.KARMA_BROWSER || 'Chrome';

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      files: {
        src: [
          'build/'
        ]
      }
    },
    uglify: {
      build: {
        src: 'dist/angular-typeahead.js',
        dest: 'dist/angular-typeahead.min.js'
      }
    },
    karma: {
      global: {
        configFile: 'test/karma.global.conf.js',
        browsers: [ karma_browser ]
      },
      amd: {
        configFile: 'test/karma.amd.conf.js',
        browsers: [ karma_browser ]
      },
      cjs: {
        configFile: 'test/karma.cjs.conf.js',
        browsers: [ karma_browser ]
      }
    },
    jshint: {
      default: {
        options: {
          jshintrc: true,
        },
        files: {
          src: [
            'angular-typeahead.js',
            'test/*.js']
        }
      }
    },
    umd: {
      src: {
        options: {
          src: 'angular-typeahead.js',
          dest: 'dist/angular-typeahead.js',
          amdModuleId: 'angular-typeahead',
          deps: {
            default: ['angular'],
            global: ['angular'],
            amd: ['angular', 'typeahead.js'],
            cjs: ['angular', 'typeahead.js']
          }
        }
      },
      test: {
        src: 'test/angular-typeahead.spec.js',
        dest: 'build/angular-typeahead.spec.js',
        amdModuleId: 'build/angular-typeahead.spec',
        deps: {
          default: ['angular'],
          global: ['angular'],
          amd: ['angular', 'angular-typeahead', 'angular-mocks'],
          cjs: ['angular', 'angular-typeahead', 'angular-mocks']
        }
      }
    },
    watch: {
      default: {
        files: [
          'angular-typeahead.js',
          'test/angular-typeahead.spec.js'],
        tasks: ['test:lite'],
        options: {
          spawn: false,
        },
      },
    },
  });

  // Load the plugins that provide the tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-umd');

  grunt.registerTask('require-self', 'Sets-up requireself', function() {
    // TODO: move to package
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
  });

  // Tasks
  grunt.registerTask('test:lite', ['require-self', 'karma:global', 'jshint']);
  grunt.registerTask('test', ['require-self', 'umd:test', 'karma', 'jshint']);
  grunt.registerTask('default', ['test', 'umd:src', 'uglify', 'clean']);
};
