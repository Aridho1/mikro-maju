<?php
// device_fingerprint.php - Sistem Device Fingerprinting + Proxy-Safety Rate Limiter
require_once 'db.php';

// ======================
// CONFIG: trusted proxies
// ======================
$trustedProxies = [
    '127.0.0.1/8',        // localhost
    '10.0.0.0/8',         // private network
    '192.168.0.0/16',     // private network
    // '203.0.113.5',      // contoh IP proxy tunggal
    // '2001:db8::/32',    // contoh IPv6 range
];

$_trustedProxies = $trustedProxies;

// ======================
// HELPER FUNCTIONS
// ======================

function isValidIp(string $ip): bool {
    return filter_var($ip, FILTER_VALIDATE_IP) !== false;
}

function ipInCidr(string $ip, string $cidr): bool {
    if (strpos($cidr, '/') === false) {
        return $ip === $cidr;
    }
    list($subnet, $bits) = explode('/', $cidr, 2);
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) && filter_var($subnet, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4)) {
        $ipDec = ip2long($ip);
        $subnetDec = ip2long($subnet);
        $mask = -1 << (32 - (int)$bits);
        $mask = $mask & 0xFFFFFFFF;
        return (($ipDec & $mask) === ($subnetDec & $mask));
    }
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6) && filter_var($subnet, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6)) {
        $ipBin = inet_pton($ip);
        $subnetBin = inet_pton($subnet);
        if ($ipBin === false || $subnetBin === false) return false;
        $bits = (int)$bits;
        $bytes = (int)floor($bits / 8);
        $remBits = $bits % 8;
        if ($bytes > 0 && strncmp($ipBin, $subnetBin, $bytes) !== 0) return false;
        if ($remBits === 0) return true;
        $maskByte = ((0xFF00 >> $remBits) & 0xFF);
        return (ord($ipBin[$bytes]) & $maskByte) === (ord($subnetBin[$bytes]) & $maskByte);
    }
    return false;
}

function isIpTrusted(string $ip, array $trustedList): bool {
    foreach ($trustedList as $entry) {
        if (ipInCidr($ip, $entry)) return true;
    }
    return false;
}

/**
 * Dapatkan client IP dengan perlindungan proxy
 * - Tolak langsung jika proxy tidak trusted
 * - Gunakan X-Forwarded-For hanya jika REMOTE_ADDR trusted
 */
