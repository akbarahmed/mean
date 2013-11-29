'use strict';

module.exports = function(grunt) {
    // Display time per task
    require('time-grunt')(grunt);
    // Load all grunt packages
    require('load-grunt-tasks')(grunt);

    // Project Configuration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // Paths
        exponential: {
            src: '',
            dev: '',
            prod: ''
        },

        express: {
            options: {
                port: process.env.PORT || 3000 
            },
            dev: {
                options: {
                    script: 'server.js'
                }
            },
            prod: {
                options: {
                    script: 'server.js',
                    node_env: 'production'
                }
            }
        },

        open: {
            server: {
                url: 'http://localhost:<%= express.options.port %>'
            }
        },

        watch: {
            jade: {
                files: ['app/views/**'],
                options: {
                    livereload: true,
                },
            },
            js: {
                files: ['public/js/**', 'app/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true,
                },
            },
            html: {
                files: ['public/views/**'],
                options: {
                    livereload: true,
                },
            },
            css: {
                files: ['public/css/**'],
                options: {
                    livereload: true
                }
            }
        },

        jshint: {
            all: ['gruntfile.js', 'public/js/**/*.js', 'test/**/*.js', 'app/**/*.js']
        },

        copy: {
            bower: {
                files: [{
                    expand: true,
                    cwd: 'bower_components/bootstrap/dist/css',
                    src: [ 'bootstrap.css', 'bootstrap-theme.css' ],
                    dest: 'public/css/lib/bootstrap'
                }, {
                    expand: true,
                    cwd: 'bower_components/bootstrap/dist/fonts',
                    src: [ '*' ],
                    dest: 'public/css/lib/fonts'
                }, {
                    expand: true,
                    cwd: 'bower_components/bootstrap/dist/js',
                    src: [ 'bootstrap.js' ],
                    dest: 'public/js/lib/bootstrap'
                },{
                    expand: true,
                    cwd: 'bower_components/angular',
                    src: [ 'angular.js', 'angular.min.js', 'angular.min.js.map' ],
                    dest: 'public/js/lib/angular'
                },{
                    expand: true,
                    cwd: 'bower_components/angular-route',
                    src: [ 'angular-route.js', 'angular-route.min.js', 'angular-route.min.js.map' ],
                    dest: 'public/js/lib/angular'
                },{
                    expand: true,
                    cwd: 'bower_components/angular-cookies',
                    src: [ 'angular-cookies.js', 'angular-cookies.min.js', 'angular-cookies.min.js.map' ],
                    dest: 'public/js/lib/angular'
                },{
                    expand: true,
                    cwd: 'bower_components/angular-resource',
                    src: [ 'angular-resource.js', 'angular-resource.min.js', 'angular-resource.min.js.map' ],
                    dest: 'public/js/lib/angular'
                },{
                    expand: true,
                    cwd: 'bower_components/angular-bootstrap',
                    src: [ 'ui-bootstrap.js', 'ui-bootstrap.min.js', 'ui-bootstrap-tpls.js', 'ui-bootstrap-tpls.min.js' ],
                    dest: 'public/js/lib/angular'
                },{
                    expand: true,
                    flatten: true,
                    cwd: 'bower_components/angular-ui-utils/modules',
                    src: [ 'route/route.js' ],
                    dest: 'public/js/lib/angular'
                }]
            }
        },

        nodemon: {
            dev: {
                options: {
                    file: 'server.js',
                    args: [],
                    ignoredFiles: ['README.md', 'node_modules/**', '.DS_Store'],
                    watchedExtensions: ['js'],
                    watchedFolders: ['app', 'config'],
                    debug: true,
                    delayTime: 1,
                    env: {
                        PORT: 3000
                    },
                    cwd: __dirname
                }
            }
        },
        //concurrent: {
            //tasks: ['nodemon', 'watch'], 
            //options: {
                //logConcurrentOutput: true
            //}
        //},

        concurrent: {
            server: [
                'copy:bower'
            ]
        },

        mochaTest: {
            options: {
                reporter: 'spec'
            },
            src: ['test/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'test'
            }
        }
    });

    //Making grunt default to force in order not to break the project.
    //grunt.option('force', true);

    grunt.registerTask('default', ['jshint', 'concurrent']);
    //grunt.registerTask('server', ['jshint', 'express:dev', 'open', 'watch']);
    grunt.registerTask('server', ['express:dev', 'open', 'watch']);

    //Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest']);
};

