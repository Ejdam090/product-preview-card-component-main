const { src, dest, watch, series, parallel, gulp } = require("gulp");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass")(require("sass"));
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const browsersync = require("browser-sync").create();
const autoprefixer = require("autoprefixer");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");

//Sass task

function scssTask() {
  return src("src/scss/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass([]))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write("."))
    .pipe(dest("dist"));
}

//JS task

function jsTask() {
  return src("src/js/**/*.js", { sourcemaps: true })
    .pipe(concat("all.js"))
    .pipe(uglify())
    .pipe(dest("dist"));
}

//browser-sync

function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: ".",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

//watch task

function watchTask() {
  watch("*.html", browsersyncReload);
  watch(
    ["src/scss/**/*.scss", "src/js/**/*.js"],
    parallel(scssTask, jsTask, browsersyncReload)
  );
}
//default gulp task

exports.default = series(
  parallel(scssTask, jsTask),
  browsersyncServe,
  watchTask
);
