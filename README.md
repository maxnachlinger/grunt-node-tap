# grunt-node-tap
[![Build Status](https://travis-ci.org/maxnachlinger/grunt-node-tap.png?branch=master)](https://travis-ci.org/maxnachlinger/grunt-node-tap)
> Grunt task to run node-tap tests and read their output.

## Getting Started
This plugin requires Grunt `~0.4.1` 
```shell
npm install grunt-node-tap --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript: 
```js
grunt.loadNpmTasks('grunt-node-tap');
```

### Usage Examples
```js
grunt.initConfig({
    node_tap: {
      default_options: {
        options: {
          outputLevel: 'failures' // failures, stats
        },
        files: {
          'tests': ['./test/data/*.js']
        }
      }
    }
})
```

### Options

#### options.outputLevel
Type: `String`
Default value: `'failures'`

A string value that is used to control the output. Here are some fun screen-shots.

#### options.outputLevel: stats
![stats outputMode](https://raw.github.com/maxnachlinger/grunt-node-tap/master/doc/stats.png)

#### options.outputLevel: failures
![failures outputMode](https://raw.github.com/maxnachlinger/grunt-node-tap/master/doc/failures.png)

#### options.outputLevel: tap
![failures outputMode](https://raw.github.com/maxnachlinger/grunt-node-tap/master/doc/tap.png)
