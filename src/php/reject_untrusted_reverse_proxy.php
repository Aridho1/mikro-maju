<?php
// reject_untrusted_reverse_proxy.php

// -------------------------
// CONFIG: isi dengan proxy yang TEpercaya saja (boleh single IP atau CIDR)
// contoh: local nginx, load balancer internal, Cloudflare ranges, dsb.
// -------------------------
$trustedProxies = [
    '127.0.0.1/8',        // localhost range
    '10.0.0.0/8',         // contoh private network
    '192.168.0.0/16',     // contoh private network
    // '203.0.113.5',      // single IPv4 allowed proxy
    // '2001:db8::/32',    // contoh IPv6 CIDR
];

// -------------------------
// helper: validasi IP
// -------------------------
function isValidIp(string $ip): bool {
    return filter_var($ip, FILTER_VALIDATE_IP) !== false;
}

/**
 * Cek apakah $ip berada dalam $cidr (bisa cidr atau single ip)
 * Mendukung IPv4 dan IPv6.
 */
function ipInCidr(string $ip, string $cidr): bool {
    if (strpos($cidr, '/') === false) {
        // single ip
        return $ip === $cidr;
    }

    list($subnet, $bits) = explode('/', $cidr, 2);
    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) !== false &&
        filter_var($subnet, FILTER_VALIDATE_IP, FILTER_FLAG_IPV4) !== false) {
        // IPv4 check
        $ipDec    = ip2long($ip);
        $subnetDec= ip2long($subnet);
        $mask = -1 << (32 - (int)$bits);
        $mask = $mask & 0xFFFFFFFF;
        return (($ipDec & $mask) === ($subnetDec & $mask));
    }

    if (filter_var($ip, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6) !== false &&
        filter_var($subnet, FILTER_VALIDATE_IP, FILTER_FLAG_IPV6) !== false) {
        // IPv6 check using binary strings
        $ipBin = inet_pton($ip);
        $subnetBin = inet_pton($subnet);
        if ($ipBin === false || $subnetBin === false) return false;
        $bits = (int)$bits;
        $bytes = (int)floor($bits / 8);
        $remBits = $bits % 8;

        if ($bytes > 0) {
            if (strncmp($ipBin, $subnetBin, $bytes) !== 0) return false;
        }
        if ($remBits === 0) return true;

        $maskByte = ( (0xFF00 >> $remBits) & 0xFF ); // left-most bits set
        return (ord($ipBin[$bytes]) & $maskByte) === (ord($subnetBin[$bytes]) & $maskByte);
    }

    return false;
}

/** Cek apakah IP termasuk di daftar trusted proxies (mendukung CIDR list) */
function isIpTrusted(string $ip, array $trustedList): bool {
    if (!isValidIp($ip)) return false;
    foreach ($trustedList as $entry) {
        if (ipInCidr($ip, $entry)) return true;
    }
    return false;
}

// -------------------------
// Main: deteksi proxy dan reject bila REMOTE_ADDR tidak trusted
// -------------------------
$remoteAddr = $_SERVER['REMOTE_ADDR'] ?? '';
// headers yang menandakan request lewat proxy/reverse-proxy
$proxyHeadersPresent = !empty($_SERVER['HTTP_X_FORWARDED_FOR']) ||
                       !empty($_SERVER['HTTP_FORWARDED']) ||
                       !empty($_SERVER['HTTP_VIA']);

if ($proxyHeadersPresent) {
    // kalau REMOTE_ADDR bukan IP valid -> reject
    if (!isValidIp($remoteAddr) || !isIpTrusted($remoteAddr, $trustedProxies)) {
        // Log (opsional) - catat percobaan
        error_log(sprintf(
            "[SEC] Untrusted reverse proxy detected. REMOTE_ADDR=%s, X-Forwarded-For=%s, URI=%s",
            $remoteAddr,
            $_SERVER['HTTP_X_FORWARDED_FOR'] ?? ($_SERVER['HTTP_FORWARDED'] ?? ''),
            $_SERVER['REQUEST_URI'] ?? ''
        ));

        // Response: 403 Forbidden + penjelasan
        http_response_code(403);
        header('Content-Type: application/json; charset=utf-8');

        $message = [
            'error' => 'Access from untrusted reverse proxy is forbidden.',
            'explain' => 'Server detected proxy headers (e.g. X-Forwarded-For) but the connecting IP (REMOTE_ADDR) is not in the trusted proxy list.',
            'how_to_fix' => 'Disable the reverse proxy or configure it to forward requests from a trusted IP. Alternatively, add the proxy IP/CIDR to the server\'s trusted proxies.',
            'note' => 'Custom X-Forwarded-For headers are ignored unless the connecting proxy IP is trusted.'
        ];

        echo json_encode($message, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        exit;
    }
}

// Jika sampai sini, entah tidak ada header proxy atau proxy trusted.
// Aman untuk lanjutkan dan (jika trusted) memakai X-Forwarded-For bila perlu.
// Contoh: ambil client IP dengan aman (pakai X-Forwarded-For hanya bila REMOTE_ADDR trusted)
function getTrustedClientIp(array $trustedProxies): string {
    $remote = $_SERVER['REMOTE_ADDR'] ?? '';
    if (isIpTrusted($remote, $trustedProxies) && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $parts = explode(',', $_SERVER['HTTP_X_FORWARDED_FOR']);
        $first = trim($parts[0]);
        if (filter_var($first, FILTER_VALIDATE_IP)) {
            return $first;
        }
    }
    return $remote;
}

// penggunaan contoh:
$clientIp = getTrustedClientIp($trustedProxies);
// lanjutkan aplikasi / rate limiter dengan $clientIp
echo "ip: $clientIp";


/**
 * Buat fingerprint unik untuk rate limiting.
 * Gabungkan IP + user agent + optional user identifier (user_id atau session id).
 *
 * @param string $ip
 * @param string|null $userAgent
 * @param string|null $extra optional (user id / api key / session id)
 * @return string hash (sha256)
 */
function makeFingerprint(string $ip, ?string $userAgent = null, ?string $extra = null): string {
    $userAgent = $userAgent ?? ($_SERVER['HTTP_USER_AGENT'] ?? '');
    $data = $ip . '|' . $userAgent . '|' . ($extra ?? '');
    return hash('sha256', $data);
}


$userAgent = $userAgent ?? ($_SERVER['HTTP_USER_AGENT'] ?? '');

$fingerprint = makeFingerprint($clientIp, $userAgent);

echo "<br><br>userAgent: $userAgent";
echo "<br><br>fingerprint: $fingerprint";