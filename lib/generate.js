#!/usr/bin/env node

/*jshint laxcomma: true */
/**
 * @file Generate Redis protocol from sets of operations.
 * @see http://redis.io/topics/mass-insert
 */
var fs = require('fs')
  , path = require('path')
  , Writable = require('stream').Writable
  , _buffer = ''
  , stream;

// Read in our AOF file.
stream = new Writable();

// Implements our `_write` method on our stream.
stream._write = function (_data, enc, next) {
  var lines
    , _line
    , _parts
    , _op
    , _arg
    , _aof
    , i
    , l;

  _buffer += _data.toString('utf8');
  lines = _buffer.split(/\n/);

  // If our last element is not complete, reset our buffer for the next
  // chunks to append to it.
  if (lines[lines.length - 1].indexOf('\r') === -1) {
    _buffer = lines.pop();
  }

  // Iterate all our lines to build complete sets of operations.
  for (i = 0, l = lines.length; i < l; i++) {
    _line = lines[i].trim();
    _parts = _line.split(/\s/);

    // Parse our operation, keys, and values
    _op = _parts.shift();

    // Generate our Redis protocol
    _aof = [
      '*' + (_parts.length + 1),
      '$' + _op.length,
      _op
    ];
    while (_parts.length) {
      _arg = _parts.shift();
      _aof.push('$' + _arg.length);
      _aof.push(_arg);
    }

    console.log(_aof.join('\r\n') + '\r');
  }

  next();
};

// When our stream is done, warn if there's any leftovers.
stream.on('end', function () {
  if (_buffer.length) {
    console.error('\nFinished stream with leftovers:');
    console.error(_buffer.split('\n').map(function (line, i) {
      return '  ' + (i + 1) + '> ' + line;
    }).join('\n'));
  }
});

// Parse our source file if available.
if (process.argv.length > 2) {
  process.stdin.end();
  return fs.createReadStream(path.resolve(process.argv[2])).pipe(stream);
}

// Try to grab data from stdin
process.stdin.pipe(stream);
