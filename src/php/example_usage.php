<?php
// example_usage.php - Contoh penggunaan device fingerprinting dan rate limiting

require_once 'db.php';
require_once 'rate_limiter.php';

// Contoh 1: Rate limiting untuk endpoint API
function handleApiRequest() {
    // Cek rate limit untuk API (100 requests per hour)
    $rateLimit = checkRateLimit('api', 100, 3600);
    
    if (!$rateLimit['allowed']) {
        // Response sudah otomatis dikirim oleh checkRateLimit
        return;
    }
    
    // Log rate limit info
    error_log("API request - Device: {$rateLimit['device_id']}, Count: {$rateLimit['request_count']}");
    
    // Proses request normal
    echo json_encode([
        'status' => true,
        'data' => 'API response data',
        'rate_limit' => $rateLimit
    ]);
}

// Contoh 2: Rate limiting untuk dashboard
function handleDashboardRequest() {
    // Cek rate limit untuk dashboard (200 requests per hour)
    $rateLimit = checkRateLimit('dashboard', 200, 3600);
    
    if (!$rateLimit['allowed']) {
        return;
    }
    
    echo json_encode([
        'status' => true,
        'dashboard_data' => 'Some dashboard data',
        'rate_limit' => $rateLimit
    ]);
}

// Contoh 3: Rate limiting manual (tanpa auto response)
function handleCustomRequest() {
    $rateLimit = checkRateLimit('custom', 50, 1800, false); // 50 requests per 30 minutes, manual handling
    
    if (!$rateLimit['allowed']) {
        // Handle rate limit exceeded secara manual
        http_response_code(429);
        echo json_encode([
            'status' => false,
            'error' => 'Custom rate limit exceeded',
            'retry_after' => $rateLimit['reset_time'] - time(),
            'rate_limit' => $rateLimit
        ]);
        return;
    }
    
    echo json_encode([
        'status' => true,
        'message' => 'Request processed',
        'rate_limit' => $rateLimit
    ]);
}

// Contoh 4: Dapatkan device ID untuk tracking
function getDeviceInfo() {
    $deviceId = getDeviceId();
    
    echo json_encode([
        'status' => true,
        'device_id' => $deviceId,
        'message' => 'Device ID retrieved successfully'
    ]);
}

// Contoh 5: Integrasi dengan sistem yang sudah ada
function integrateWithExistingSystem() {
    // Contoh: Rate limiting untuk endpoint products
    $rateLimit = checkRateLimit('products', 150, 3600);
    
    if (!$rateLimit['allowed']) {
        return;
    }
    
    // Lanjutkan dengan logic yang sudah ada
    // ... existing code ...
    
    echo json_encode([
        'status' => true,
        'products' => 'Product data',
        'device_id' => $rateLimit['device_id'],
        'rate_limit' => $rateLimit
    ]);
}

// Handle request berdasarkan action
$action = $_GET['action'] ?? $_POST['action'] ?? '';

switch ($action) {
    case 'api':
        handleApiRequest();
        break;
        
    case 'dashboard':
        handleDashboardRequest();
        break;
        
    case 'custom':
        handleCustomRequest();
        break;
        
    case 'device_info':
        getDeviceInfo();
        break;
        
    case 'products':
        integrateWithExistingSystem();
        break;
        
    default:
        echo json_encode([
            'status' => false,
            'message' => 'Invalid action',
            'available_actions' => ['api', 'dashboard', 'custom', 'device_info', 'products']
        ]);
}

// Contoh penggunaan di file PHP yang sudah ada:
/*
// Di awal file PHP endpoint (misalnya products.php):
require_once 'rate_limiter.php';

// Di dalam switch case atau function:
case "add": {
    // Cek rate limit untuk add product
    $rateLimit = checkRateLimit('products_add', 20, 3600); // 20 requests per hour
    
    if (!$rateLimit['allowed']) {
        return; // Response otomatis dikirim
    }
    
    // Lanjutkan dengan logic add product
    // ... existing code ...
}

case "search": {
    // Cek rate limit untuk search
    $rateLimit = checkRateLimit('products_search', 100, 3600); // 100 requests per hour
    
    if (!$rateLimit['allowed']) {
        return;
    }
    
    // Lanjutkan dengan logic search
    // ... existing code ...
}
*/
?>
