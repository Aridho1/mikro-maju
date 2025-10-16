<?php
// device_fingerprint.php - Sistem Device Fingerprinting untuk Rate Limiting

require_once 'db.php';

/**
 * Kelas untuk mengelola device fingerprinting
 * Menghasilkan ID yang konsisten untuk user meskipun IP berubah
 */
class DeviceFingerprint {
    private $db;
    private $fingerprint;
    
    public function __construct($database) {
        $this->db = $database;
    }
    
    /**
     * Generate device fingerprint dari berbagai parameter
     * @return string hash fingerprint
     */
    public function generateFingerprint() {
        $components = [];
        
        // 1. User Agent (browser + OS info)
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $components['user_agent'] = $userAgent;
        
        // 2. Accept headers (browser capabilities)
        $accept = $_SERVER['HTTP_ACCEPT'] ?? '';
        $components['accept'] = $accept;
        
        $acceptLanguage = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? '';
        $components['accept_language'] = $acceptLanguage;
        
        $acceptEncoding = $_SERVER['HTTP_ACCEPT_ENCODING'] ?? '';
        $components['accept_encoding'] = $acceptEncoding;
        
        // 3. Screen resolution (jika dikirim dari client)
        $screenResolution = $_POST['screen_resolution'] ?? $_GET['screen_resolution'] ?? '';
        if ($screenResolution) {
            $components['screen_resolution'] = $screenResolution;
        }
        
        // 4. Timezone (jika dikirim dari client)
        $timezone = $_POST['timezone'] ?? $_GET['timezone'] ?? '';
        if ($timezone) {
            $components['timezone'] = $timezone;
        }
        
        // 5. Canvas fingerprint (jika dikirim dari client)
        $canvasFingerprint = $_POST['canvas_fingerprint'] ?? $_GET['canvas_fingerprint'] ?? '';
        if ($canvasFingerprint) {
            $components['canvas_fingerprint'] = $canvasFingerprint;
        }
        
        // 6. WebGL fingerprint (jika dikirim dari client)
        $webglFingerprint = $_POST['webgl_fingerprint'] ?? $_GET['webgl_fingerprint'] ?? '';
        if ($webglFingerprint) {
            $components['webgl_fingerprint'] = $webglFingerprint;
        }
        
        // 7. Client ID dari localStorage (jika ada)
        $clientId = $_POST['client_id'] ?? $_GET['client_id'] ?? '';
        if ($clientId) {
            $components['client_id'] = $clientId;
        }
        
        // 8. IP address (untuk fallback, tapi tidak terlalu bergantung padanya)
        $ip = $this->getClientIp();
        $components['ip'] = $ip;
        
        // Generate hash dari semua komponen
        $fingerprintString = implode('|', $components);
        $this->fingerprint = hash('sha256', $fingerprintString);
        
        return $this->fingerprint;
    }
    
    /**
     * Dapatkan client IP dengan aman
     */
    private function getClientIp() {
        // Cek header proxy jika ada
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ips = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
            $ip = trim($ips[0]);
            if (filter_var($ip, FILTER_VALIDATE_IP)) {
                return $ip;
            }
        }
        
        // Fallback ke REMOTE_ADDR
        return $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    }
    
    /**
     * Simpan fingerprint ke database untuk tracking
     */
    public function saveFingerprint($userId = null) {
        $fingerprint = $this->fingerprint;
        $ip = $this->getClientIp();
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $timestamp = date('Y-m-d H:i:s');
        
        // Cek apakah fingerprint sudah ada
        $existing = $this->db->query("SELECT id FROM device_fingerprints WHERE fingerprint = '$fingerprint'")->fetch_assoc();
        
        if ($existing) {
            // Update last seen
            $this->db->query("UPDATE device_fingerprints SET 
                last_seen = '$timestamp', 
                ip_address = '$ip',
                user_agent = '$userAgent'
                WHERE fingerprint = '$fingerprint'");
            return $existing['id'];
        } else {
            // Insert baru
            $this->db->query("INSERT INTO device_fingerprints 
                (fingerprint, ip_address, user_agent, user_id, created_at, last_seen) 
                VALUES ('$fingerprint', '$ip', '$userAgent', " . ($userId ? "'$userId'" : 'NULL') . ", '$timestamp', '$timestamp')");
            
            return $this->db->insert_id;
        }
    }
    
    /**
     * Dapatkan device ID yang konsisten
     * Jika ada client_id dari localStorage, gunakan itu
     * Jika tidak, generate dan simpan fingerprint baru
     */
    public function getDeviceId() {
        $clientId = $_POST['client_id'] ?? $_GET['client_id'] ?? '';
        
        if ($clientId && strlen($clientId) >= 16) {
            // Gunakan client_id yang sudah ada
            return $clientId;
        }
        
        // Generate fingerprint baru
        $fingerprint = $this->generateFingerprint();
        $deviceId = $this->saveFingerprint();
        
        // Generate client_id yang user-friendly
        $clientId = 'dev_' . substr($fingerprint, 0, 16) . '_' . time();
        
        return $clientId;
    }
    
    /**
     * Rate limiting berdasarkan device ID
     */
    public function checkRateLimit($deviceId, $maxRequests = 100, $timeWindow = 3600) {
        $currentTime = time();
        $windowStart = $currentTime - $timeWindow;
        
        // Hitung request dalam time window
        $result = $this->db->query("SELECT COUNT(*) as request_count 
            FROM rate_limit_logs 
            WHERE device_id = '$deviceId' 
            AND request_time >= $windowStart")->fetch_assoc();
        
        $requestCount = $result['request_count'] ?? 0;
        
        // Log request ini
        $this->db->query("INSERT INTO rate_limit_logs (device_id, request_time, ip_address) 
            VALUES ('$deviceId', $currentTime, '" . $this->getClientIp() . "')");
        
        // Cleanup old logs (optional, untuk performa)
        $this->db->query("DELETE FROM rate_limit_logs WHERE request_time < " . ($currentTime - ($timeWindow * 2)));
        
        return [
            'allowed' => $requestCount < $maxRequests,
            'request_count' => $requestCount + 1,
            'max_requests' => $maxRequests,
            'time_window' => $timeWindow,
            'reset_time' => $windowStart + $timeWindow
        ];
    }
}

// API endpoint untuk mendapatkan device ID
if (isset($_GET['action'])) {
    $fingerprint = new DeviceFingerprint($db);
    
    switch ($_GET['action']) {
        case 'get_device_id':
            $deviceId = $fingerprint->getDeviceId();
            echo json_encode([
                'status' => true,
                'device_id' => $deviceId,
                'message' => 'Device ID generated successfully'
            ]);
            break;
            
        case 'check_rate_limit':
            $deviceId = $_POST['device_id'] ?? $_GET['device_id'] ?? '';
            if (empty($deviceId)) {
                echo json_encode(['status' => false, 'message' => 'Device ID required']);
                break;
            }
            
            $maxRequests = $_POST['max_requests'] ?? $_GET['max_requests'] ?? 100;
            $timeWindow = $_POST['time_window'] ?? $_GET['time_window'] ?? 3600;
            
            $rateLimit = $fingerprint->checkRateLimit($deviceId, $maxRequests, $timeWindow);
            
            if (!$rateLimit['allowed']) {
                http_response_code(429); // Too Many Requests
            }
            
            echo json_encode([
                'status' => true,
                'rate_limit' => $rateLimit
            ]);
            break;
            
        default:
            echo json_encode(['status' => false, 'message' => 'Invalid action']);
    }
}
?>
