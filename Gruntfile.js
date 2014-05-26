'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		d: {
			src: 'src',
			// test: 'test',
			dist: 'dist'
		},

		connect: {
			options: {
				port: 9000,
				livereload: 35729,
				hostname: '0.0.0.0' // change this to 'localhost' to restrict access
			},
			serve: {
				options: {
					// open: true,
					base: [
						'<%= d.src %>',
						'examples'
					]
				}
			}
		},

		watch: {
			options: {
				spawn: false,
				livereload: true
			},
			js: {
				files: [
					'<%= d.src %>/*.js'
				],
				tasks: ['browserify']
			},
			dev: {
				files: [
					'examples/*.html'
				]
			}
		},

		browserify: {
			options: {
				debug: true,
			},
			dev: {
				src: ['<%= d.src %>/index.js'],
				dest: '<%= d.dest %>/windowlicker.js'
			},
			// deploy: {
			// 	options: {
			// 		debug: false
			// 	},
			// 	src: '<%= browserify.dev.src %>',
			// 	dest: '<%= d.src %>/bundle.js'
			// }
		}

	});

	grunt.registerTask('serve', [
		'browserify:dev',
		'connect:serve',
		'watch'
	]);

	grunt.registerTask('default', 'serve');
};