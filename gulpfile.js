const gulp = require('gulp');
const concat = require('gulp-concat');
const less = require('gulp-less');
const path = require('path');
const debug = require('gulp-debug');

gulp.task('less', () => {
  return gulp
    .src('./src/**/*.less')
    .pipe(debug())
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(concat('main.css'))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('js', () => {
  return gulp
    .src([
      "./node_modules/angular/angular.js",
      "./node_modules/angular-route/angular-route.js",
      "./src/index.js",
      "./src/**/*.js"
    ])
    .pipe(debug())
    .pipe(concat('scripts.js'))
    .pipe(gulp.dest('./dist/js'));
});

gulp.task('html', () => {
  return gulp
    .src('./src/**/*.html')
    .pipe(debug())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build', () => {
  return gulp.start(['less', 'html', 'js']);
});

gulp.task('watch', () => {
  gulp.start(['build']);
  gulp.watch(['./src/**/*.less'], ['less']);
  gulp.watch(['./src/**/*.html'], ['html']);
  gulp.watch(['./src/**/*.js'], ['js']);
});

