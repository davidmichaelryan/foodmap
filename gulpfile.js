var gulp = require('gulp');
var concat = require('gulp-concat');
var stylus = require('gulp-stylus');
var del = require('del');

gulp.task('clean_js', function() {
    return del(['public/*.js']);
});

gulp.task('clean_css', function() {
    return del(['public/*.css']);
});

gulp.task('clean', ['clean_css', 'clean_js'], function(){});
 
gulp.task('scripts', ['clean_js'], function() {
    gulp.src(['src/frontend/!(flavortown).js', 'node_modules/haversine/haversine.js'])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest('public'));
    gulp.src('src/frontend/flavortown.js')
        .pipe(gulp.dest('public'));
});

gulp.task('styles', ['clean_css'], function() {
    return gulp.src('src/frontend/*.styl')
        .pipe(stylus())
        .pipe(concat('styles.css'))
        .pipe(gulp.dest('public'));
});

gulp.task('watch', ['scripts', 'styles'], function() {
    gulp.watch('src/frontend/*.styl', ['styles'])
    gulp.watch('src/frontend/*.js',   ['scripts']);
});
 
// The default task (called when you run `gulp` from cli) 
gulp.task('default', ['scripts', 'styles']);
