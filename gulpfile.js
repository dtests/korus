'use strict';
var gulp = require('gulp');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var plumber = require('gulp-plumber');
var combiner = require('stream-combiner2').obj;
var browserSync = require('browser-sync').create();
var debug = require('gulp-debug');
var del = require('del');
var sass = require('gulp-sass');
var newer = require('gulp-newer');
var rename = require('gulp-rename');

gulp.task('serve', function(){
	browserSync.init({
		server: 'dist'
	});
	browserSync.watch('dist/**/*.*').on('change', browserSync.reload);
});

gulp.task('clean', function(){
	return del('dist');
});

gulp.task('styles', function(){
	return gulp.src('app/sass/*.scss')
	    .pipe(plumber())
		.pipe(sass({outputStyle: 'expanded'}))
		.pipe(autoprefixer())   
		.pipe(combiner(cssnano({zindex: false})))
		.pipe(gulp.dest('dist/assets/css'));
});

gulp.task('pages', function(){
	return gulp.src('app/pages/**', {since: gulp.lastRun('pages')})
		.pipe(newer('dist'))
		.pipe(debug({title: 'pages'}))
		.pipe(gulp.dest('dist'));
});

gulp.task('jscripts', function() {
    return gulp.src('app/js/*.js')
        .pipe(plumber())
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(rename('app.min.js'))
        .pipe(gulp.dest('dist/assets/js'));
});

gulp.task('transfer', function(){
	return gulp.src('app/assets/**/*.*')
		.pipe(gulp.dest('dist/assets'));
});

gulp.task('watch', function(){
	gulp.watch('app/assets/**/*.*', gulp.series('transfer'));
	gulp.watch('app/sass/**/*.*', gulp.series('styles'));
	gulp.watch('app/js/**/*.*', gulp.series('jscripts'));
	gulp.watch('app/pages/**/*.*', gulp.series('pages'));
});

gulp.task('build', gulp.series('clean', gulp.parallel('transfer', 'pages', 'styles', 'jscripts')));


gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));