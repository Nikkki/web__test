var gulp = require('gulp'),
	sass = require('gulp-sass'),
	connect = require('gulp-connect'),
	livereload = require('gulp-livereload'),
 	browserify = require('gulp-browserify'),
	rename = require("gulp-rename");


//sass
gulp.task('sass', function () {
    gulp.src('public/stylesheets/**/*.scss')
        .pipe(connect.reload());
});

//css
gulp.task('css', function() {
  gulp.src('public/stylesheets/main.scss') 
  .pipe(sass())
  .pipe(gulp.dest('dist/styles'))
  .pipe(connect.reload());
});

/* connect */
gulp.task('connect', function() {
  connect.server({
    root: 'dist',
    livereload: true,
    port:1337
  });
});

/*html*/
gulp.task('html', function () {
  gulp.src('./dist/index.html')
    .pipe(connect.reload());
});


gulp.task('browserify', function () {
  return gulp.src('./public/javascripts/index.js')
    .pipe(rename('webschool.js'))
    .pipe(browserify({debug: true}))
    .pipe(gulp.dest('dist/js'))
    .pipe(connect.reload());
})


gulp.task('watch', function (){
	gulp.watch(['./dist/index.html'], ['html']);
  	gulp.watch('./public/javascripts/**/*.js', ['browserify']);
	gulp.watch(['./public/stylesheets/**/*.scss'], ['css']);
})

gulp.task('build', ['connect', 'html', 'sass', 'css', 'browserify', 'watch']);
