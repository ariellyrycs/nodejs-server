
module.exports = function (gulp, codeFiles, jshint, stylish) {
    gulp.task('lint', function() {
        return gulp.src(codeFiles)
            .pipe(jshint.reporter(stylish));
    });
};
