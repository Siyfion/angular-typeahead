"use strict";
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
      default: {
        configFile: 'karma.conf.js',
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
            'angular-typeahead.spec.js']
        }
      }
    },
    umd: {
      default: {
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
      }
    },
    watch: {
      default: {
        files: [
          'angular-typeahead.js',
          'angular-typeahead.spec.js'],
        tasks: ['test'],
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

  // Default task(s).
  grunt.registerTask('test', ['karma', 'jshint']);
  grunt.registerTask('default', ['test', 'umd', 'uglify', 'clean']);
};
