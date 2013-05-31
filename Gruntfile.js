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
			failures_console: {
				options: {
					outputLevel: 'failures',
					outputTo: 'console'
				},
				files: {
					'tests': ['./test/data/*.js']
				}
			},
			stats_console: {
				options: {
					outputLevel: 'stats',
					outputTo: 'console'
				},
				files: {
					'tests': ['./test/data/*.js']
				}
			},
			tap_stream_console: {
				options: {
					outputLevel: 'tap-stream',
					outputTo: 'console'
				},
				files: {
					'tests': ['./test/data/*.js']
				}
			},
			tap_stream_file: {
				options: {
					outputLevel: 'tap-stream',
					outputTo: 'file',
					outputFilePath: '/tmp/out.log'
				},
				files: {
					'tests': ['./test/data/*.js']
				}
			},
			test: {
				options: {
					outputLevel: 'tap-stream', // failures, stats
					outputTo: 'console' // or file path
				},
				files: {
					'tests': ['./test/data/*.js']
				}
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	grunt.registerTask('default', ['jshint', 'node_tap:test']);

	grunt.registerTask('fc', ['node_tap:failures_console']);
	grunt.registerTask('sc', ['node_tap:stats_console']);
	grunt.registerTask('tc', ['node_tap:tap_stream_console']);
	grunt.registerTask('tf', ['node_tap:tap_stream_file']);

};
