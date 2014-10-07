'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    codeFiles = ['./*.js'];

gulp.task('lint', function(){
    return gulp.src(codeFiles)
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter(stylish));
});

gulp.task('watch', function(){
    gulp.watch(codeFiles, function(){
        gulp.run('lint');
    });
});
gulp.task('default', ['lint', 'watch']);