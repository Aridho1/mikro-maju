# Device Fingerprinting & Rate Limiting Guide

## Overview

Sistem ini menyediakan solusi untuk mendapatkan ID user yang konsisten untuk rate limiting tanpa perlu login. Berbeda dengan menggunakan IP address yang berubah ketika user berpindah jaringan, sistem ini menggunakan device fingerprinting yang lebih stabil.

## Masalah yang Diselesaikan

- **IP Address tidak konsisten**: IP berubah ketika user berpindah dari WiFi ke mobile data
- **Rate limiting tidak efektif**: User bisa bypass dengan ganti jaringan
- **Tidak perlu login**: Sistem bekerja untuk user anonymous

## Komponen Sistem

### 1. Backend PHP Files

#### `device_fingerprint.php`
- Kelas utama untuk device fingerprinting
- Mengumpulkan informasi browser dan device
- Menghasilkan hash fingerprint yang konsisten
- Menyimpan data ke database

#### `rate_limiter.php`
- Wrapper untuk implementasi rate limiting yang mudah
- Fungsi helper untuk berbagai jenis endpoint
- Auto-response untuk rate limit exceeded

#### `setup_device_tables.sql`
- Skrip SQL untuk membuat tabel database
- Tabel untuk device fingerprints, rate limit logs, dan konfigurasi

### 2. Frontend JavaScript

#### `deviceFingerprint.js`
- Client-side fingerprinting
- Mengumpulkan informasi browser, screen, canvas, WebGL
- Komunikasi dengan backend PHP
- Auto-initialization

### 3. Test Files

#### `test_device_fingerprint.html`
- Interface untuk testing sistem
- Demo berbagai jenis rate limiting
- Monitoring hasil test

#### `example_usage.php`
- Contoh implementasi di berbagai skenario
- Panduan integrasi dengan sistem existing

## Instalasi

### 1. Setup Database

```sql
-- Jalankan script SQL
mysql -u username -p database_name < src/php/setup_device_tables.sql
```

### 2. Include Files

```php
// Di file PHP endpoint yang ingin di-rate-limit
require_once 'rate_limiter.php';
```

### 3. Include JavaScript

```html
<!-- Di HTML page -->
<script src="./src/js/deviceFingerprint.js"></script>
```

## Penggunaan

### 1. Rate Limiting Sederhana

```php
// Cek rate limit (auto response jika exceeded)
checkRateLimit('api', 100, 3600); // 100 requests per hour

// Lanjutkan dengan logic normal
echo json_encode(['status' => true, 'data' => 'response']);
```

### 2. Rate Limiting Manual

```php
// Manual handling
$rateLimit = checkRateLimit('api', 100, 3600, false);

if (!$rateLimit['allowed']) {
    // Handle secara manual
    echo json_encode(['error' => 'Rate limit exceeded']);
    exit;
}

// Lanjutkan processing
```

### 3. Rate Limiting Khusus Login

```php
// Otomatis 5 attempts per 15 minutes
checkLoginRateLimit();
```

### 4. Dapatkan Device ID

```php
$deviceId = getDeviceId();
echo json_encode(['device_id' => $deviceId]);
```

### 5. Client-side Usage

```javascript
// Auto-initialize (sudah otomatis)
await window.deviceFingerprint.init();

// Manual check rate limit
const rateLimit = await window.deviceFingerprint.checkRateLimit('api', 100, 3600);

if (!rateLimit.allowed) {
    console.log('Rate limit exceeded');
}
```

## Konfigurasi Rate Limiting

### Default Limits

```php
// API endpoints: 100 requests/hour
checkRateLimit('api', 100, 3600);

// Dashboard: 200 requests/hour  
checkRateLimit('dashboard', 200, 3600);

// Login: 5 attempts/15 minutes
checkLoginRateLimit(); // Equivalent to checkRateLimit('login', 5, 900);
```

### Custom Limits

```php
// Custom endpoint dengan limit khusus
checkRateLimit('upload', 10, 1800); // 10 uploads per 30 minutes

// Manual configuration
$rateLimit = checkRateLimit('special', 50, 600, false);
```

## Database Schema

### Tabel `device_fingerprints`
- Menyimpan fingerprint dan metadata device
- Tracking last seen dan IP address
- Relasi dengan user jika ada

