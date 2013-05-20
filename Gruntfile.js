module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    clean: {
      files: {
        src: [
          'tmp_angular-typeahead.js'
        ]
      }
    },
    ngmin: {
      files: {
        src: 'angular-typeahead.js',
        dest: 'tmp_angular-typeahead.js'
      }
    },
    uglify: {
      build: {
        src: 'angular-typeahead.js',
        dest: 'angular-typeahead.min.js'
      }
    }
  });

  // Load the plugins that provide the tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-ngmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['ngmin', 'uglify', 'clean']);
};