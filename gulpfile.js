"use strict";

var gulp = require("gulp"),
    injectVersion = require('gulp-inject-version'),
    argv = require('yargs').argv,
    series = require('stream-series'),
    rimraf = require("rimraf"),
    gulpif = require('gulp-if'),
    concat = require("gulp-concat"),
    cssmin = require("gulp-cssmin"),
    inject = require("gulp-inject"),
    uglify = require("gulp-uglify"),
    replace = require('gulp-string-replace');

var paths = {
    webroot: "./build/"
};

paths.target = gulp.src('./src/index.html');
paths.concatJsDest = paths.webroot + "js";
paths.concatCssDest = paths.webroot + "css";

gulp.task("clean", function (cb)
{
    rimraf(paths.webroot + "*", cb);
});

gulp.task('files', ["clean"], function ()
{
    var filesToMove = [
            "./src/views/**/*.html",
            "./src/views/**/**/*.html",
            "./src/fonts/*.*",
            "./src/favicon.ico",
            "./src/images/flags32.png",
            "./src/images/earth.png",
            "./src/images/unesco.png",
            "./src/images/markers/*.png"
    ];

    return gulp.src(filesToMove, { base: './src' })
                        .pipe(gulp.dest(paths.webroot));;
});

gulp.task('version', ["clean"], function ()
{
    return gulp.src('./src/views/footer.html', { base: './src' })
                            .pipe(injectVersion({replace: "localhost"}))
                            .pipe(gulp.dest(paths.webroot));
});

gulp.task('manifest', ["clean"], function ()
{
    return gulp.src('./src/sw.js', { base: './src' })
                            .pipe(injectVersion({replace: "{{localhost}}"}))
                            .pipe(gulp.dest(paths.webroot));
});

gulp.task('serviceWorker', ["clean"], function ()
{
    return gulp.src('./src/manifest.json', { base: './src' })
                            .pipe(gulpif(argv.build, replace('/build/', '/realplanet/build/')))
                            .pipe(gulp.dest(paths.webroot));
});

var cssStream = gulp.src(
    [
        "./src/libs/ext/bootstrap/dist/css/bootstrap.min.css",
        "./src/libs/ext/leaflet/dist/leaflet.css",
        "./src/libs/ext/toastr/toastr.min.css",
        "./src/libs/ext/world-flags-sprite/stylesheets/flags32.css",
        "./src/libs/ext/leaflet.markercluster/dist/MarkerCluster.css",
        "./src/libs/ext/leaflet.markercluster/dist/MarkerCluster.Default.css",
        "./src/css/main.css",
    ]);

var libsStream = gulp.src(
    [
      "./src/libs/ext/respond/dest/respond.min.js",
      "./src/libs/ext/jquery/dist/jquery.min.js",
      "./src/libs/ext/toastr/toastr.min.js",
      "./src/libs/ext/bootstrap/dist/js/bootstrap.min.js",
      "./src/libs/ext/angular/angular.min.js",
      "./src/libs/ext/angular-ui-router/release/angular-ui-router.min.js",
      "./src/libs/ext/leaflet/dist/leaflet.js",
      "./src/libs/ext/leaflet-providers/leaflet-providers.js",
      "./src/libs/ext/angular-leaflet-directive/dist/angular-leaflet-directive.min.js",
      "./src/libs/ext/leaflet.markercluster/dist/leaflet.markercluster.js"
  ]);

var appStream = gulp.src(
    [
        './src/js/*.js',
        './src/js/**/*.js',
        './src/views/*.js',
        './src/views/**/*.js',
        './src/services/*.js',
        './src/services/**/*.js',
        './src/controls/*.js',
        './src/controls/**/*.js'
    ]);

gulp.task('app', ['serviceWorker', 'manifest', 'version', 'files'], function ()
{
    var libsCss = cssStream
                .pipe(cssmin())
                .pipe(concat('libs.min.css'))
                .pipe(gulp.dest(paths.concatCssDest));
    var libsJs = libsStream
                .pipe(uglify())
                .pipe(concat('libs.min.js'))
                .pipe(gulp.dest(paths.concatJsDest));
    var appJs = appStream
                .pipe(gulpif(argv.build, uglify())) // check if build - uglify
                .pipe(concat('app.min.js'))
                .pipe(gulp.dest(paths.concatJsDest));

    return paths.target
        .pipe(inject(series(libsCss, libsJs, appJs),
        {
            removeTags: true,
            ignorePath: "/build/",
            addRootSlash: false
        }))
        //.pipe(gulpif(argv.build, replace('<base href="/build/">', '<base href="/realplanet/build/">')))
        .pipe(gulp.dest(paths.webroot));
});

gulp.task("default", ["app"]);
