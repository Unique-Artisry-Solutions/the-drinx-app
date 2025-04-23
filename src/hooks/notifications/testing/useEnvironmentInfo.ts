
import { useCallback } from 'react';

interface EnvironmentInfo {
  userAgent: string;
  platform: string;
  vendor: string;
  language: string;
  doNotTrack: string | null;
  cookieEnabled: boolean;
  onLine: boolean;
}

export function useEnvironmentInfo() {
  const logEnvironmentInfo = useCallback(() => {
    const info: EnvironmentInfo = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      vendor: navigator.vendor,
      language: navigator.language,
      doNotTrack: navigator.doNotTrack,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine
    };
    console.log('[NotificationTesting] Environment info:', info);
  }, []);

  return { logEnvironmentInfo };
}
