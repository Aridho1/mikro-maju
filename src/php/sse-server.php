<?php
// sse-multi.php
// Long-running SSE that watches every .json file in /sse
set_time_limit(0);
ignore_user_abort(true);

header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");
header("X-Accel-Buffering: no"); // for nginx

$folder = __DIR__ . '/../../sse/';
$pollIntervalUs = 300000; // 0.3s

// create folder if not exists
if (!is_dir($folder)) @mkdir($folder, 0755, true);

// prepare last mtime map
$lastMap = [];

// ensure output buffering disabled
while (ob_get_level() > 0) ob_end_flush();
flush();

// main loop
while (true) {
    // break if client disconnected
    if (connection_aborted()) break;

    // get list of json files
    $files = glob($folder . '*.json');

    foreach ($files as $file) {
        clearstatcache(true, $file);
        $mtime = @filemtime($file) ?: 0;

        // if new file not seen before, add it to map (but don't emit if last_event=0)
        $basename = basename($file); // e.g. order.json
        $name = pathinfo($basename, PATHINFO_FILENAME); // e.g. order

        $prev = isset($lastMap[$file]) ? $lastMap[$file] : 0;

        if ($mtime > $prev[0]) {
            $lastMap[$file] = $mtime;
            $lastMap[$file] = [$mtime];

            $content = @file_get_contents($file);
            if ($content === false) continue;

            // normalize content: prefer to send JSON object
            $payload = null;
            $decoded = json_decode($content, true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $payload = $decoded;
            } else {
                // fallback: send raw string
                $payload = ['raw' => $content];
            }

            // check same value
            if ($prev[1] == $payload) continue;

            $lastMap[$file][] = $payload;

            // SSE requires "event:" and "data:" then blank line
            // event name: use $name (safe characters)
            $safeEvent = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $name);

            // data must not contain raw newlines without prefix, so json_encode and prefix
            $dataLine = json_encode($payload);

            echo "event: {$safeEvent}\n";
            // split json into lines prefixed `data: `
            $lines = explode("\n", $dataLine);
            foreach ($lines as $line) {
                echo "data: {$line}\n";
            }
            echo "\n";

            @ob_flush();
            @flush();
        }
    }

    // Sleep to avoid busy loop
    usleep($pollIntervalUs);
}
