var gulp = require('gulp');
var connect = require('gulp-connect');
var less = require('gulp-less');
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var autoprefixer = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var requirejs = require('gulp-requirejs');

gulp.task('less', function () {
  gulp.src('less/*.less')
    .pipe(less())
    .pipe(concat('common.css'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(minifyCSS())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./build'))
    .pipe(connect.reload());
});

gulp.task('html', function () {
  gulp.src(['*.html', 'partials/*.html'])
    .pipe(connect.reload());
});

gulp.task('js', function () {
  requirejs({
    baseUrl: 'js',
    name: '../bower_components/almond/almond',
    include: ['main'],
    insertRequire: ['main'],
    out: 'common.js',
    wrap: false
  })
    .pipe(uglify({
      options: {
        mangle: false
      }
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('./build'))
    .pipe(connect.reload());
});

gulp.task('connect', function () {
  connect.server({
    livereload: true,
    port: 1337,
    root: [__dirname]
  });
});

gulp.task('watch', function () {
  gulp.watch('less/*.less', ['less']);
  gulp.watch('js/*.js', ['js']);
  gulp.watch(['*.html', 'partials/*.html'], ['html']);
})

gulp.task('default', ['less', 'js', 'html', 'connect', 'watch']);
