<?php

$redis = new Redis();

$redis->connect("tls://stirring-jaguar-5626.upstash.io", 6379);
$redis->auth("********");

$redis->set("foo", "bar");

print_r($redis->get("foo"));
echo json_encode([], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);