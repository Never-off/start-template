const gulp = require('gulp');
const del = require('del'); // Delete folders
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const plumber = require('gulp-plumber'); // Errors
const nunjucksRender = require('gulp-nunjucks-render');// HTML
//const svgSprite = require('gulp-svg-sprite');

const path = {
  build: {
    html: 'build/',
    njk: 'build/',
    css: 'build/assets/css/',
    js: 'build/assets/js/',
  },
  src: {
    html: './dev/html/*.html',
    njk: './dev/njk/*.njk',
    css: './dev/sass/styles.scss',
    js: './dev/js/*.js',
  },
  watch: {
    html: './dev/html/**/*.html',
    njk: './dev/njk/**/*.njk',
    css: './dev/sass/**/*.{scss,sass}',
    js: './dev/js/*.js',
  }
};

//HTML nunjucks
function njk() {
  return gulp.src(path.src.njk)
    .pipe(nunjucksRender({
      path: ['dev/njk/']
    }))
    .pipe(gulp.dest(path.build.njk))
    .pipe(browserSync.stream());
}

//styles
function styles() {
  return gulp.src(path.src.css)
    .pipe(plumber())
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 3 version']
      })
    ]))
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
}

function scripts() {
  return gulp.src(path.src.js)
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: "build/"
  });

  //Следить за CSS файлами
  gulp.watch(path.watch.css, styles);
  //Следить за JS файлами
  gulp.watch(path.watch.js, scripts);
  //При изменении HTML запустить синхронизацию
  gulp.watch(path.watch.njk, njk);
}

//Delete folder build
function clean() {
  return del(['build/*'])
}

//Tasks
gulp.task('html', njk);
gulp.task('css', styles);
gulp.task('js', scripts);
gulp.task('del', clean);

gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts,njk)));
gulp.task('dev', gulp.series('build',watch));