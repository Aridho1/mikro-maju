<?php
set_time_limit(0);
ignore_user_abort(true);

header("Content-Type: text/event-stream");
header("Cache-Control: no-cache");
header("Connection: keep-alive");
header("X-Accel-Buffering: no");

$folder = __DIR__ . '/../../sse/';
$pollIntervalUs = 300000;

if (!is_dir($folder)) @mkdir($folder, 0755, true);

$state = [];
$files = glob($folder . '*.json');

while (ob_get_level()) ob_end_flush();
flush();

while (true) {
    if (connection_aborted()) break;

    // refresh file list jika ada perubahan jumlah file
    $currentFiles = glob($folder . '*.json');
    if (count($currentFiles) !== count($files)) {
        $files = $currentFiles;
    }

    foreach ($files as $file) {
        clearstatcache(true, $file);

        $mtime = filemtime($file) ?: 0;
        $prev  = $state[$file] ?? null;

        // mtime sama → skip langsung (efisiensi)
        if ($prev && $prev['mtime'] === $mtime) continue;

        // hitung hash hanya jika mtime berubah
        $hash = md5_file($file);
        if ($prev && $prev['hash'] === $hash) {
            // mtime berubah tapi hash sama → skip
            $state[$file]['mtime'] = $mtime;
            continue;
        }

        // baca file
        $raw = file_get_contents($file);
        if ($raw === false) continue;

        // decode JSON
        $decoded = json_decode($raw, true);
        $payload = (json_last_error() === JSON_ERROR_NONE)
            ? $decoded
            : ['raw' => $raw];

        // payload sama → skip
        if ($prev && $prev['payload'] == $payload) {
            $state[$file]['mtime'] = $mtime;
            $state[$file]['hash']  = $hash;
            continue;
        }

        // update state
        $state[$file] = [
            'mtime'   => $mtime,
            'hash'    => $hash,
            'payload' => $payload
        ];

        // kirim SSE
        $event = preg_replace('/[^a-zA-Z0-9_\-]/', '_', pathinfo($file, PATHINFO_FILENAME));
        $json  = json_encode($payload);

        echo "event: {$event}\n";
        foreach (explode("\n", $json) as $line) {
            echo "data: $line\n";
        }
        echo "\n\n";

        flush();
    }

    usleep($pollIntervalUs);
}
