# waoffle
A Redis AOF file parser. This module parses an AOF structure like this:
``` aof
*3
$9
PEXPIREAT
$10
myRedisKey
$13
1719298712484
*3
$3
SET
$9
myJSONKey
$24
{"someKey": "someValue"}
```

... into raw Redis commands, like this:
``` redis
PEXPIREAT myRedisKey 1719298712484
SET myJSONKey {"someKey": "someValue"}
```

# Installation/Usage
You can install this module via `npm`:
``` bash
$ npm install -g waoffle
```
This installs a global binary `waoffle` to which you can use to pipe your ~~syrup~~ data to:
``` bash
$ cat appendonly.aof | waoffle  # Pipe from other UNIX commands
$ waoffle < appendonly.aof      # or, pipe directly from stdin
$ waoffle appendonly.aof        # or, just specify the filename
```
Each of the three cases above are equivalent. The generated output will be streamed to stdout, to which you can dump into a file using redirection:
``` bash
$ woaffle < appendonly.aof > generated_commands.txt
```

# Importing back into Redis
This is useful when wanting to import a large dataset of Redis data into another server without having to take it down. `redis-cli` comes with a `--pipe` option to which you can do:
``` bash
$ waoffle < appendonly.aof | redis-cli --pipe
```
Hooray! Datums!
