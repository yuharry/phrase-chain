var path = require('path');
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        copy: {
            assets: {
                files: [{
                    expand: true,
                    cwd: 'bower_components/angular',
                    src: ['*.js'],
                    dest: 'dist/assets/angular/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'bower_components/jquery/dist',
                    src: ['*.js'],
                    dest: 'dist/assets/jquery/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    cwd: 'bower_components/bootstrap/dist',
                    src: ['**/*.*'],
                    dest: 'dist/assets/bootstrap/'
                }]
            },
            src : {
                files: [{
                    expand: true,
                    cwd: 'pages',
                    src: ['**/*.*'],
                    dest: 'dist'
                }, {
                    expand: true,
                    cwd: 'css',
                    src: ['**/*.*'],
                    dest: 'dist/css'
                }, {
                    expand: true,
                    cwd: 'js',
                    src: ['**/*.*'],
                    dest: 'dist/js'
                }]
            }
        },
        watch: {
            src: {
                files: ['pages/**/*.html', 'js/**/*.js', 'css/**/*.css'],
                tasks: ['copy:src']
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('heroku', ['copy']);
    grunt.registerTask('default', ['heroku']);
};