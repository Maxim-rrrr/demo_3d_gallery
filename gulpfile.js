const { src, dest, watch, series } = require('gulp');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const minify = require('gulp-minify');
const htmlmin = require('gulp-htmlmin');
const tinypng = require('gulp-tinypng-compress');
const gulpDeployFtp = require('gulp-deploy-ftp');
const del = require('del');

// Static server
function bs() {
    serveSass();
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });
    watch("./*.html").on('change', browserSync.reload);
    watch("./sass/**/*.sass", serveSass);
    watch("./sass/**/*.scss", serveSass);
    watch("./js/**/*.js").on('change', browserSync.reload);
};

//Sass
function serveSass() {
    return src("./sass/**/*.sass", "./sass/**/*.scss")
        .pipe(sass())
        //gulp-autoprefixer
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(dest("./css"))
        //browser-sync
        .pipe(browserSync.stream());
};

// buildCSS
function buildCSS(done) {
    src('css/**/**.css')
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(dest('dist/css/'));
    done();
};

// buildJS
function buildJS(done) {
    src(['js/**.js', '!js/**.min.js'])
        .pipe(minify({
            ext: {
                src: '-debug.js',
                min: '.js'
            },

        }))
        .pipe(dest('dist/js/'));

    src(['js/**.min.js'])
        .pipe(dest('dist/js/'));
    done();
};

// buildHTML
function buildHTML(done) {
    src('**.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest('dist/'));
    done();
};


// buildTxt
function buildTxt(done) {
    src('**.txt')
        .pipe(dest('dist/'));
    done();
};

//imgMin
function imgMin(done) {
    src('img/**/*.jpg')
        .pipe(tinypng({ key: 'qCMljd7n0TwTVKTdbHQqSKXS0PpmgkpP', }))
        .pipe(dest('dist/img/'));
    src('img/**/*.png')
        .pipe(dest('dist/img/'));
    src('img/**/*.svg')
        .pipe(dest('dist/img/'));
    src('img/**/*.ico')
        .pipe(dest('dist/img/'));
    done();
};


exports.serve = bs;
exports.build = series(buildCSS, buildJS, buildHTML, buildTxt, imgMin);