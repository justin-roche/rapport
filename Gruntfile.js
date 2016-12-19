"use strict";
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        shell: {

          tsc: {
            command: 'tsc'
          },

          setTestDB: {
            command: `DB='test' node server/server.js`
          },

          serve: {
            command: 'lite-server'
          },

          loadTestDb: {
            command: `mysql -u root -p < ${__dirname}/spec/test-schema.sql`
          },

          startServer: {
            command: `node ${__dirname}/server/server.js`
          },

          test: {
            command: 'mocha '+__dirname+'/spec/serverSpec.js'
          },

          testDB: {
            command: `'mocha ${__dirname}/spec/integration-tests/dbSpec.js`
          },

          electroncompile:{
            command: 'electron main.js'
          }
        },

        tsc: {
                options: {
                    // task options
                },
                files: [{
                    expand : true,
                    dest   : "app",
                    cwd    : "src",
                    ext    : ".js",
                    src    : [
                        "*.ts",
                        "!*.d.ts"
                    ]
                }]

        },
        copy: {
          main: {
            expand: true,
            cwd: 'src',
            src: ['**/*.html', '**/*.css'],
            dest: 'app/',
          },
        },

        watch: {
          scripts: {
            files: ['src/**/*'],
            tasks: ['copy','shell:tsc'],
            options: {
              spawn: false,
            },
          },
        },

        // make sure to call the 'browserSync:xxxx' task rather than just 'browserSync' so it doesn't try to serve multiple things
        browserSync: {
          dist: {
            options: {
              //watchTask: true,
              //files: ["./app"],
              port : 5050,
              //proxy: 'localhost:3000',
              server: './',
              // background must be true in order for grunt watch task to run
              background: true,
              browser: 'google chrome'
            }
          }
        },

        "mocha-server": {
          src: 'spec/serverSpec.js',
          options: {
              ui: 'bdd',
          },
        },

    });

    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('grunt-shell');
    //grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-tsc');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-server-mocha');

    grunt.registerTask('sync',['copy','shell:tsc','browserSync','watch']);
    grunt.registerTask('test',['shell:test']);
    grunt.registerTask('testDB',['shell:testDB']);
    grunt.registerTask('test:local', ['shell:loadTestDb', 'shell:testDB']);
    grunt.registerTask('default',['copy','shell:tsc','watch']);
    grunt.registerTask('production',['copy', 'shell:tsc']);
    grunt.registerTask('testServer',['shell:setTestDB']);
    grunt.registerTask('test',['shell:testDB']);


};
