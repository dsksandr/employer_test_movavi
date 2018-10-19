let gulp = require('gulp'),
    sass = require('gulp-sass'),
    uglifyes = require('gulp-uglifyes'),
    autoprtfixer = require('gulp-autoprefixer'),
    browsersync = require('browser-sync'),
    htmlmin = require('gulp-htmlmin'),
    rename = require('gulp-rename'),
    del = require('del'),
    cssmin = require('gulp-csso'),
    babel = require('gulp-babel');

gulp.task('html', () => {
    return gulp.src('app/*.html')
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('dist'));
});
gulp.task('sass', () => {
    return gulp.src('app/style/sass/**/*.+(scss|sass)')
        .pipe(sass())
        .pipe(autoprtfixer())
        .pipe(cssmin())
        .pipe(gulp.dest('dist/style'));
});
gulp.task('js:es6', () => {
    return gulp.src('app/script/**/*.js')
        .pipe(gulp.dest('dist/script'))
        .pipe(uglifyes())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist/script'));
});
gulp.task('js:es5', () => {
    return gulp.src('app/script/**/*.js')
        .pipe(babel({presets: ['@babel/env']}))
        .pipe(rename({suffix: '.es5'}))
        .pipe(gulp.dest('dist/script'));
});
gulp.task('clean', () => {
   return del(['dist/**', '!dist'])
});
gulp.task('img', () => {
   return gulp.src('app/img/**')
    .pipe(gulp.dest('dist/img'));
});
gulp.task('json', () => {
    return gulp.src('app/response/**')
        .pipe(gulp.dest('dist/response'));
});
gulp.task('server', () => {
    return browsersync({
        browser: ['chrome'],
        server: {
            baseDir: 'dist',
            routes: {
                "/bower_components": "bower_components"
            },
            port: 8080
        }
    })
});
gulp.task('sass:watch', () => {
    return gulp.watch('app/style/sass/**/*.+(scss|sass)', gulp.series('sass', (done) => {
        browsersync.reload();
        done();
    }));
});
gulp.task('html:watch', () => {
    return gulp.watch('app/*.html', gulp.series('html', (done) => {
        browsersync.reload();
        done();
    }));
});
gulp.task('js:watch', () => {
    return gulp.watch('app/script/**/*.js', gulp.series('js:es6', (done) => {
        browsersync.reload();
        done();
    }));
});
gulp.task('json:watch', () => {
    return gulp.watch('app/response/**/*.json', gulp.series('json', (done) => {
        browsersync.reload();
        done();
    }));
});
gulp.task('img:watch', () => {
    return gulp.watch('app/img/**/*.+(png|jpg|svg)', gulp.series('img', (done) => {
        browsersync.reload();
        done();
    }));
});
gulp.task('default', gulp.series('clean', gulp.parallel('img:watch', 'html', 'sass', 'json', 'js:es6', 'js:es5', 'img', 'server', 'sass:watch', 'html:watch', 'js:watch', 'json:watch')));
