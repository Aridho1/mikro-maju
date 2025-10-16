// deviceFingerprint.js - Client-side device fingerprinting
// Mengumpulkan informasi browser dan device untuk fingerprinting

class DeviceFingerprint {
    constructor() {
        this.clientId = null;
        this.fingerprint = null;
    }

    /**
     * Generate atau ambil client ID dari localStorage
     */
    getClientId() {
        const storageKey = 'device_client_id';
        let clientId = localStorage.getItem(storageKey);
        
        if (!clientId) {
            // Generate client ID baru
            clientId = 'client_' + this.generateRandomString(16) + '_' + Date.now();
            localStorage.setItem(storageKey, clientId);
        }
        
        this.clientId = clientId;
        return clientId;
    }

    /**
     * Generate random string
     */
    generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    /**
     * Dapatkan screen resolution
     */
    getScreenResolution() {
        return {
            width: screen.width,
            height: screen.height,
            availWidth: screen.availWidth,
            availHeight: screen.availHeight,
            colorDepth: screen.colorDepth,
            pixelDepth: screen.pixelDepth
        };
    }

    /**
     * Dapatkan timezone
     */
    getTimezone() {
        try {
            return Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch (e) {
            return new Date().getTimezoneOffset().toString();
        }
    }

    /**
     * Generate canvas fingerprint
     */
    getCanvasFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // Set canvas size
            canvas.width = 200;
            canvas.height = 50;
            
            // Draw text
            ctx.textBaseline = 'top';
            ctx.font = '14px Arial';
            ctx.fillStyle = '#f60';
            ctx.fillRect(125, 1, 62, 20);
            ctx.fillStyle = '#069';
            ctx.fillText('Device fingerprint', 2, 15);
            ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
            ctx.fillText('Device fingerprint', 4, 17);
            
            return canvas.toDataURL();
        } catch (e) {
            return 'canvas_error';
        }
    }

    /**
     * Generate WebGL fingerprint
     */
    getWebGLFingerprint() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (!gl) return 'webgl_not_supported';
            
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                return {
                    vendor: gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL),
                    renderer: gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL),
                    version: gl.getParameter(gl.VERSION),
                    shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
                };
            }
            
            return {
                version: gl.getParameter(gl.VERSION),
                shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION)
            };
        } catch (e) {
            return 'webgl_error';
        }
    }

    /**
     * Dapatkan informasi browser
     */
    getBrowserInfo() {
        const nav = navigator;
        return {
            userAgent: nav.userAgent,
            language: nav.language,
            languages: nav.languages,
            platform: nav.platform,
            cookieEnabled: nav.cookieEnabled,
            doNotTrack: nav.doNotTrack,
            hardwareConcurrency: nav.hardwareConcurrency,
            maxTouchPoints: nav.maxTouchPoints,
            vendor: nav.vendor,
            vendorSub: nav.vendorSub,
            productSub: nav.productSub,
            appName: nav.appName,
            appVersion: nav.appVersion,
            appCodeName: nav.appCodeName
        };
    }

    /**
     * Dapatkan informasi device
     */
    getDeviceInfo() {
        return {
            screen: this.getScreenResolution(),
            timezone: this.getTimezone(),
            canvas: this.getCanvasFingerprint(),
            webgl: this.getWebGLFingerprint(),
            browser: this.getBrowserInfo(),
            timestamp: Date.now()
        };
    }

    /**
     * Kirim fingerprint ke server
     */
    async sendFingerprintToServer() {
        const deviceInfo = this.getDeviceInfo();
        const clientId = this.getClientId();
        
        const formData = new FormData();
        formData.append('action', 'get_device_id');
        formData.append('client_id', clientId);
        formData.append('screen_resolution', JSON.stringify(deviceInfo.screen));
        formData.append('timezone', deviceInfo.timezone);
        formData.append('canvas_fingerprint', deviceInfo.canvas);
        formData.append('webgl_fingerprint', JSON.stringify(deviceInfo.webgl));
        formData.append('browser_info', JSON.stringify(deviceInfo.browser));
        
        try {
            const response = await fetch('./src/php/device_fingerprint.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.status) {
                this.fingerprint = result.device_id;
                // Simpan device_id untuk penggunaan selanjutnya
                localStorage.setItem('device_id', result.device_id);
                return result.device_id;
            } else {
                console.error('Failed to get device ID:', result.message);
                return null;
            }
        } catch (error) {
            console.error('Error sending fingerprint:', error);
            return null;
        }
    }

    /**
     * Cek rate limit
     */
    async checkRateLimit(endpoint = '*', maxRequests = 100, timeWindow = 3600) {
        const deviceId = this.fingerprint || localStorage.getItem('device_id');
        
        if (!deviceId) {
            console.error('No device ID available');
            return { allowed: false, error: 'No device ID' };
        }
        
        const formData = new FormData();
        formData.append('action', 'check_rate_limit');
        formData.append('device_id', deviceId);
        formData.append('max_requests', maxRequests);
        formData.append('time_window', timeWindow);
        
        try {
            const response = await fetch('./src/php/device_fingerprint.php', {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.status) {
                return result.rate_limit;
            } else {
                console.error('Rate limit check failed:', result.message);
                return { allowed: false, error: result.message };
            }
        } catch (error) {
            console.error('Error checking rate limit:', error);
            return { allowed: false, error: 'Network error' };
        }
    }

    /**
     * Initialize device fingerprinting
     */
    async init() {
        // Cek apakah sudah ada device_id di localStorage
        let deviceId = localStorage.getItem('device_id');
        
        if (!deviceId) {
            // Generate dan kirim fingerprint ke server
            deviceId = await this.sendFingerprintToServer();
        } else {
            this.fingerprint = deviceId;
        }
        
        return deviceId;
    }
}

// Auto-initialize jika dijalankan di browser
if (typeof window !== 'undefined') {
    window.deviceFingerprint = new DeviceFingerprint();
    
    // Initialize otomatis saat DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.deviceFingerprint.init();
        });
    } else {
        window.deviceFingerprint.init();
    }
}

// Export untuk module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DeviceFingerprint;
}
