var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var sass        = require('gulp-sass');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var rename      = require('gulp-rename');
var minify      = require('gulp-minify-css');
var sourcemaps  = require('gulp-sourcemaps');
var Server      = require('karma').Server;

gulp.task('serve', ['sass', 'js'], function() {

  browserSync.init({
    server: "./app"
  });

  gulp.watch("app/scss/*.scss", ['sass']).on('change', browserSync.reload);;
  gulp.watch("app/js/**/*.js", ['js']);
  gulp.watch("app/**/*.html").on('change', browserSync.reload);
});

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
  return gulp.src("app/scss/app.scss")
    .pipe(sass())
    .pipe(concat('app.css'))
    .pipe(gulp.dest("app/css"))
    .pipe(minify({compatibility: 'ie8'}))
    .pipe(sourcemaps.write())
    .pipe(rename({extname: ".min.css"}))
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  gulp.src(['app/js/app.js', 'app/js/controllers/*.js'])
    .pipe(concat('all.js'))
    .pipe(gulp.dest('./app/js'))
    .pipe(uglify())
    .pipe(rename({extname: ".min.js"}))
    .pipe(gulp.dest('./app/js'))
});

gulp.task('test', function (done) {
  new Server({
    configFile: __dirname + '/test/karma.conf.js'
  }, done).start();
});

gulp.task('default', ['serve']);