function getTrustedClientIp(array $trustedProxies): string {
    $remoteAddr = $_SERVER['REMOTE_ADDR'] ?? '';
    $proxyHeadersPresent = !empty($_SERVER['HTTP_X_FORWARDED_FOR']) ||
                           !empty($_SERVER['HTTP_FORWARDED']) ||
                           !empty($_SERVER['HTTP_VIA']);

    if ($proxyHeadersPresent && (!isValidIp($remoteAddr) || !isIpTrusted($remoteAddr, $trustedProxies))) {
        http_response_code(403);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode([
            'error' => 'Access from untrusted reverse proxy is forbidden.',
            'explain' => 'Server detected proxy headers but the connecting IP is not in the trusted proxy list.',
            'how_to_fix' => 'Disable reverse proxy or add the proxy IP to trusted list.'
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }

    if (isIpTrusted($remoteAddr, $trustedProxies) && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $first = trim($parts[0]);
        if (filter_var($first, FILTER_VALIDATE_IP)) {
            return $first;
        }
    }
    return $remoteAddr ?: 'unknown';
}

$_trustedProxies = [
    '127.0.0.1/8',        // localhost
    '10.0.0.0/8',         // private network
    '192.168.0.0/16',     // private network
    // '203.0.113.5',      // contoh IP proxy tunggal
    // '2001:db8::/32',    // contoh IPv6 range
];

// ======================
// CLASS: DeviceFingerprint
// ======================
class DeviceFingerprint {
    private $db;
    private $fingerprint;
    private $trustedProxies;

    public function __construct($database, array|null $trustedProxies=null) {
        global $_trustedProxies; // ambil dari luar

        $this->db = $database;
        $this->trustedProxies = $trustedProxies ?? $_trustedProxies;
    }

    /** Generate device fingerprint */
    public function generateFingerprint() {
        $components = [];

        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $components['user_agent'] = $userAgent;
        $components['accept'] = $_SERVER['HTTP_ACCEPT'] ?? '';
        $components['accept_language'] = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '';
        $components['accept_encoding'] = $_SERVER['HTTP_ACCEPT_ENCODING'] ?? '';

        foreach (['screen_resolution', 'timezone', 'canvas_fingerprint', 'webgl_fingerprint', 'client_id'] as $key) {
            $val = $_POST[$key] ?? $_GET[$key] ?? '';
            if ($val) $components[$key] = $val;
        }

        $ip = $this->getClientIp();
        $components['ip'] = $ip;

        $fingerprintString = implode('|', $components);
        $this->fingerprint = hash('sha256', $fingerprintString);
        return $this->fingerprint;
    }

    /** Wrapper untuk getTrustedClientIp */
    private function getClientIp(): string {
        return getTrustedClientIp($this->trustedProxies);
    }

    /** Simpan fingerprint ke DB */
    public function saveFingerprint($userId = null) {
        $fingerprint = $this->fingerprint ?? $this->generateFingerprint();
        $ip = $this->getClientIp();
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $timestamp = date('Y-m-d H:i:s');

        $stmt = $this->db->prepare("SELECT id FROM device_fingerprints WHERE fingerprint = ?");
        $stmt->bind_param("s", $fingerprint);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();

        if ($result) {
            $update = $this->db->prepare("UPDATE device_fingerprints SET last_seen=?, ip_address=?, user_agent=? WHERE fingerprint=?");
            $update->bind_param("ssss", $timestamp, $ip, $userAgent, $fingerprint);
            $update->execute();
            return $result['id'];
        } else {
            $insert = $this->db->prepare("INSERT INTO device_fingerprints (fingerprint, ip_address, user_agent, user_id, created_at, last_seen) VALUES (?, ?, ?, ?, ?, ?)");
            $insert->bind_param("ssssss", $fingerprint, $ip, $userAgent, $userId, $timestamp, $timestamp);
            $insert->execute();
            return $this->db->insert_id;
        }
    }

    /** Dapatkan Device ID */
    public function getDeviceId() {
        $clientId = $_POST['client_id'] ?? $_GET['client_id'] ?? '';
        if ($clientId && strlen($clientId) >= 16) return $clientId;

        $fingerprint = $this->generateFingerprint();
        $this->saveFingerprint();
        return 'dev_' . substr($fingerprint, 0, 16) . '_' . time();
    }

    /** Rate limit check */
    public function checkRateLimit($deviceId, $maxRequests = 100, $timeWindow = 3600) {
        $currentTime = time();
        $windowStart = $currentTime - $timeWindow;

        $stmt = $this->db->prepare("SELECT COUNT(*) as request_count FROM rate_limit_logs WHERE device_id = ? AND request_time >= ?");
        $stmt->bind_param("si", $deviceId, $windowStart);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_assoc();
        $count = $result['request_count'] ?? 0;

        $ip = $this->getClientIp();
        $this->db->query("INSERT INTO rate_limit_logs (device_id, request_time, ip_address) VALUES ('$deviceId', $currentTime, '$ip')");
        $this->db->query("DELETE FROM rate_limit_logs WHERE request_time < " . ($currentTime - ($timeWindow * 2)));

        return [
            'allowed' => $count < $maxRequests,
            'request_count' => $count + 1,
            'max_requests' => $maxRequests,
            'time_window' => $timeWindow,
            'reset_time' => $windowStart + $timeWindow
        ];
    }
}

// ======================
// API Endpoints
// ======================
if (isset($_GET['action'])) {
    $fingerprint = new DeviceFingerprint($db, $trustedProxies);
    switch ($_GET['action']) {
        case 'get_device_id':
            $deviceId = $fingerprint->getDeviceId();
            echo json_encode(['status' => true, 'device_id' => $deviceId]);
            break;

        case 'check_rate_limit':
            $deviceId = $_POST['device_id'] ?? $_GET['device_id'] ?? '';
            if (empty($deviceId)) {
                echo json_encode(['status' => false, 'message' => 'Device ID required']);
                break;
            }
            $maxRequests = $_POST['max_requests'] ?? $_GET['max_requests'] ?? 100;
            $timeWindow = $_POST['time_window'] ?? $_GET['time_window'] ?? 3600;
            $rate = $fingerprint->checkRateLimit($deviceId, $maxRequests, $timeWindow);
            if (!$rate['allowed']) http_response_code(429);
            echo json_encode(['status' => true, 'rate_limit' => $rate]);
            break;

        default:
            echo json_encode(['status' => false, 'message' => 'Invalid action']);
    }
}
?>
