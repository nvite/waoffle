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
