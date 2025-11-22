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

        $basename = basename($file);
        $name = pathinfo($basename, PATHINFO_FILENAME);

        $prevMtime = $lastMap[$file]['mtime'] ?? 0;

        // file modified?
        if ($mtime > $prevMtime) {

            $content = @file_get_contents($file);
            if ($content === false) continue;

            $decoded = json_decode($content, true);
            $payload = json_last_error() === JSON_ERROR_NONE
                ? $decoded
                : ['raw' => $content];

            // compare payload with previous payload
            $prevPayload = $lastMap[$file]['data'] ?? null;

            if ($prevPayload !== null && $prevPayload == $payload) {
                // same content → skip
                $lastMap[$file]['mtime'] = $mtime; // still update mtime
                continue;
            }

            // update lastMap
            $lastMap[$file] = [
                'mtime' => $mtime,
                'data'  => $payload,
            ];

            // SEND SSE
            $safeEvent = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $name);
            $dataLine = json_encode($payload);

            echo "event: {$safeEvent}\n";

            foreach (explode("\n", $dataLine) as $line) {
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
