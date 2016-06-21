var gulp = require('gulp'), 
    sass = require('gulp-ruby-sass') ,
    notify = require("gulp-notify") ,
    uglify = require('gulp-uglifyjs'),
    concat = require('gulp-concat'),
    browserSync = require('browser-sync');

var config = {
  sassPath: './resources/sass',
  jsPath: './resources/js',
   supportforDir: './node_modules/support-for/sass' ,
   normalizeDir: './node_modules/normalize-scss/sass' ,
  publicPath: './public'
};

gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: config.publicPath
    }
  });
});

gulp.task('js', function() {
  return gulp.src([
      './node_modules/zenscroll/zenscroll-min.js',
      './node_modules/wowjs/dist/wow.js',
      config.jsPath + '/app.js'
    ])
      .pipe(uglify())
      .pipe(concat({ path: 'app.js' }))
      .pipe(gulp.dest(config.publicPath));
});

gulp.task('css', function() { 
  return gulp.src(config.sassPath + '/style.scss')
    .pipe(sass({
      style: 'compressed',
      loadPath: [
          './resources/sass',
          config.supportforDir,
          config.normalizeDir,
      ]
    })
    .on("error", notify.onError(function (error) {
        return "Error: " + error.message;
    })))
    .pipe(gulp.dest(config.publicPath));
});

 gulp.task('watch', function() {
  gulp.watch(config.publicPath + '/**/*.html', [browserSync.reload]); 
  gulp.watch(config.sassPath + '/**/*.scss', ['css', browserSync.reload]); 
  gulp.watch(config.jsPath + '/**/*.js', ['js', browserSync.reload]); 
});

  gulp.task('default', ['server', 'watch']);
