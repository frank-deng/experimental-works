<?php
$ms = microtime(true);
$json = json_decode(file_get_contents('hashNormal.json'), true);
echo sprintf("Parse hashNormal.json: %.3fs\n", (microtime(true) - $ms));

$ms = microtime(true);
$json = json_decode(file_get_contents('hash.json'), true); //PHP Hash Collision 烫烫烫烫烫烫烫烫
echo sprintf("Parse hash.json: %.3fs\n", (microtime(true) - $ms));

