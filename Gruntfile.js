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
    copy: {
      files: {
        expand: true,
        src: ['angular-typeahead.js', 'angular-typeahead.min.js'],
        cwd: 'build',
        dest: 'dist/'
      }
    },
    uglify: {
      build: {
        src: 'build/angular-typeahead.js',
        dest: 'build/angular-typeahead.min.js'
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
          dest: 'build/angular-typeahead.js',
          amdModuleId: 'angular-typeahead',
          deps: {
            default: ['angular'],
            global: ['angular'],
            amd: ['angular'],
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
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-umd');

  grunt.registerTask('require-self', 'Fixes require calls to self for tests', require('./tasks/require-self'));

  // Utility Tasks
  grunt.registerTask('_build', ['require-self', 'umd']);
  grunt.registerTask('_test', ['karma', 'jshint']);


  // Tasks
  grunt.registerTask('test:lite', ['_build', 'karma:global', 'jshint']);
  grunt.registerTask('test', ['_build', '_test']);
  grunt.registerTask('dist', ['_build', 'uglify', 'copy']);
};
