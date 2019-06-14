const gulp = require('gulp');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require("gulp-csso");
const plumber = require('gulp-plumber');
const nunjucksRender = require('gulp-nunjucks-render');
//const svgSprite = require('gulp-svg-sprite');

const path = {
  build: {
    html:   'build/',
    njk:    'build/',
    css:    'build/assets/css/',
    js:     'build/assets/js/',
    images: 'build/images/',
    img:    'build/assets/img/'
  },
  src: {
    html:   './dev/html/*.html',
    njk:    './dev/njk/*.njk',
    css:    './dev/sass/main.scss',
    js:     './dev/js/*.js',
    images: './dev/images/html/**/*.{jpg,jpeg,png,gif,svg}',
    img:    './dev/images/css/**/*.{jpg,jpeg,png,gif,svg}'
  },
  watch: {
    html:   './dev/html/**/*.html',
    njk:    './dev/njk/**/*.njk',
    css:    './dev/sass/**/*.{scss,sass}',
    js:     './dev/js/*.js',
    images: './dev/images/html/**/*.{jpg,jpeg,png,gif,svg}',
    img:    './dev/images/css/**/*.{jpg,jpeg,png,gif,svg}'
  }
};

// nunjucks
function njk() {
  return gulp.src(path.src.njk)
    .pipe(nunjucksRender({
      path: ['dev/njk/']
    }))
    .pipe(gulp.dest(path.build.njk))
    .pipe(browserSync.stream());
}

// HTML
function html() {
  return gulp.src(path.src.html)
    .pipe(gulp.dest(path.build.html))
    .pipe(browserSync.stream());
}

// IMAGES
// images for html
function images() {
  return gulp.src(path.src.images)
    .pipe(gulp.dest(path.build.images))
    .pipe(browserSync.stream());
}

// images for css
function img() {
  return gulp.src(path.src.img)
    .pipe(gulp.dest(path.build.img))
    .pipe(browserSync.stream());
}

// styles
function styles() {
  return gulp.src(path.src.css)
    .pipe(plumber())
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(postcss([autoprefixer()]))
    .pipe(csso())
    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream());
}

// Scripts
function scripts() {
  return gulp.src(path.src.js)
    .pipe(gulp.dest(path.build.js))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
    server: "build/"
  });

  gulp.watch(path.watch.css, styles);
  gulp.watch(path.watch.js, scripts);
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
gulp.task('img', img);
gulp.task('images', images);
gulp.task('del', clean);

gulp.task('build', gulp.series(clean, gulp.parallel(styles,scripts,njk,images,img)));
gulp.task('dev', gulp.series('build',watch));