'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		watch: {
			options: {
				spawn: false,
				livereload: true
			},
			js: {
				files: [
					'js/*.js'
				],
				tasks: ['browserify']
			}
		},

		browserify: {
			options: {
				debug: true,
			},
			dev: {
				src: ['js/main.js'],
				dest: 'js/bundle.js'
			},
			production: {
				options: {
					debug: false
				},
				src: '<%= browserify.dev.src %>',
				dest: 'js/bundle.js'
			}
		}

	});

	grunt.registerTask('serve', [
		'browserify:dev',
		'watch'
	]);

	grunt.registerTask('default', 'serve');
};