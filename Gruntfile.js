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
			dev: {
				options: {
					outputLevel: 'failures', // failures, stats, tap
					outputTo: '/tmp/output.log' // empty, file-path
				},
				files: {
					'tests': ['./test/data/*.js']
				}
			},

			test: {
				options: {
					outputLevel: 'failures'
				},
				files: {
					'tests': ['./test/*.js']
				}
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'node_tap:test']);
	grunt.registerTask('dev', ['node_tap:dev']);
};
