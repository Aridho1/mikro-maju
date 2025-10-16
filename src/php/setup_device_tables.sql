-- Setup tables untuk device fingerprinting dan rate limiting
-- Jalankan script ini untuk membuat tabel yang diperlukan

-- Tabel untuk menyimpan device fingerprints
CREATE TABLE IF NOT EXISTS `device_fingerprints` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `fingerprint` varchar(255) NOT NULL UNIQUE,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `last_seen` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_fingerprint` (`fingerprint`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_ip_address` (`ip_address`),
  KEY `idx_last_seen` (`last_seen`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel untuk log rate limiting
CREATE TABLE IF NOT EXISTS `rate_limit_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) NOT NULL,
  `request_time` int(11) NOT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `endpoint` varchar(255) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_device_id` (`device_id`),
  KEY `idx_request_time` (`request_time`),
  KEY `idx_ip_address` (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabel untuk konfigurasi rate limiting per endpoint
CREATE TABLE IF NOT EXISTS `rate_limit_config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `endpoint` varchar(255) NOT NULL,
  `max_requests` int(11) DEFAULT 100,
  `time_window` int(11) DEFAULT 3600,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_endpoint` (`endpoint`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default rate limit configurations
INSERT INTO `rate_limit_config` (`endpoint`, `max_requests`, `time_window`) VALUES
('login', 5, 900),      -- 5 attempts per 15 minutes
('api/*', 100, 3600),   -- 100 requests per hour
('dashboard', 200, 3600), -- 200 requests per hour
('*', 1000, 3600)       -- default: 1000 requests per hour
ON DUPLICATE KEY UPDATE 
`max_requests` = VALUES(`max_requests`),
`time_window` = VALUES(`time_window`);

-- Tabel untuk menyimpan device metadata (opsional)
CREATE TABLE IF NOT EXISTS `device_metadata` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_fingerprint_id` int(11) NOT NULL,
  `screen_resolution` varchar(50) DEFAULT NULL,
  `timezone` varchar(50) DEFAULT NULL,
  `canvas_fingerprint` varchar(255) DEFAULT NULL,
  `webgl_fingerprint` varchar(255) DEFAULT NULL,
  `browser_info` text DEFAULT NULL,
  `os_info` varchar(255) DEFAULT NULL,
  `created_at` timestamp DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_device_fingerprint_id` (`device_fingerprint_id`),
  FOREIGN KEY (`device_fingerprint_id`) REFERENCES `device_fingerprints`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- View untuk monitoring rate limiting
CREATE OR REPLACE VIEW `rate_limit_monitoring` AS
SELECT 
    rl.device_id,
    df.ip_address,
    df.user_agent,
    COUNT(rl.id) as request_count,
    MIN(rl.request_time) as first_request,
    MAX(rl.request_time) as last_request,
    df.last_seen
FROM rate_limit_logs rl
LEFT JOIN device_fingerprints df ON rl.device_id LIKE CONCAT('%', df.fingerprint, '%')
WHERE rl.request_time >= (UNIX_TIMESTAMP() - 3600) -- last hour
GROUP BY rl.device_id, df.ip_address, df.user_agent, df.last_seen
ORDER BY request_count DESC;

-- Index untuk performa
CREATE INDEX IF NOT EXISTS `idx_rate_limit_composite` ON `rate_limit_logs` (`device_id`, `request_time`);
CREATE INDEX IF NOT EXISTS `idx_device_fingerprints_composite` ON `device_fingerprints` (`fingerprint`, `last_seen`);

-- Stored procedure untuk cleanup data lama (opsional)
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS CleanupOldRateLimitData()
BEGIN
    -- Hapus log rate limiting yang lebih dari 7 hari
    DELETE FROM rate_limit_logs WHERE request_time < (UNIX_TIMESTAMP() - (7 * 24 * 3600));
    
    -- Hapus device fingerprints yang tidak aktif lebih dari 30 hari
    DELETE FROM device_fingerprints 
    WHERE is_active = 0 
    AND last_seen < (NOW() - INTERVAL 30 DAY);
    
    -- Optimize tables
    OPTIMIZE TABLE rate_limit_logs;
    OPTIMIZE TABLE device_fingerprints;
END //
DELIMITER ;

-- Event scheduler untuk cleanup otomatis (jika event scheduler enabled)
-- SET GLOBAL event_scheduler = ON;
-- 
-- CREATE EVENT IF NOT EXISTS cleanup_rate_limit_data
-- ON SCHEDULE EVERY 1 DAY
-- STARTS CURRENT_TIMESTAMP
-- DO
--   CALL CleanupOldRateLimitData();
