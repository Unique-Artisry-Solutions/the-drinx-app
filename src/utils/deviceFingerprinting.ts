// Device Fingerprinting for Fraud Detection
// Level 3: Advanced Security Measures

export interface DeviceFingerprint {
  screen: {
    width: number;
    height: number;
    colorDepth: number;
    pixelRatio: number;
  };
  timezone: string;
  language: string;
  platform: string;
  userAgent: string;
  webgl: string;
  canvas: string;
  fonts: string[];
  plugins: string[];
  localStorage: boolean;
  sessionStorage: boolean;
  indexedDB: boolean;
  webWorkers: boolean;
  deviceMemory?: number;
  hardwareConcurrency: number;
  connection?: {
    effectiveType?: string;
    downlink?: number;
    rtt?: number;
  };
  battery?: {
    charging: boolean;
    level: number;
  };
  touchSupport: boolean;
  cookieEnabled: boolean;
  doNotTrack: string | null;
}

export interface DeviceFingerprintResult {
  fingerprint: DeviceFingerprint;
  hash: string;
  riskScore: number;
  isNew: boolean;
  suspiciousIndicators: string[];
}

class DeviceFingerprintGenerator {
  private async getCanvasFingerprint(): Promise<string> {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return 'no-canvas';

      canvas.width = 200;
      canvas.height = 50;

      // Draw text with different fonts and styles
      ctx.textBaseline = 'top';
      ctx.font = '14px Arial';
      ctx.fillText('Device fingerprint test 🔐', 2, 2);

      ctx.font = '18px Times';
      ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
      ctx.fillText('Security check', 4, 20);

      // Draw some shapes
      ctx.beginPath();
      ctx.arc(50, 25, 20, 0, Math.PI * 2);
      ctx.fill();

      return canvas.toDataURL();
    } catch {
      return 'canvas-error';
    }
  }

  private async getWebGLFingerprint(): Promise<string> {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') as WebGLRenderingContext || 
                 canvas.getContext('experimental-webgl') as WebGLRenderingContext;
      if (!gl) return 'no-webgl';

      const renderer = gl.getParameter(gl.RENDERER);
      const vendor = gl.getParameter(gl.VENDOR);
      const version = gl.getParameter(gl.VERSION);
      const extensions = gl.getSupportedExtensions();

      return `${vendor}_${renderer}_${version}_${extensions?.join(',') || ''}`;
    } catch {
      return 'webgl-error';
    }
  }

  private async getFonts(): Promise<string[]> {
    const fonts = [
      'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Georgia',
      'Impact', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Webdings',
      'Wingdings', 'Tahoma', 'Helvetica', 'Times', 'Courier', 'Palatino',
      'Garamond', 'Bookman', 'Avant Garde'
    ];

    return fonts.filter(font => this.isFontAvailable(font));
  }

  private isFontAvailable(font: string): boolean {
    try {
      const testString = 'abcdefghijklmnopqrstuvwxyz0123456789';
      const testSize = '72px';
      const baseFonts = ['monospace', 'sans-serif', 'serif'];

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return false;

      context.font = testSize + ' ' + font + ', monospace';
      const width1 = context.measureText(testString).width;

      context.font = testSize + ' ' + font + ', sans-serif';
      const width2 = context.measureText(testString).width;

      context.font = testSize + ' ' + font + ', serif';
      const width3 = context.measureText(testString).width;

      return width1 !== width2 || width1 !== width3;
    } catch {
      return false;
    }
  }

  private getPlugins(): string[] {
    try {
      const plugins = Array.from(navigator.plugins || []);
      return plugins.map(plugin => plugin.name).sort();
    } catch {
      return [];
    }
  }

  private async getBatteryInfo(): Promise<{ charging: boolean; level: number } | undefined> {
    try {
      // @ts-ignore - Battery API is experimental
      const battery = await navigator.getBattery?.();
      if (battery) {
        return {
          charging: battery.charging,
          level: Math.round(battery.level * 100) / 100
        };
      }
    } catch {
      // Battery API not supported or blocked
    }
    return undefined;
  }

  private getConnectionInfo(): { effectiveType?: string; downlink?: number; rtt?: number } | undefined {
    try {
      // @ts-ignore - Connection API is experimental
      const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
      if (connection) {
        return {
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt
        };
      }
    } catch {
      // Connection API not supported
    }
    return undefined;
  }

  public async generateFingerprint(): Promise<DeviceFingerprint> {
    const [canvasFingerprint, webglFingerprint, fonts, batteryInfo] = await Promise.all([
      this.getCanvasFingerprint(),
      this.getWebGLFingerprint(),
      this.getFonts(),
      this.getBatteryInfo()
    ]);

    return {
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth,
        pixelRatio: window.devicePixelRatio || 1
      },
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
      webgl: webglFingerprint,
      canvas: canvasFingerprint,
      fonts,
      plugins: this.getPlugins(),
      localStorage: !!window.localStorage,
      sessionStorage: !!window.sessionStorage,
      indexedDB: !!window.indexedDB,
      webWorkers: !!window.Worker,
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency || 1,
      connection: this.getConnectionInfo(),
      battery: batteryInfo,
      touchSupport: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack
    };
  }

  public hashFingerprint(fingerprint: DeviceFingerprint): string {
    const fingerprintString = JSON.stringify(fingerprint, Object.keys(fingerprint).sort());
    return this.simpleHash(fingerprintString);
  }

  private simpleHash(str: string): string {
    let hash = 0;
    if (str.length === 0) return hash.toString();
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return Math.abs(hash).toString(36);
  }

  public calculateRiskScore(fingerprint: DeviceFingerprint, isNew: boolean): { score: number; indicators: string[] } {
    const indicators: string[] = [];
    let score = 0;

    // New device penalty
    if (isNew) {
      score += 20;
      indicators.push('new_device');
    }

    // Suspicious user agent patterns
    const userAgent = fingerprint.userAgent.toLowerCase();
    if (userAgent.includes('bot') || userAgent.includes('crawler') || userAgent.includes('spider')) {
      score += 50;
      indicators.push('suspicious_user_agent');
    }

    if (userAgent.includes('headless') || userAgent.includes('phantom')) {
      score += 40;
      indicators.push('headless_browser');
    }

    // Suspicious screen configurations
    if (fingerprint.screen.width === 1024 && fingerprint.screen.height === 768) {
      score += 15;
      indicators.push('common_screen_size');
    }

    // Too few fonts (possible spoofing)
    if (fingerprint.fonts.length < 5) {
      score += 25;
      indicators.push('limited_fonts');
    }

    // No plugins (possible automation)
    if (fingerprint.plugins.length === 0) {
      score += 20;
      indicators.push('no_plugins');
    }

    // Disabled features
    if (!fingerprint.localStorage || !fingerprint.sessionStorage) {
      score += 15;
      indicators.push('storage_disabled');
    }

    // DoNotTrack enabled (privacy-conscious but potentially suspicious)
    if (fingerprint.doNotTrack === '1') {
      score += 5;
      indicators.push('do_not_track');
    }

    // Unusual hardware concurrency
    if (fingerprint.hardwareConcurrency > 16) {
      score += 10;
      indicators.push('high_core_count');
    }

    // Unusual device memory
    if (fingerprint.deviceMemory && fingerprint.deviceMemory > 32) {
      score += 10;
      indicators.push('high_memory');
    }

    return {
      score: Math.min(100, score),
      indicators
    };
  }
}

export const deviceFingerprintGenerator = new DeviceFingerprintGenerator();

export async function generateDeviceFingerprint(): Promise<DeviceFingerprintResult> {
  const fingerprint = await deviceFingerprintGenerator.generateFingerprint();
  const hash = deviceFingerprintGenerator.hashFingerprint(fingerprint);
  
  // Check if this is a new device (would need to check against stored fingerprints)
  const isNew = true; // This would be determined by checking the database
  
  const { score: riskScore, indicators: suspiciousIndicators } = 
    deviceFingerprintGenerator.calculateRiskScore(fingerprint, isNew);

  return {
    fingerprint,
    hash,
    riskScore,
    isNew,
    suspiciousIndicators
  };
}