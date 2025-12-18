<?php

$redis = new Redis();
// $redis->connect('127.0.0.1', 6379);
$redis->connect('localhost', 6379);
// $redis->set('foo3', 'bar3');
// echo $redis->get('foo');
echo json_encode($redis->keys('*'));

