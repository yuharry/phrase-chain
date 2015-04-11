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
            pages : {
                files: [{
                    expand: true,
                    cwd: 'pages',
                    src: ['**/*.*'],
                    dest: 'dist'
                }]
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('heroku', ['copy']);
    grunt.registerTask('default', ['heroku']);
};