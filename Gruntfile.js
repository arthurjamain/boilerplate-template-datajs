// Taken and adapted from https://github.com/nicolsc/new-backbone-app
// JSHINT : (buggy last version at moment of writing)
// npm install https://github.com/gruntjs/grunt-contrib-jshint/archive/7fd70e86c5a8d489095fa81589d95dccb8eb3a46.tar.gz
/*global module:false,console*/
module.exports = function(grunt) {
  'use strict';


  var adapter = [];
  var device;
  var buildDir = 'build/app/';
  var mainPath = 'app/js/';

  // ==========================================================================
  // CUSTOM TASKS
  // ==========================================================================
  // Our own "Joshfire" files optimizer
  grunt.registerMultiTask('joshoptimize', 'Optimize JS and HTML files for project using the Joshfire Framework', function (arg) {
    device = 'tablet';
    for (var k in this.data.options) {
      if (this.data.options.hasOwnProperty(k)) {
        adapter.push(k);
      }
    }
    if(adapter.length === 0){
      adapter[ 0 ] = 'ios';
    }
    // Tell grunt this task is asynchronous.
    var done = this.async();

    // Gets all the Javascript files - And accepts wildcard patterns
    var jsFiles = this.data.src.filter(function(i) { return i.match(/\.js/); });
    
    var ext;
    // Gets all the html files - And accepts wildcard patterns
    var htmlFiles = grunt.file.expandFiles(
      this.data.src.filter(function(i) { return (ext = i.match(/\.x?html/)); })
    );


    // Process each HTML files
    grunt.util.async.forEach(htmlFiles, function (HTMLFile) {
      var HTMLFileSrc = grunt.file.read(HTMLFile),
      HTMLFileDest = 'build/' + HTMLFile.slice(0, - ext[0].length) + '.' + device + ext ,
      modifiedHTMLFileSrc = HTMLFileSrc.replace(/data-css href="[^"]*"/, 'href="styles.' + device + '.css"');
      modifiedHTMLFileSrc = modifiedHTMLFileSrc.replace(/data-adapter-android data-main="([^"]*)" src="[^"]*"/, 'src="main.' + device + '.android.js"');
      modifiedHTMLFileSrc = modifiedHTMLFileSrc.replace(/data-adapter-ios data-main="([^"]*)" src="[^"]*"/, 'src="main.' + device + '.ios.js"');

      grunt.file.write(HTMLFileDest, modifiedHTMLFileSrc);
      grunt.log.writeln('Wrote ' + HTMLFileDest);
    }, function(err) {
      done();
    });

    // Process each JS files
    grunt.util.async.forEach(jsFiles, optimizeJSFile, function(err) {
      done();
    });
  });

  // ==========================================================================
  // CUSTOM FUNCTIONS
  // ==========================================================================
  function optimizeJSFile(JSFile, callback) {
    JSFile = JSFile.slice(0, -3); // (remove ".js")

    function optimizeJSFileAdapter(adap, callback) {

      function doneCallback(error, result, code) {
        if (error) {
          callback(error);
          return;
        }
        // grunt.log.writeln('Wrote ' + JSFile + '.' + adap + '.optimized.js';);
        callback();
      }

      // Prepare spawn for e.g. node lib/framework/scripts/optimize.js ios main.js
      var spawnOptions = {
        cmd: 'node',
        args: [
          'lib/framework/scripts/optimize.js',
          adap,
          JSFile
        ]
      };
      grunt.util.spawn(spawnOptions, doneCallback);
    }

    function moveFile(){
        grunt.file.setBase('../..'); // Todo: should be dynamic with mainPath
        for(var i = 0; i < adapter.length; i++){
          var filenameIn = JSFile + '.' + adapter[ i ] + '.optimized.js';
          var filenameOut = JSFile + '.' + device +'.' +  adapter[ i ] + '.js';
          grunt.file.copy(mainPath + filenameIn, buildDir + filenameOut);
          grunt.file.delete(mainPath + filenameIn);
          grunt.log.writeln('Wrote ' + filenameOut);
        }
    }
    grunt.file.setBase(mainPath);
    grunt.util.async.forEach(adapter, optimizeJSFileAdapter, function(err) {
      if(err) throw err;
      moveFile();
      callback();
    });
  }

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'build/app/styles.tablet.css': 'app/sass/styles.scss'
        }
      },
      dev: {
        options: {
          style: 'expanded'
          // debugInfo: true,
          // lineNumbers: true,
          // compass: true
        },
        files: {
          'app/css/styles.css': 'app/sass/styles.scss'
        }
      }
    },
    jshint: {
      all: [
        // 'Gruntfile.js',
        'app/js/*.js',
        'tests/**/*.js'
        ],
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true,
        globals: {
          define: true,
          console: true,
          require: true
        }
      }
    },
    watch: {
      files: ['app/sass/*.scss'],
      tasks: 'sass:dev'
    },

    joshoptimize: {
      tablet: {
        src: ['main.js', 'app/index.html'],
        options: {
          android: true,
          ios: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task.
  grunt.registerTask('default', ['jshint', 'sass', 'joshoptimize:tablet']);
  grunt.registerTask('tablet', ['jshint', 'sass', 'joshoptimize:tablet']);
  grunt.registerTask('prod', ['jshint', 'sass:dist', 'joshoptimize']);
};
