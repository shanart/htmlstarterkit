var gulp = require("gulp"),
    sass = require("gulp-sass"),
    postcss = require("gulp-postcss"),
    autoprefixer = require("autoprefixer"),
    cssnano = require("cssnano"),
    gcmq = require("gulp-group-css-media-queries"),
    concat = require("gulp-concat"),
    babel = require("gulp-babel"),
    uglify = require("gulp-uglify"),
    cleanCSS = require("gulp-clean-css"),
    sourcemaps = require("gulp-sourcemaps"),
    fileinclude = require("gulp-file-include"),
    browserSync = require("browser-sync").create();

var paths = {
    styles: {
        src: "src/scss/*.scss",
        dest: "dist/css"
    },
    templates: {
        src: "src/templates/*.html",
        dest: "dist/"
    },
    js: {
        src: "src/js/*.js",
        dest:"dist/js/"
    },
    dist: "dist/"
};



/* javascripts tasks */
function js_libs() {
    return gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
        ])
        .pipe(concat('lib.js'))
        .pipe(gulp.dest(paths.js.dest));
}


/* javascripts tasks */
function js() {
    return gulp.src(paths.js.src)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        // .pipe(uglify())
        .pipe(gulp.dest(paths.js.dest));
}



function style() {
    return (
        gulp.src(paths.styles.src)
            // .pipe(sourcemaps.init())
            .pipe(sass())
            .on("error", sass.logError)

            .pipe(postcss([autoprefixer(), cssnano()]))
            .pipe(gcmq())
            .pipe(cleanCSS())

            // .pipe(sourcemaps.write())
            .pipe(gulp.dest(paths.styles.dest))
            .pipe(browserSync.stream())
    );
}

function reload() {
    browserSync.reload();
}

function html() {
    return gulp.src(paths.templates.src)
        .pipe(fileinclude())
        .pipe(gulp.dest(paths.dist));
}

/*
  One task to rule them all, one task to find them,
  One task to bring them all and in the darkness bind them :)
*/
function watch() {
    browserSync.init({
        server: {
            baseDir: paths.dist,
        },
        port: 9000,
        open: false
    });

    gulp.watch(paths.styles.src, style);
    gulp.watch(paths.styles.src, reload);

    gulp.watch("src/scss/**/*.scss", style);
    gulp.watch("src/scss/**/*.scss", reload);

    gulp.watch(paths.js.src, js);
    gulp.watch(paths.js.src, reload);

    gulp.watch("./src/templates/**/*.html", html);
    gulp.watch("./src/templates/**/*.html", reload);

    gulp.watch(paths.templates.src, html);
    gulp.watch(paths.templates.src, reload);
}

// Don't forget to expose the task!
exports.watch = watch;

// Expose the task by exporting it
// This allows you to run it from the commandline using
exports.style = style;

/*
 * javascirpt libraries
 */
exports.js_libs = js_libs;

/*
 * javascirpt
 */
exports.js = js;

/*
 * Templates managing
 */
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
