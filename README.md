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

The opposite can also be achieved by using the reverse binary (`rwaoffle`) also provided in this module.

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

The reverse process—going from sets of operations to AOF format—can be achieved in the same manner by substituting calls to `waoffle` for `rwaoffle`.

# Importing data into Redis
This is useful for importing data directly into a running Redis instance. Simply use the `rwaoffle` command if you are starting with a file full of operations. Even though Redis can already read its own AOF file format, this set of tools is even more powerful for filtering your AOF files:
``` bash
$ waoffle < appendonly.aof | grep SET | rwaoffle    # Only grab `SET` operations
```
Use this in combination with `redis-cli --pipe` for maximum win:
``` bash
$ cat appendonly.aof | redis-cli --pipe             # Standard Redis import
$ cat commands.txt | rwaoffle | redis-cli --pipe    # Importing a list of commands
$ cat appendonly.aof | waoffle | grep SET \
      | rwaoffle | redis-cli --pipe                 # Import only `SET` operations
```
