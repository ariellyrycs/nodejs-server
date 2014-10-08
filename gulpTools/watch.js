/**
 * Created by arobles on 10/7/14.
 */
module.exports = function (gulp, codeFiles) {
    gulp.task('watch', function(){
        gulp.watch(codeFiles, function(){
            gulp.run('lint');
        });
    });
};
