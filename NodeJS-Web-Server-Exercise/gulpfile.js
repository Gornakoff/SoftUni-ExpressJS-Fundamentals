const gulp = require('gulp')
const minifyHtml = require('gulp-htmlmin')
const rename = require('gulp-rename')
const del = require('del')

const destFolder = 'views'

gulp.task('minify-html', () => {
  del.sync('views/**/*.min.html')
  return gulp.src('views/**/*.html')
  .pipe(minifyHtml({
    collapseWhitespace: true
  }))
  .pipe(rename({
    suffix: '.min'
  }))
  // .pipe(gulp.dest('views'))
  .pipe(gulp.dest(destFolder))
})
