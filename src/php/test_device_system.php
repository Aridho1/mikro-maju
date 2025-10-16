<?php
// test_device_system.php - Script untuk testing device fingerprinting system

require_once 'db.php';
require_once 'device_fingerprint.php';
require_once 'rate_limiter.php';

echo "<h1>Device Fingerprinting System Test</h1>";

// Test 1: Database Connection
echo "<h2>Test 1: Database Connection</h2>";
try {
    $db->query("SELECT 1");
    echo "✅ Database connection successful<br>";
} catch (Exception $e) {
    echo "❌ Database connection failed: " . $e->getMessage() . "<br>";
    exit;
}

// Test 2: Check Required Tables
echo "<h2>Test 2: Required Tables</h2>";
$requiredTables = ['device_fingerprints', 'rate_limit_logs', 'rate_limit_config'];

foreach ($requiredTables as $table) {
    $result = $db->query("SHOW TABLES LIKE '$table'");
    if ($result && $result->num_rows > 0) {
        echo "✅ Table '$table' exists<br>";
    } else {
        echo "❌ Table '$table' missing<br>";
        echo "<em>Run setup_device_tables.sql to create required tables</em><br>";
    }
}

// Test 3: Device Fingerprint Generation
echo "<h2>Test 3: Device Fingerprint Generation</h2>";
try {
    $fingerprint = new DeviceFingerprint($db);
    $deviceId = $fingerprint->getDeviceId();
    echo "✅ Device ID generated: " . substr($deviceId, 0, 20) . "...<br>";
} catch (Exception $e) {
    echo "❌ Device fingerprint generation failed: " . $e->getMessage() . "<br>";
}

// Test 4: Rate Limiting
echo "<h2>Test 4: Rate Limiting</h2>";
try {
    $rateLimiter = new RateLimiter($db);
    $rateLimit = $rateLimiter->checkLimit('test', 5, 60); // 5 requests per minute
    
    echo "✅ Rate limit check successful<br>";
    echo "Allowed: " . ($rateLimit['allowed'] ? 'Yes' : 'No') . "<br>";
    echo "Request Count: " . $rateLimit['request_count'] . "/" . $rateLimit['max_requests'] . "<br>";
} catch (Exception $e) {
    echo "❌ Rate limiting failed: " . $e->getMessage() . "<br>";
}

// Test 5: Helper Functions
echo "<h2>Test 5: Helper Functions</h2>";
try {
    $deviceId = getDeviceId();
    echo "✅ getDeviceId() works: " . substr($deviceId, 0, 20) . "...<br>";
    
    $rateLimit = checkRateLimit('helper_test', 10, 300, false);
    echo "✅ checkRateLimit() works<br>";
    echo "Allowed: " . ($rateLimit['allowed'] ? 'Yes' : 'No') . "<br>";
} catch (Exception $e) {
    echo "❌ Helper functions failed: " . $e->getMessage() . "<br>";
}

// Test 6: Database Data
echo "<h2>Test 6: Database Data</h2>";

// Count device fingerprints
$result = $db->query("SELECT COUNT(*) as count FROM device_fingerprints");
$count = $result->fetch_assoc()['count'];
echo "Device fingerprints in database: $count<br>";

// Count rate limit logs
$result = $db->query("SELECT COUNT(*) as count FROM rate_limit_logs");
$count = $result->fetch_assoc()['count'];
echo "Rate limit logs in database: $count<br>";

// Recent fingerprints
$result = $db->query("SELECT fingerprint, ip_address, created_at FROM device_fingerprints ORDER BY created_at DESC LIMIT 3");
echo "<h3>Recent Device Fingerprints:</h3>";
echo "<table border='1' cellpadding='5'>";
echo "<tr><th>Fingerprint</th><th>IP Address</th><th>Created</th></tr>";
while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>" . substr($row['fingerprint'], 0, 20) . "...</td>";
    echo "<td>" . $row['ip_address'] . "</td>";
    echo "<td>" . $row['created_at'] . "</td>";
    echo "</tr>";
}
echo "</table>";

// Test 7: Performance Test
echo "<h2>Test 7: Performance Test</h2>";
$startTime = microtime(true);

for ($i = 0; $i < 10; $i++) {
    $rateLimit = checkRateLimit('perf_test', 1000, 3600, false);
}

$endTime = microtime(true);
$duration = ($endTime - $startTime) * 1000; // Convert to milliseconds

echo "✅ 10 rate limit checks completed in " . round($duration, 2) . " ms<br>";
echo "Average per check: " . round($duration / 10, 2) . " ms<br>";

// Test 8: Configuration
echo "<h2>Test 8: Rate Limit Configuration</h2>";
$result = $db->query("SELECT * FROM rate_limit_config");
echo "<table border='1' cellpadding='5'>";
echo "<tr><th>Endpoint</th><th>Max Requests</th><th>Time Window</th><th>Active</th></tr>";
while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>" . $row['endpoint'] . "</td>";
    echo "<td>" . $row['max_requests'] . "</td>";
    echo "<td>" . $row['time_window'] . "s</td>";
    echo "<td>" . ($row['is_active'] ? 'Yes' : 'No') . "</td>";
    echo "</tr>";
}
echo "</table>";

// Test 9: JavaScript Integration Test
echo "<h2>Test 9: JavaScript Integration</h2>";
echo "<p>Open browser console and run:</p>";
echo "<pre>";
echo "fetch('./src/php/device_fingerprint.php?action=get_device_id', {method: 'POST'})\n";
echo ".then(r => r.json())\n";
echo ".then(data => console.log('Device ID:', data));\n";
echo "</pre>";

echo "<p>Or test with the HTML interface:</p>";
echo "<p><a href='../test_device_fingerprint.html' target='_blank'>Open Test Interface</a></p>";

// Test 10: Cleanup Test
echo "<h2>Test 10: Cleanup Test</h2>";
try {
    // Test cleanup old data
    $db->query("DELETE FROM rate_limit_logs WHERE request_time < " . (time() - 86400)); // Delete logs older than 1 day
    echo "✅ Cleanup test successful<br>";
} catch (Exception $e) {
    echo "❌ Cleanup test failed: " . $e->getMessage() . "<br>";
}

echo "<hr>";
echo "<h2>Summary</h2>";
echo "<p>✅ = Test passed</p>";
echo "<p>❌ = Test failed</p>";
echo "<p>If any tests failed, check the error messages and ensure:</p>";
echo "<ul>";
echo "<li>Database tables are created (run setup_device_tables.sql)</li>";
echo "<li>Database connection is working</li>";
echo "<li>PHP files are properly included</li>";
echo "<li>File permissions are correct</li>";
echo "</ul>";

echo "<p><strong>Next Steps:</strong></p>";
echo "<ol>";
echo "<li>Test the HTML interface: <a href='../test_device_fingerprint.html'>test_device_fingerprint.html</a></li>";
echo "<li>Integrate with your existing endpoints using the examples in example_usage.php</li>";
echo "<li>Monitor the system using the database queries in the guide</li>";
echo "</ol>";
?>
