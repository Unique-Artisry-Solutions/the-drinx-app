/**
 * **PHASE 4 FIX**: Session monitoring utilities to detect and recover from auth mismatches
 */

import { supabase } from '@/lib/supabase';
import { useState, useEffect } from 'react';

export interface SessionMonitorState {
  isMonitoring: boolean;
  lastCheck: number;
  checksPerformed: number;
  authMismatches: number;
  recoveryAttempts: number;
}

class SessionMonitor {
  private state: SessionMonitorState = {
    isMonitoring: false,
    lastCheck: 0,
    checksPerformed: 0,
    authMismatches: 0,
    recoveryAttempts: 0
  };

  private intervalId: NodeJS.Timeout | null = null;
  private listeners: ((state: SessionMonitorState) => void)[] = [];

  /**
   * Start monitoring session state
   */
  startMonitoring(intervalMs: number = 30000) { // 30 seconds default
    if (this.state.isMonitoring) {
      console.log('🔧 SessionMonitor - Already monitoring');
      return;
    }

    console.log(`🔧 SessionMonitor - Starting monitoring (${intervalMs}ms interval)`);
    this.state.isMonitoring = true;
    
    this.intervalId = setInterval(() => {
      this.performCheck();
    }, intervalMs);

    // Perform initial check
    this.performCheck();
  }

  /**
   * Stop monitoring
   */
  stopMonitoring() {
    if (!this.state.isMonitoring) return;

    console.log('🔧 SessionMonitor - Stopping monitoring');
    this.state.isMonitoring = false;

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Perform a session check
   */
  private async performCheck() {
    const checkStart = Date.now();
    this.state.checksPerformed++;
    this.state.lastCheck = checkStart;

    try {
      console.log(`🔧 SessionMonitor - Performing check #${this.state.checksPerformed}`);

      // Check DevBypass state
      const devUserType = localStorage.getItem('dev_auto_login_user_type');
      const devTimestamp = localStorage.getItem('dev_auto_login_timestamp');

      // Check Supabase session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      const hasDevState = !!(devUserType && devTimestamp);
      const hasSupabaseSession = !!(sessionData?.session?.user);

      console.log('🔧 SessionMonitor - Check results:', {
        hasDevState,
        devUserType,
        hasSupabaseSession,
        sessionUserId: sessionData?.session?.user?.id,
        sessionError: sessionError?.message,
        checkDuration: Date.now() - checkStart
      });

      // Detect auth state mismatch
      if (hasDevState && !hasSupabaseSession) {
        console.warn('🔧 SessionMonitor - Auth state mismatch detected!');
        this.state.authMismatches++;
        
        await this.attemptRecovery(devUserType);
      } else if (hasSupabaseSession && !hasDevState) {
        console.log('🔧 SessionMonitor - Supabase session exists without DevBypass state');
      } else if (!hasDevState && !hasSupabaseSession) {
        console.log('🔧 SessionMonitor - No auth state (normal when not logged in)');
      } else {
        console.log('🔧 SessionMonitor - Auth states are synchronized');
      }

      this.notifyListeners();

    } catch (error: any) {
      console.error('🔧 SessionMonitor - Check error:', error);
    }
  }

  /**
   * Attempt recovery when auth mismatch is detected
   */
  private async attemptRecovery(devUserType: string | null) {
    if (!devUserType) return;

    this.state.recoveryAttempts++;
    console.log(`🔧 SessionMonitor - Attempting recovery #${this.state.recoveryAttempts} for ${devUserType}`);

    try {
      const { recoverDevBypassSession } = await import('@/utils/auth/sessionRecovery');
      const recoveryResult = await recoverDevBypassSession();

      console.log('🔧 SessionMonitor - Recovery result:', recoveryResult);

      if (recoveryResult.success) {
        console.log('🔧 SessionMonitor - Recovery successful');
        // Perform another check after recovery
        setTimeout(() => this.performCheck(), 1000);
      } else {
        console.error('🔧 SessionMonitor - Recovery failed:', recoveryResult.error);
      }

    } catch (error: any) {
      console.error('🔧 SessionMonitor - Recovery error:', error);
    }
  }

  /**
   * Add a listener for state changes
   */
  addListener(listener: (state: SessionMonitorState) => void) {
    this.listeners.push(listener);
  }

  /**
   * Remove a listener
   */
  removeListener(listener: (state: SessionMonitorState) => void) {
    const index = this.listeners.indexOf(listener);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners of state changes
   */
  private notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        listener({ ...this.state });
      } catch (error) {
        console.error('🔧 SessionMonitor - Listener error:', error);
      }
    });
  }

  /**
   * Get current state
   */
  getState(): SessionMonitorState {
    return { ...this.state };
  }

  /**
   * Reset counters
   */
  reset() {
    this.state.checksPerformed = 0;
    this.state.authMismatches = 0;
    this.state.recoveryAttempts = 0;
    this.notifyListeners();
  }
}

// Export singleton instance
export const sessionMonitor = new SessionMonitor();

/**
 * React hook for using session monitor
 */
export const useSessionMonitor = () => {
  // Use React dynamically to avoid SSR issues
  const [React, setReact] = useState<any>(null);
  const [state, setState] = useState<SessionMonitorState>(sessionMonitor.getState());

  useEffect(() => {
    import('react').then(setReact);
  }, []);

  useEffect(() => {
    if (!React) return;
    
    const listener = (newState: SessionMonitorState) => {
      setState(newState);
    };

    sessionMonitor.addListener(listener);
    
    return () => {
      sessionMonitor.removeListener(listener);
    };
  }, [React]);

  return {
    ...state,
    startMonitoring: sessionMonitor.startMonitoring.bind(sessionMonitor),
    stopMonitoring: sessionMonitor.stopMonitoring.bind(sessionMonitor),
    reset: sessionMonitor.reset.bind(sessionMonitor)
  };
};