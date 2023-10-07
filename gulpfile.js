const { src,dest, watch,parallel,series,} = require("gulp"); /* parallel функция одновременного запуска wathc и browsersinc слежения и авто обновления браузера 
                                                                 series следит за последовательностью выполнения функций*/

const scss = require("gulp-sass")(require("sass")); /* плагин sass */
const concat = require("gulp-concat"); /* обединение и переименовка файлов  */
const uglify = require("gulp-uglify-es").default; /* минификация js файлов */
const browserSync = require("browser-sync").create(); /* авто обновление браузера */
const autoprefixer = require("gulp-autoprefixer"); /* авто изменение под различные версии браузеров */
const clean = require("gulp-clean");

function styles() {
  /* функция берет файл scss и преобразует в файл css в папке dist */
  return src("app/scss/style.scss")
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 version"] })) /* авто изменение под различные версии браузеров */
    .pipe(concat("style.min.css")) /* переименовка файлов с помощб concat */
    .pipe(scss({ outputStyle: "compressed" })) /* минификация css */
    .pipe(dest("app/css")) /* создаем и помещаем  готовый файл в папку dist */
    .pipe(browserSync.stream());
}

function scripts() {
  /* функция берет файл js и преобразует в файл js в папке dist */
  return src("app/js/main.js")
    .pipe(concat("main.min.js"))
    .pipe(uglify())
    .pipe(dest("app/js"))
    .pipe(browserSync.stream());
}

function watching() {
  /* функция сторож авто запуск функций js и style и html */
  watch(["app/scss/**/*.scss"], styles);
  watch(["app/js/main.js"], scripts);
  watch(["app/*.html"]).on("change", browserSync.reload);
}

function browsersync() {
  /* функция авто обновления браузера пи любом изменении в папку app */
  browserSync.init({
    server: {
      baseDir: "app/",
    },
  });
}

function bilding() {
  /* функция bild копирует только указанные файлы в папку dist с тохранением структуры файлов */
  return src(["app/css/style.min.css", "app/js/main.min.js", "app/**/*.html"], {
    base: "app",
  }).pipe(dest("dist"));
}

function cleanDist() {
  return src("dist").pipe(dest("dist"));
}

exports.styles = styles;
exports.scripts = scripts;
exports.watching = watching;
exports.browsersync = browsersync;

exports.build = series(
  cleanDist,
  bilding
); /* с начала удаляем папку dist со всем содержимым а потом билдим новые файлы */
exports.default = parallel(
  styles,
  scripts,
  browsersync,
  watching
); /* запуск по дефолту при написании команды gulp в консоль */
