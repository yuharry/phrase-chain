var path = require('path');
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        /*express: {
            myServer: {
                options: {
                    server: path.resolve(__dirname, 'launch.js'),
                    hostname: '*',
                    port: (process.env.PORT || 3000)
                }
            }
        }*/
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