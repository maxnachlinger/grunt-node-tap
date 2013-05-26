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

		clean: {
			tests: ['tmp']
		},

		node_tap: {
			default_options: {
				options: {
					outputLevel: 'tap', // failures, stats, tap
					outputTo: '/tmp/output.log' // empty, file-path
				},
				files: {
					'tests': ['./test/data/mixed.js']
				}
			}
		}
	});

	grunt.loadTasks('tasks');

	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint']);

	grunt.registerTask('dev', ['node_tap', 'clean']);
};
