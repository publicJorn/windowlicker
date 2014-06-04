'use strict';

module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		meta: {
			banner: '/*!\n' +
			' * <%= pkg.name %> v<%= pkg.version %> - <%= pkg.description %>\n' +
			' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> - <%= pkg.homepage %>\n' +
			' * License: <%= _.map(pkg.licenses, function(x) {return x.type + " (" + x.url + ")";}).join(", ") %>\n' +
			' */\n\n',
			standalone_name: '<%= pkg.name %>-matchmedia-pkg'
		},

		d: {
			src: 'src',
			test: 'functional-test',
			dist: 'dist'
		},

		// -- DEV --
		watch: {
			options: {
				spawn: false,
				livereload: true
			},
			js: {
				files: [
					'<%= d.src %>/*.js'
				],
				tasks: ['rig:dist', 'browserify', 'clean:release']
			}
		},

		clean: {
			dev: ['<%= d.test %>/js/main-build.js'],
			release: ['<%= d.dist %>']
		},

		browserify: {
			options: {
				debug: true
			},
			dev: {
				files: {
					'<%= d.test %>/js/main-build.js': [
						'<%= d.test %>/js/main.js'
					]
				}
			}
		},

		// -- DEPLOY --
		rig: {
			options : {
				banner : '<%= meta.banner %>'
			},
			dist: {
				files: {
					'<%= d.dist %>/windowlicker.js' : [
						'<%= d.src %>/wrapper.js'
					]
				}
			},
			standalone: {
				files: {
					'<%= d.dist %>/windowlicker-matchmedia-pkg.js' : [
						'<%= d.src %>/3rd-party/matchMedia.js',
						'<%= d.src %>/wrapper.js'
					]
				}
			}
		},

		uglify: {
			options : {
				banner : '<%= meta.banner %>',
				report: 'gzip'
			},
			release: {
				files: {
					'<%= d.dist %>/<%= pkg.name %>.min.js': '<%= d.dist %>/<%= pkg.name %>.js',
					'<%= d.dist %>/<%= meta.standalone_name %>.min.js': '<%= d.dist %>/<%= meta.standalone_name %>.js'
				}
			}
		}
	});

	grunt.registerTask('devBuild', [
		'clean',
		'rig:dist',
		'browserify:dev'
	]);

	grunt.registerTask('dev', [
		'devBuild',
		'watch'
	]);

	grunt.registerTask('release', [
		'clean:release',
		'rig',
		'uglify',
		'nextsteps'
	]);

	grunt.registerTask('default', 'dev');
	grunt.registerTask('nextsteps', function() {
		grunt.log.writeln('To release:');
		grunt.log.writeln('`npm version patch|minor|major [-m "Version: %s"]`');
		grunt.log.writeln('`npm publish` (needs authentication)');
	});
};