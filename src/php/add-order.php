<?php
// add-order.php
// Accepts FormData OR JSON.
// Writes to SSE files quickly.

// die("DUARRRR");

error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Content-Type: application/json");

// -------------------------------
// Resolve input (FormData first)
// -------------------------------
$data = [];

// 1) Multipart FormData → $_POST
if (!empty($_POST)) {
    $data['amount'] = $_POST['amount'] ?? null;
    $data['note']   = $_POST['note'] ?? '';
}
// 2) JSON body fallback
else {
    $raw = file_get_contents('php://input');

    if (!empty($raw)) {
        $json = json_decode($raw, true);
        if (json_last_error() === JSON_ERROR_NONE && is_array($json)) {
            $data = $json;
        }
    }
}

// -------------------------------
// Validate
// -------------------------------
if (empty($data['amount'])) {
    http_response_code(400);
    echo json_encode([
        'status' => 'error',
        'message' => 'amount required'
    ]);
    exit;
}

// Normalize
$data['note'] = $data['note'] ?? '';

// -------------------------------
// Build item
// -------------------------------
$item = [
    'id'         => time() . rand(100,999),
    'amount'     => (float)$data['amount'],
    'note'       => (string)$data['note'],
    'created_at' => date('Y-m-d H:i:s'),
];

// -------------------------------
// Prepare folder
// -------------------------------
$folder = __DIR__ . '/../../sse/';
if (!is_dir($folder)) mkdir($folder, 0755, true);

// die("DUARRRRaaa");

// -------------------------------
// Write history
// -------------------------------
$txFile = $folder . 'transaction_history.json';
$txs = [];

if (file_exists($txFile)) {
    $txs = json_decode(file_get_contents($txFile), true) ?: [];
}

$txs[] = $item;

file_put_contents(
    $txFile,
    json_encode($txs, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
);

// -------------------------------
// Write SSE main event
// -------------------------------
$eventFile = $folder . 'order.json';
$eventObj = [
    'last_event' => time(),
    'payload'    => $item
];

file_put_contents(
    $eventFile,
    json_encode($eventObj, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
);

// -------------------------------
// Return response
// -------------------------------
echo json_encode([
    'status' => 'ok',
    'item'   => $item
]);
