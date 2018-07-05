const templateCache = require('gulp-angular-templatecache');
const gulp = require('gulp');
const concat = require('gulp-concat');
const less = require('gulp-less');
const path = require('path');

gulp.task('less', () => gulp
  .src('./src/**/*.less')
  .pipe(less({ paths: [path.join(__dirname, 'less', 'includes')] }))
  .pipe(concat('main.css'))
  .pipe(gulp.dest('./dist/css')));

gulp.task('jsLib', () => gulp
  .src(['./node_modules/angular/angular.js'])
  .pipe(concat('lib.js'))
  .pipe(gulp.dest('./dist/js')));

gulp.task('js', () => gulp
  .src(['./src/index.js', './src/**/*.js'])
  .pipe(concat('scripts.js'))
  .pipe(gulp.dest('./dist/js')));

gulp.task('html', () => gulp
  .src('./src/**/*.component.html')
  .pipe(templateCache())
  .pipe(gulp.dest('./dist/js')));

gulp.task('build', () => gulp.start(['less', 'html', 'jsLib', 'js']));

gulp.task('default', () => {
  gulp.start(['build']);
});

gulp.task('watch', () => {
  gulp.start(['build']);
  gulp.watch(['./src/**/*.less'], ['less']);
  gulp.watch(['./src/**/*.html'], ['html']);
  gulp.watch(['./src/**/*.js'], ['js']);
});

