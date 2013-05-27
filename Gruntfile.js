'use strict';

module.exports = function (grunt) {
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'lib/*.js',
				'test/**/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		node_tap: {
			default_options: {
				options: {
					outputLevel: 'failures', // failures, stats, tap
					outputTo: '/tmp/output.log' // empty, file-path
				},
				files: {
					'tests': ['./test/data/*.js']
				}
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'node_tap']);
};