### Tabel `rate_limit_logs`
- Log semua request untuk rate limiting
- Tracking per device ID dan timestamp
- Auto cleanup untuk performa

### Tabel `rate_limit_config`
- Konfigurasi rate limiting per endpoint
- Flexible configuration management

## Device Fingerprinting Components

### Server-side (PHP)
- User Agent
- Accept headers (Accept, Accept-Language, Accept-Encoding)
- IP Address (fallback)
- Client ID dari localStorage

### Client-side (JavaScript)
- Screen resolution dan color depth
- Timezone
- Canvas fingerprint
- WebGL fingerprint
- Browser capabilities
- Hardware concurrency

## Keunggulan Sistem

### 1. Konsistensi
- Device ID tetap sama meskipun IP berubah
- Bekerja across different networks
- Tidak bergantung pada session atau login

### 2. Akurasi
- Kombinasi multiple factors untuk fingerprinting
- Sulit untuk di-spoof
- False positive rate rendah

### 3. Performance
- Caching di localStorage
- Database indexing optimal
- Auto cleanup data lama

### 4. Flexibility
- Configurable rate limits
- Multiple endpoint support
- Easy integration

## Testing

### 1. Test Interface
Buka `test_device_fingerprint.html` untuk testing manual:
- Device information display
- Rate limiting tests
- Results monitoring

### 2. Network Testing
- Test dengan WiFi
- Test dengan mobile data
- Verify device ID konsisten

### 3. Load Testing
- Test rate limiting dengan multiple requests
- Verify limits bekerja dengan benar
- Test reset time

## Monitoring

### 1. Database Queries

```sql
-- Monitor rate limiting activity
SELECT * FROM rate_limit_monitoring;

-- Check device fingerprints
SELECT * FROM device_fingerprints ORDER BY last_seen DESC LIMIT 10;

-- Rate limit violations
SELECT device_id, COUNT(*) as violations 
FROM rate_limit_logs 
WHERE request_time >= (UNIX_TIMESTAMP() - 3600)
GROUP BY device_id 
HAVING violations > 100;
```

### 2. Log Files
- PHP error log untuk rate limit violations
- Custom logging di application

## Troubleshooting

### 1. Device ID tidak konsisten
- Cek localStorage di browser
- Verify JavaScript fingerprinting bekerja
- Check database connection

### 2. Rate limiting tidak bekerja
- Verify database tables created
- Check PHP include paths
- Test dengan simple endpoint

### 3. Performance issues
- Check database indexes
- Run cleanup procedures
- Monitor query performance

## Security Considerations

### 1. Privacy
- Informasi fingerprinting minimal
- Tidak menyimpan data sensitif
- GDPR compliance considerations

### 2. Spoofing Prevention
- Multiple fingerprinting factors
- Server-side validation
- Regular monitoring

### 3. Rate Limit Bypass
- Tidak bergantung pada single factor
- Database-level enforcement
- Logging untuk analysis

## Best Practices

### 1. Implementation
- Test thoroughly before production
- Monitor performance impact
- Set appropriate rate limits

### 2. Maintenance
- Regular cleanup old data
- Monitor false positives
- Update fingerprinting methods

### 3. Scaling
- Consider Redis untuk high traffic
- Database optimization
- CDN untuk static assets

## API Reference

### PHP Functions

```php
// Basic rate limiting
checkRateLimit($endpoint, $maxRequests, $timeWindow, $autoResponse)

// Login specific
checkLoginRateLimit($autoResponse = true)

// Get device ID
getDeviceId()

// Manual rate limit check
$rateLimiter = new RateLimiter($db);
$result = $rateLimiter->checkLimit($endpoint, $maxRequests, $timeWindow);
```

### JavaScript Methods

```javascript
// Initialize
await window.deviceFingerprint.init()

// Check rate limit
await window.deviceFingerprint.checkRateLimit(endpoint, maxRequests, timeWindow)

// Get device info
window.deviceFingerprint.getDeviceInfo()

// Get client ID
window.deviceFingerprint.getClientId()
```

## Contoh Integrasi

Lihat file `example_usage.php` untuk contoh implementasi lengkap di berbagai skenario.

## Support

Untuk pertanyaan atau issues, silakan buka issue di repository atau hubungi developer.
