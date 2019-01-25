const gulp = require('gulp')
const sass = require('gulp-sass')
const browserSync = require('browser-sync').create()
const useref = require('gulp-useref')
const uglify = require('gulp-uglify')
const gulpIf = require('gulp-if')
const cssnano = require('gulp-cssnano')
const imagemin = require('gulp-imagemin')
const cache = require('gulp-cache')
const del = require('del')
const runSequence = require('run-sequence')

gulp.task('sass', function () {
    return gulp.src('app/scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
})

gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'app'
        },
    })
})

gulp.task('useref', function () {
    return gulp.src('app/*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('dist'))
})

gulp.task('images', function () {
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin({
            interlaced: true
        })))
        .pipe(gulp.dest('dist/images'))
})

gulp.task('fonts', function () {
    return gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
})

gulp.task('clean:dist', function () {
    return del.sync('dist');
})

gulp.task('watch', function () {
    gulp.watch('app/scss/**/*.scss', gulp.series('sass'))
    gulp.watch('app/scss/**/*.scss', gulp.series('browserSync'))
    gulp.watch('app/*.html').on('change', browserSync.reload)
    gulp.watch('app/js/**/*.js').on('change', browserSync.reload)
})

gulp.task('default', gulp.series('sass', 'useref', 'images', 'fonts', function (done) {
    done();
}));