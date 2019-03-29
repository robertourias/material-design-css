const gulp = require('gulp');

const browserSync = require('browser-sync').create();
const SSI = require('browsersync-ssi');

const postcss = require('gulp-postcss');
const atImport = require('postcss-import');
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');
const precss = require('precss');
const concat = require('gulp-concat');
const lost = require('lost');
const imagemin = require('gulp-imagemin');
const assets = require('postcss-assets');

gulp.task('img', function() {
    return gulp.src([
            './src/images/**/*'
        ])
        .pipe(imagemin())
        .pipe(gulp.dest('./dist/images'));
});

gulp.task('css', function() {
    var plugins = [
        atImport, // facilitar chamadas de @import (busca a pasta node_modules/packages/etc automaticamente)
        autoprefixer, // insere prefixos crossbrowser
        precss, // permite usar sintaxe de sass no css
        cssnano, // minificação de css
        lost, // grids
        assets({ // Helpers para imagens
            loadPaths: ['./dist/images/']
        })
    ];
    return gulp.src([
            './vendor/css/slick.css',
            './vendor/css/slick-theme.css',
            './node_modules/slick-carousel/slick/slick.css',
            './node_modules/slick-carousel/slick/slick-theme.css',
            './src/css/**/*'
        ])
        .pipe(concat('main.css'))
        .pipe(postcss(plugins))
        .pipe(gulp.dest('./dist/css'))
        .pipe(browserSync.stream());
});

gulp.task('jsDependencies', function() {
    return gulp.src([
            './node_modules/jquery/dist/jquery.js',
            './vendors/js/materialize.min.js',
        ])
        .pipe(concat('dep.js'))
        .pipe(minify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('js', function() {
    return gulp.src([
            './src/js/main.js'
        ])
        .pipe(concat('main.js'))
        //.pipe(minify())
        .pipe(gulp.dest('./dist/js'));
});

gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: './',
            directory: true,
            middleware: SSI({
                baseDir: './',
                ext: '.html'
            })
        },
        ghostMode: false,
    });

    gulp.watch([
        './src/css/**/*',
    ], ['css']);

    gulp.watch([
        './src/js/**/*',
    ], ['js']).on('change', browserSync.reload);

    gulp.watch([
        './src/images/**/*',
    ], ['img']).on('change', browserSync.reload);

    gulp.watch([
        './',
    ]).on('change', browserSync.reload);
});

gulp.task('default', ['img', 'jsDependencies', 'js', 'css', 'watch']);