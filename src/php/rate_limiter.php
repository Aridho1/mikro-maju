<?php
// rate_limiter.php - Wrapper untuk rate limiting yang mudah digunakan

require_once 'device_fingerprint.php';

/**
 * Kelas RateLimiter untuk memudahkan implementasi rate limiting
 */
class RateLimiter {
    private $deviceFingerprint;
    private $defaultMaxRequests;
    private $defaultTimeWindow;
    
    public function __construct($database, $defaultMaxRequests = 100, $defaultTimeWindow = 3600) {
        $this->deviceFingerprint = new DeviceFingerprint($database);
        $this->defaultMaxRequests = $defaultMaxRequests;
        $this->defaultTimeWindow = $defaultTimeWindow;
    }
    
    /**
     * Cek rate limit untuk endpoint tertentu
     * @param string $endpoint Nama endpoint (untuk konfigurasi khusus)
     * @param int|null $maxRequests Maksimal request (optional, akan gunakan default jika null)
     * @param int|null $timeWindow Time window dalam detik (optional, akan gunakan default jika null)
     * @return array Hasil rate limiting check
     */
    public function checkLimit($endpoint = '*', $maxRequests = null, $timeWindow = null) {
        $maxRequests = $maxRequests ?? $this->defaultMaxRequests;
        $timeWindow = $timeWindow ?? $this->defaultTimeWindow;
        
        // Dapatkan device ID
        $deviceId = $this->deviceFingerprint->getDeviceId();
        
        // Cek rate limit
        $result = $this->deviceFingerprint->checkRateLimit($deviceId, $maxRequests, $timeWindow);
        
        // Tambahkan informasi endpoint
        $result['endpoint'] = $endpoint;
        $result['device_id'] = $deviceId;
        
        return $result;
    }
    
    /**
     * Cek rate limit dan return response jika melebihi limit
     * @param string $endpoint
     * @param int|null $maxRequests
     * @param int|null $timeWindow
     * @param bool $autoResponse Jika true, akan otomatis return response jika limit exceeded
     * @return array|false False jika limit exceeded dan autoResponse true, array hasil jika tidak
     */
    public function enforceLimit($endpoint = '*', $maxRequests = null, $timeWindow = null, $autoResponse = true) {
        $result = $this->checkLimit($endpoint, $maxRequests, $timeWindow);
        
        if (!$result['allowed'] && $autoResponse) {
            $this->sendRateLimitResponse($result);
            return false;
        }
        
        return $result;
    }
    
    /**
     * Kirim response rate limit exceeded
     */
    private function sendRateLimitResponse($rateLimitData) {
        http_response_code(429); // Too Many Requests
        
        header('Content-Type: application/json; charset=utf-8');
        header('Retry-After: ' . ($rateLimitData['reset_time'] - time()));
        
        $response = [
            'error' => 'Rate limit exceeded',
            'message' => 'Too many requests. Please try again later.',
            'rate_limit' => $rateLimitData,
            'retry_after' => $rateLimitData['reset_time'] - time()
        ];
        
        echo json_encode($response, JSON_PRETTY_PRINT);
        exit;
    }
    
    /**
     * Dapatkan informasi device ID untuk penggunaan lain
     */
    public function getDeviceId() {
        return $this->deviceFingerprint->getDeviceId();
    }
    
    /**
     * Cek rate limit khusus untuk login (lebih ketat)
     */
    public function checkLoginLimit() {
        return $this->checkLimit('login', 5, 900); // 5 attempts per 15 minutes
    }
    
    /**
     * Cek rate limit untuk API endpoints
     */
    public function checkApiLimit() {
        return $this->checkLimit('api', 100, 3600); // 100 requests per hour
    }
    
    /**
     * Cek rate limit untuk dashboard
     */
    public function checkDashboardLimit() {
        return $this->checkLimit('dashboard', 200, 3600); // 200 requests per hour
    }
}

/**
 * Fungsi helper untuk rate limiting yang mudah digunakan
 */
function checkRateLimit($endpoint = '*', $maxRequests = 100, $timeWindow = 3600, $autoResponse = true) {
    global $db;
    
    $rateLimiter = new RateLimiter($db);
    return $rateLimiter->enforceLimit($endpoint, $maxRequests, $timeWindow, $autoResponse);
}

/**
 * Fungsi khusus untuk login rate limiting
 */
function checkLoginRateLimit($autoResponse = true) {
    global $db;
    
    $rateLimiter = new RateLimiter($db);
    $result = $rateLimiter->checkLoginLimit();
    
    if (!$result['allowed'] && $autoResponse) {
        http_response_code(429);
        header('Content-Type: application/json; charset=utf-8');
        header('Retry-After: ' . ($result['reset_time'] - time()));
        
        echo json_encode([
            'status' => false,
            'msg' => 'Terlalu banyak percobaan login. Coba lagi dalam ' . ($result['reset_time'] - time()) . ' detik.',
            'rate_limit' => $result
        ]);
        exit;
    }
    
    return $result;
}

/**
 * Fungsi untuk mendapatkan device ID
 */
function getDeviceId() {
    global $db;
    
    $rateLimiter = new RateLimiter($db);
    return $rateLimiter->getDeviceId();
}

// Contoh penggunaan:
// 
// // Di awal file PHP endpoint:
// require_once 'rate_limiter.php';
// 
// // Cek rate limit untuk endpoint ini
// $rateLimit = checkRateLimit('login', 10, 600); // 10 requests per 10 minutes
// 
// // Atau untuk login khusus:
// checkLoginRateLimit(); // Otomatis return response jika limit exceeded
// 
// // Atau manual check:
// $rateLimit = checkRateLimit('api', 100, 3600, false);
// if (!$rateLimit['allowed']) {
//     // Handle rate limit exceeded
//     echo json_encode(['error' => 'Rate limit exceeded']);
//     exit;
// }
?>
