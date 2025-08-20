// Task 2: Enhanced Connection Management with robust retry logic
import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

export interface ConnectionState {
  status: 'connecting' | 'connected' | 'disconnected' | 'error';
  retryCount: number;
  lastError?: string;
  lastConnected?: Date;
  quality: 'excellent' | 'good' | 'poor' | 'offline';
}

export interface ConnectionMetrics {
  totalReconnects: number;
  averageLatency: number;
  lastHeartbeat: Date | null;
  messagesReceived: number;
  messagesSent: number;
}

interface UseRealtimeConnectionProps {
  channelName: string;
  onStatusChange?: (status: ConnectionState) => void;
  onMessage?: (payload: any) => void;
  retryConfig?: {
    maxRetries: number;
    baseDelay: number;
    maxDelay: number;
  };
}

export const useRealtimeConnection = ({
  channelName,
  onStatusChange,
  onMessage,
  retryConfig = {
    maxRetries: 10,
    baseDelay: 1000,
    maxDelay: 30000
  }
}: UseRealtimeConnectionProps) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    status: 'disconnected',
    retryCount: 0,
    quality: 'offline'
  });

  const [metrics, setMetrics] = useState<ConnectionMetrics>({
    totalReconnects: 0,
    averageLatency: 0,
    lastHeartbeat: null,
    messagesReceived: 0,
    messagesSent: 0
  });

  const channelRef = useRef<RealtimeChannel | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const isUnmountedRef = useRef(false);

  // Calculate exponential backoff delay
  const calculateRetryDelay = useCallback((attempt: number): number => {
    const delay = Math.min(
      retryConfig.baseDelay * Math.pow(2, attempt),
      retryConfig.maxDelay
    );
    // Add some jitter to prevent thundering herd
    return delay + Math.random() * 1000;
  }, [retryConfig]);

  // Update connection state and notify parent
  const updateConnectionState = useCallback((updates: Partial<ConnectionState>) => {
    setConnectionState(prev => {
      const newState = { ...prev, ...updates };
      onStatusChange?.(newState);
      return newState;
    });
  }, [onStatusChange]);

  // Start heartbeat monitoring
  const startHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
    }

    heartbeatIntervalRef.current = setInterval(() => {
      const channel = channelRef.current;
      if (channel && channel.state === 'joined') {
        const startTime = Date.now();
        
        // Send a heartbeat message
        channel.send({
          type: 'broadcast',
          event: 'heartbeat',
          payload: { timestamp: startTime }
        });

        setMetrics(prev => ({
          ...prev,
          lastHeartbeat: new Date(),
          messagesSent: prev.messagesSent + 1
        }));
      }
    }, 30000); // Heartbeat every 30 seconds
  }, []);

  // Stop heartbeat monitoring
  const stopHeartbeat = useCallback(() => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  // Establish connection
  const connect = useCallback(async () => {
    if (isUnmountedRef.current) return;

    updateConnectionState({ status: 'connecting' });

    try {
      // Clean up existing channel
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }

      const channel = supabase
        .channel(channelName, {
          config: {
            presence: { key: 'user_presence' },
            broadcast: { self: true }
          }
        })
        .on('broadcast', { event: 'heartbeat' }, (payload) => {
          // Handle heartbeat response for latency calculation
          const latency = Date.now() - payload.payload.timestamp;
          setMetrics(prev => ({
            ...prev,
            averageLatency: (prev.averageLatency + latency) / 2,
            messagesReceived: prev.messagesReceived + 1
          }));
        })
        .on('broadcast', { event: '*' }, (payload) => {
          if (payload.event !== 'heartbeat') {
            onMessage?.(payload);
            setMetrics(prev => ({
              ...prev,
              messagesReceived: prev.messagesReceived + 1
            }));
          }
        })
        .on('presence', { event: 'sync' }, () => {
          console.log('Presence synced for channel:', channelName);
        })
        .subscribe((status) => {
          console.log('Channel subscription status:', status, 'for channel:', channelName);
          
          if (status === 'SUBSCRIBED') {
            reconnectAttemptsRef.current = 0;
            updateConnectionState({
              status: 'connected',
              retryCount: 0,
              quality: 'excellent',
              lastConnected: new Date()
            });
            startHeartbeat();
          } else if (status === 'CHANNEL_ERROR') {
            updateConnectionState({
              status: 'error',
              lastError: 'Channel subscription failed',
              quality: 'offline'
            });
            scheduleReconnect();
          } else if (status === 'TIMED_OUT') {
            updateConnectionState({
              status: 'error',
              lastError: 'Connection timed out',
              quality: 'offline'
            });
            scheduleReconnect();
          }
        });

      channelRef.current = channel;

    } catch (error) {
      console.error('Connection error:', error);
      updateConnectionState({
        status: 'error',
        lastError: error instanceof Error ? error.message : 'Unknown connection error',
        quality: 'offline'
      });
      scheduleReconnect();
    }
  }, [channelName, onMessage, updateConnectionState, startHeartbeat]);

  // Schedule reconnection with exponential backoff
  const scheduleReconnect = useCallback(() => {
    if (isUnmountedRef.current) return;
    if (reconnectAttemptsRef.current >= retryConfig.maxRetries) {
      updateConnectionState({
        status: 'error',
        lastError: 'Max retry attempts reached',
        quality: 'offline'
      });
      return;
    }

    const delay = calculateRetryDelay(reconnectAttemptsRef.current);
    reconnectAttemptsRef.current += 1;

    updateConnectionState({
      status: 'connecting',
      retryCount: reconnectAttemptsRef.current,
      quality: 'poor'
    });

    setMetrics(prev => ({
      ...prev,
      totalReconnects: prev.totalReconnects + 1
    }));

    retryTimeoutRef.current = setTimeout(() => {
      if (!isUnmountedRef.current) {
        connect();
      }
    }, delay);
  }, [retryConfig.maxRetries, calculateRetryDelay, updateConnectionState, connect]);

  // Disconnect
  const disconnect = useCallback(() => {
    stopHeartbeat();
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }

    updateConnectionState({
      status: 'disconnected',
      quality: 'offline'
    });
  }, [stopHeartbeat, updateConnectionState]);

  // Send message through channel
  const sendMessage = useCallback((event: string, payload: any) => {
    const channel = channelRef.current;
    if (channel && channel.state === 'joined') {
      channel.send({
        type: 'broadcast',
        event,
        payload
      });
      
      setMetrics(prev => ({
        ...prev,
        messagesSent: prev.messagesSent + 1
      }));
      
      return true;
    }
    return false;
  }, []);

  // Manual reconnect
  const reconnect = useCallback(() => {
    disconnect();
    reconnectAttemptsRef.current = 0;
    connect();
  }, [disconnect, connect]);

  // Initialize connection on mount
  useEffect(() => {
    connect();

    // Handle online/offline events
    const handleOnline = () => {
      console.log('Network came online, reconnecting...');
      reconnect();
    };

    const handleOffline = () => {
      console.log('Network went offline');
      updateConnectionState({
        status: 'disconnected',
        quality: 'offline',
        lastError: 'Network offline'
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      isUnmountedRef.current = true;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      disconnect();
    };
  }, [connect, disconnect, reconnect, updateConnectionState]);

  return {
    connectionState,
    metrics,
    connect,
    disconnect,
    reconnect,
    sendMessage,
    isConnected: connectionState.status === 'connected'
  };
};