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
              outputType: 'failures', // tap, failures, stats
              outputTo: 'console' // or file
              //outputFilePath: '/tmp/out.log' // path for output file, only makes sense with outputTo 'file'
          },
          files: {
              'tests': ['./test/data/*.js']
          }
      }
    }
})
```

### Options

#### options.outputType
Specifies the type of output, the screenshots below might help.
Default value: `'failures'`
Allowable values: `'failures', 'stats', 'tap'`

#### options.outputType: stats
![stats outputMode](https://raw.github.com/maxnachlinger/grunt-node-tap/master/doc/stats.png)

#### options.outputType: failures
![failures outputMode](https://raw.github.com/maxnachlinger/grunt-node-tap/master/doc/failures.png)

#### options.outputType: tap
![tap outputMode](https://raw.github.com/maxnachlinger/grunt-node-tap/master/doc/tap.png)

#### options.outputTo
Where to write output. The console or a file.
Default value: `'console'`
Allowable values: `'console', 'file'`

#### options.outputFilePath
Path to output file, only makes sense if `outputTo` is set to `'file'`
Default value: `null`
