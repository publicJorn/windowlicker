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
			dev: ['<%= d.dev %>'],
			release: ['<%= d.dist %>']
		},

		browserify: {
			options: {
				debug: true
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
			release: {
				options: {
					debug: false,

				},
				files: {
					'<%= d.dist %>/windowlicker.js': [
						'<%= d.src %>/windowlicker.js'
					],
					'<%= d.dist %>/windowlicker-sa.js': [
						'<%= d.src %>/windowlicker-standalone.js'
					],
					'<%= d.dist %>/windowlicker-sa-ie.js': [
						'<%= d.src %>/matchMedia.js',
						'<%= d.src %>/windowlicker-standalone.js'
					]
				}
			}
		},

		uglify: {
			release: {
				files: [{
					expand: true,
          cwd: '<%= d.dist %>',
          src: '*.js',
          dest: '<%= d.dist %>'
				}]
			}
		},
	});

	grunt.registerTask('dev', [
		'clean',
		'browserify:dev',
		'browserify:standalone',
		'connect:dev',
		'watch'
	]);

	grunt.registerTask('release', [
		'clean:release',
		'browserify:release',
		'uglify'
	]);

	grunt.registerTask('default', 'dev');
};