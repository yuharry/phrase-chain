var path = require('path');
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        copy: {
            main: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['*'],
                    dest: 'dist/',
                    filter: 'isFile'
                }]
            }
        }
    });
    //grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('heroku', ['copy']);
    grunt.registerTask('default', ['heroku']);
};