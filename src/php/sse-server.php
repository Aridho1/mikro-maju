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

$lastMap = [];

while (ob_get_level()) ob_end_flush();
flush();

while (true) {
    if (connection_aborted()) break;

    foreach (glob($folder . '*.json') as $file) {

        clearstatcache(true, $file);
        $mtime = @filemtime($file) ?: 0;
        $hash  = @md5_file($file) ?: null;

        $prev = $lastMap[$file] ?? null;
        $prevData        = $prev['data']     ?? null; // payload full
        $prevOriginal    = $prev['original'] ?? null; // payload original JSON

        // Skip jika tidak berubah
        if ($prev && $prev['mtime'] === $mtime && $prev['hash'] === $hash) {
            continue;
        }

        // Modified tapi hash sama → skip
        if ($prev && $prev['hash'] === $hash) {
            $lastMap[$file]['mtime'] = $mtime;
            continue;
        }

        // Baca file
        $content = @file_get_contents($file);
        if ($content === false) continue;

        $decoded = json_decode($content, true);
        $isJson = json_last_error() === JSON_ERROR_NONE;

        $originalPayload = $isJson ? $decoded : null;
        $payload         = $isJson ? $decoded : ['raw' => $content];

        // Tambahkan __prev_json dan __curr_json (tanpa internal extra)
        if ($isJson) {
            $payload['__curr_json'] = json_encode($originalPayload);
            $payload['__prev_json'] = $prevOriginal ? json_encode($prevOriginal) : null;
        }

        // Skip jika payload sama
        if ($prevData !== null && $prevData == $payload) {
            $lastMap[$file]['mtime'] = $mtime;
            $lastMap[$file]['hash']  = $hash;
            continue;
        }

        // Simpan state (payload full + payload original)
        $lastMap[$file] = [
            'mtime'    => $mtime,
            'hash'     => $hash,
            'data'     => $payload,         // full (untuk guard)
            'original' => $originalPayload, // hanya JSON asli user
        ];

        // Kirim SSE
        $event = preg_replace('/[^a-zA-Z0-9_\-]/', '_', pathinfo($file, PATHINFO_FILENAME));
        $json  = json_encode($payload);

        echo "event: {$event}\n";
        foreach (explode("\n", $json) as $line) {
            echo "data: $line\n";
        }
        echo "\n";

        @ob_flush();
        @flush();
    }

    usleep($pollIntervalUs);
}
