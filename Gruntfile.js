var path = require('path');
module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        express: {
            myServer: {
                options: {
                    server: path.resolve(__dirname, 'launch.js'),
                    hostname: '*',
                    port: (process.env.PORT || 3000)
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-express');
    grunt.registerTask('heroku', ['express:myServer', 'express-keepalive']);
    grunt.registerTask('default', ['heroku']);
};