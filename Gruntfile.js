'use strict';

module.exports = function (grunt) {
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'tests/data/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		node_tap: {
			default_options: {
				options: {
					outputLevel: 'silent' // silent, failures, stats
				},
				files: {
					'tests': ['./test/data/mixed.js']
				}
			}
		}
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint']);

	grunt.registerTask('dev', ['node_tap']);
};
