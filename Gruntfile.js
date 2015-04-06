var path = require('path');
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        express: {
            myServer: {
                options: {
                    server: path.resolve(__dirname, 'launch.js'),
                    hostname: '*',
                    //port: 80
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-express');
    grunt.registerTask('heroku', ['express:myServer', 'express-keepalive']);
    grunt.registerTask('default', ['heroku']);
};