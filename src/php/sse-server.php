<?php
// sse-multi.php — FINAL VERSION
// Long-running SSE watcher for all *.json files in /sse

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

$lastMap = []; // store: mtime, hash, data

while (ob_get_level() > 0) ob_end_flush();
flush();

// main loop
while (true) {
    if (connection_aborted()) break;

    $files = glob($folder . '*.json');

    foreach ($files as $file) {
        clearstatcache(true, $file);

        $mtime = @filemtime($file) ?: 0;
        $hash  = is_file($file) ? @md5_file($file) : null;

        $basename = basename($file);
        $name = pathinfo($basename, PATHINFO_FILENAME);

        $prev = $lastMap[$file] ?? null;
        $prevMtime = $prev['mtime'] ?? 0;
        $prevHash  = $prev['hash'] ?? null;

        // Nothing changed at all
        if ($mtime === $prevMtime && $hash === $prevHash) {
            continue;
        }

        // File modified but hash same → skip duplicates
        if ($prevHash !== null && $hash === $prevHash) {
            // only update mtime (so next scans stay correct)
            $lastMap[$file]['mtime'] = $mtime;
            continue;
        }

        // Load file content safely
        $content = @file_get_contents($file);
        if ($content === false) continue;

        $decoded = json_decode($content, true);
        $payload = json_last_error() === JSON_ERROR_NONE
            ? $decoded
            : ['raw' => $content];

        // previous payload check (extra guard)
        $prevPayload = $prev['data'] ?? null;
        if ($prevPayload !== null && $prevPayload == $payload) {
            // payload same → skip
            $lastMap[$file]['mtime'] = $mtime;
            $lastMap[$file]['hash']  = $hash;
            continue;
        }

        // Update memory
        $lastMap[$file] = [
            'mtime' => $mtime,
            'hash'  => $hash,
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

    usleep($pollIntervalUs);
}
