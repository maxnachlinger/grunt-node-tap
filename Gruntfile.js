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
			test: {
				options: {
					outputType: 'stats', // tap, failures, stats
					outputTo: 'console' // or file
					//outputFilePath: '/tmp/out.log' // path for output file, only makes sense with outputTo 'file'
				},
				files: {
					'tests': [
						'./test/*.js'
					]
				}
			}
		}
	});

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.registerTask('default', ['jshint', 'node_tap:test']);
};
