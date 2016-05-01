# Benchmark.js wrapper for jsPerf [![Build status](https://travis-ci.org/jsperf/benchmark.js-wrapper.svg)](https://travis-ci.org/jsperf/benchmark.js-wrapper)

This repository hosts scripts that generate the special jsPerf-specific build of Benchmark.js.

Demo / test page: <https://jsperf.github.io/benchmark.js-wrapper/>

## Why does jsPerf need a special build?

On jsPerf, we want to avoid creating global variables for Benchmark.js’s dependencies such as `_` and `platform`, since they might interfere with people’s tests otherwise.

Additionally, there are some jsPerf-specific settings that are not hardcoded in the distributed versions of Benchmark.js and its jsPerf UI plugin.
