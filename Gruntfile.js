'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		d: {
			src: 'src',
			srcExamples: 'examples-src',
			dev: '_server',
			test: 'examples',
			dist: 'dist'
		},

		connect: {
			options: {
				port: 9000,
				livereload: 35729,
				hostname: '0.0.0.0' // change this to 'localhost' to restrict access
			},
			dev: {
				options: {
					// open: true,
					base: [
						'<%= d.dev %>',
						'<%= d.test %>'
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
					'<%= d.srcExamples %>/*.js',
					'<%= d.test %>/*.html'
				]
			}
		},

		clean: {
			files: ['<%= d.dev %>', '<%= d.dist %>']
		},

		browserify: {
			options: {
				debug: true,
				// bundleOptions: {
				// 	debug: true
				// }
			},
			dev: {
				files: {
					'<%= d.dev %>/main-build.js': [
						'<%= d.srcExamples %>/main.js'
					]
				}
			},
			standalone: {
				files: {
					'<%= d.dev %>/windowlicker.js': [
						'<%= d.src %>/windowlicker-standalone.js'
					],
					'<%= d.dev %>/windowlicker-ie.js': [
						'<%= d.src %>/matchMedia.js',
						'<%= d.src %>/windowlicker-standalone.js'
					]
				}
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

	grunt.registerTask('dev', [
		'clean',
		'browserify',
		'connect:dev',
		'watch'
	]);

	// grunt.registerTask('standalone', [
	// 	'clean',
	// 	'browserify:standalone',
	// 	'connect:dev',
	// 	'watch'
	// ]);

	grunt.registerTask('default', 'dev');
};