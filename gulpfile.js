var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    sourcemaps = require("gulp-sourcemaps"),
    fileinclude = require('gulp-file-include'),
    browserSync = require("browser-sync").create();

var paths = {
    styles: {
        // By using styles/**/*.sass we're telling gulp to check all folders for any sass file
        src: "src/scss/*.scss",
        // Compiled files will end up in whichever folder it's found in (partials are not compiled)
        dest: "dist/css"
    },
    templates: {
        src: "src/templates/*.html",
        dest: "dist/"
    },
    dist: "dist/"
};


function style() {
    return gulp
        .src(paths.styles.src)
        // Initialize sourcemaps before compilation starts
        .pipe(sourcemaps.init())
        .pipe(sass())
        .on("error", sass.logError)
        // Use postcss with autoprefixer and compress the compiled file using cssnano
        .pipe(postcss([autoprefixer(), cssnano()]))
        // Now add/write the sourcemaps
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))
        // Add browsersync stream pipe after compilation
        .pipe(browserSync.stream());
}

function reload() {
    browserSync.reload();
}

function html() {
    return gulp.src(['./src/templates/*.html'])
        .pipe(fileinclude())
        .pipe(gulp.dest('./dist/'));
}

function watch() {
    browserSync.init({
        server: {
            baseDir: paths.dist
        }
    });
    gulp.watch(paths.styles.src, style);

    gulp.watch(paths.templates.src, html);

    gulp.watch(paths.templates.src, reload);
}


// Don't forget to expose the task!
exports.watch = watch

// Expose the task by exporting it
// This allows you to run it from the commandline using
// $ gulp style
exports.style = style;

exports.html = html;

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.parallel(style, watch);
 
/*
 * You can still use `gulp.task` to expose tasks
 */
gulp.task('build', build);

/*
 * Define default task that can be called by just running `gulp` from cli
 */
gulp.task('default', build);