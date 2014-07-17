module.exports = function(grunt) {
	'use strict';

	var paths = {
		css: 'assets/styles/css',
		sass: 'assets/styles/sass',
		bower: 'assets/bower_components',
		scripts: 'assets/scripts'
	};

	grunt.initConfig({
		paths: paths,
		watch: {
			sass: {
				files: '<%= paths.sass %>/**/*.scss',
				tasks: ['sass', 'autoprefixer'],
				options: {
					livereload: true
				}
			},
			fieldsScripts: {
				files: '<%= paths.scripts %>/js/fields/*.js',
				tasks: ['concat:fields'],
				options: {
					livereload: false
				}
			},
			configFiles: {
				files: 'gruntfile.js',
				options: {
					reload: true
				}
			},
			jshint: {
				files: '<%= paths.scripts %>/js/**/*.js',
				tasks: ['jshint'],
				options: {
					livereload: false
				}
			},
			other: {
				files: [
					'!<%= paths.scripts %>/js/fields/*.js',
					'<%= paths.scripts %>/**/*.js',
					'**/*.php'
				],
				options: {
					livereload: true
				},
			}
		},
		sass: {
			dist: {
				options: {
					style: 'expanded',
					sourcemap: true
				},
				files: [
					{
						expand: true,
						cwd: paths.sass,
						src: '**/*.scss',
						dest: paths.css,
						ext: '.css'

					}
				]
			}
		},
		autoprefixer: {
			options: {
				browsers: ['last 2 versions']
			},
			dist: {
				files: [
					{
						expand: true,
						cwd: paths.css,
						src: '{,*/}*.css',
						dest: paths.css
					}
				]
			}
		},
		concat: {
			fields: {
				options: {
					banner: '/**\n * Auto-concatenaed on <%= grunt.template.today("yyyy-mm-dd") %> based on files in <%= paths.scripts %>/js/fields\n */\n\n'
				},
				src: '<%= paths.scripts %>/js/fields/**.js',
				dest: '<%= paths.scripts %>/fields/fields-combined.js'
			}
		},
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'<%= paths.scripts %>/js/**/*.js',
				'!<%= paths.scripts %>/js/fields-combined.js'
			]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', function () {
		grunt.task.run([
			'sass',
			'autoprefixer',
			'concat',
			'jshint',
			'watch'
		]);
	});

};
