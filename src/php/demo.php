<?php
date_default_timezone_set('America/Los_Angeles');
session_start();
include("./ratelimiter.php");

// in this sample, we are using the originating IP, but you can modify to use API keys, or tokens or what-have-you.
$rateLimiter = new RateLimiter($_SERVER["REMOTE_ADDR"]);

$limit = 100;				//	number of connections to limit user to per $minutes
$minutes = 1;				//	number of $minutes to check for.
$seconds = floor($minutes * 60);	//	retry after $minutes in seconds.

try {
	$rateLimiter->limitRequestsInMinutes($limit, $minutes);
} catch (RateExceededException $e) {
	header("HTTP/1.1 429 Too Many Requests");
	header(sprintf("Retry-After: %d", $seconds));
	$data = 'Rate Limit Exceeded ';
	die (json_encode($data));
}

// ok, they were within their limit, so let's continue with our app....
$data = "Data Returned from API ";
header('Content-Type: application/json');
die(json_encode($data)); 
