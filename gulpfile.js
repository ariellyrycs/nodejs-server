'use strict';

var gulp = require('gulp'),
    jsHint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    jsHintFile = require('./gulpTools/jshint.js'),
    watchFile = require('./gulpTools/watch.js'),
    codeFiles = ['./*.js'];


jsHintFile(gulp, codeFiles, jsHint, stylish);
watchFile(gulp, codeFiles);

gulp.task('default', ['lint', 'watch']);