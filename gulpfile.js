'use strict';

const gulp = require('gulp');

const addSrc = require('gulp-add-src');
const concat = require('gulp-concat');
const insert = require('gulp-insert');
const remoteSrc = require('gulp-remote-src');
const replace = require('gulp-replace');
const uglify = require('gulp-uglify');

const BENCHMARKJS_VERSION = '2.1.0';
const requestOptions = {
	'gzip': true,
	'strictSSL': true
};

gulp.task('js', function() {

	// Fetch Platform.js, Benchmark.js, and its jsPerf UI dependencies.
	remoteSrc([
		'bestiejs/platform.js/1.3.1/platform.js',
		`bestiejs/benchmark.js/${ BENCHMARKJS_VERSION }/benchmark.js`,
		`bestiejs/benchmark.js/${ BENCHMARKJS_VERSION }/example/jsperf/ui.js`,
		`bestiejs/benchmark.js/${ BENCHMARKJS_VERSION }/plugin/ui.browserscope.js`,
	], {
			'base': 'https://raw.githubusercontent.com/',
			'requestOptions': requestOptions
		}
	)

	// Use whatever version of lodash Benchmark.js is using.
	.pipe(addSrc.prepend(
		'node_modules/benchmark/node_modules/lodash/lodash.js'
	))

	.pipe(concat('all.js'))

	// Set the Google Analytics ID.
	.pipe(replace('gaId = \'\'', 'gaId = \'UA-6065217-40\''))

	// jsPerf is browser-only. Ensure we’re detected as a browser environment,
	// even if this is an AMD test, for example.
	.pipe(replace(/freeDefine = (?:[^;]+)/, 'freeDefine = false'))
	.pipe(replace(/freeExports = (?:[^;]+)/, 'freeExports = false'))
	.pipe(replace(/freeModule = (?:[^;]+)/, 'freeModule = false'))
	.pipe(replace(/freeRequire = (?:[^;]+)/, 'freeRequire = false'))
	.pipe(replace(/(if\s*\()(typeof define|freeDefine)\b/, '$1false'))

	// Set the CSS selector for the Browserscope results.
	.pipe(replace('\'selector\': \'\'', '\'selector\': \'#bs-results\''))

	// Avoid exposing `_` and `platform` as global variables.
	.pipe(insert.wrap(
		'(function(){var _,platform;',
		'}.call(this))'
	))

	// Minify the result.
	//.pipe(uglify())

	.pipe(gulp.dest('./dist/'));
});

gulp.task('assets', function() {
	// Update  Platform.js, Benchmark.js, and its jsPerf UI dependencies.
	remoteSrc([
		'index.html',
		'main.css'
	], {
			'base': `https://raw.githubusercontent.com/bestiejs/benchmark.js/${ BENCHMARKJS_VERSION }/example/jsperf/`,
			'requestOptions': requestOptions
		}
	)
	.pipe(replace('<script src="../../node_modules/lodash/index.js"></script>', ''))
	.pipe(replace('<script src="../../node_modules/platform/platform.js"></script>', ''))
	.pipe(replace('<script src="../../benchmark.js"></script>', ''))
	.pipe(replace('<script src="ui.js"></script>', ''))
	.pipe(replace('<script src="../../plugin/ui.browserscope.js"></script>', ''))
	.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['js', 'assets']);
