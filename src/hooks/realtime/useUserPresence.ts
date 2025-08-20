// Task 2: User Presence Tracking using Supabase presence
import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthenticatedUser } from '@/hooks/useAuthenticatedUser';

export interface UserPresenceState {
  userId: string;
  status: 'online' | 'away' | 'offline';
  lastSeen: Date;
  userAgent?: string;
  location?: string;
}

export interface PresenceMetrics {
  onlineUsers: number;
  totalPresenceEvents: number;
  averageSessionDuration: number;
  lastPresenceUpdate: Date | null;
}

interface UseUserPresenceProps {
  channelName?: string;
  updateInterval?: number;
  awayTimeout?: number;
}

export const useUserPresence = ({
  channelName = 'global_presence',
  updateInterval = 30000, // 30 seconds
  awayTimeout = 300000 // 5 minutes
}: UseUserPresenceProps = {}) => {
  const { user, isAuthenticated } = useAuthenticatedUser();
  const [presenceState, setPresenceState] = useState<UserPresenceState | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<UserPresenceState[]>([]);
  const [metrics, setMetrics] = useState<PresenceMetrics>({
    onlineUsers: 0,
    totalPresenceEvents: 0,
    averageSessionDuration: 0,
    lastPresenceUpdate: null
  });

  const [isTracking, setIsTracking] = useState(false);
  const sessionStartRef = useState(() => new Date())[0];

  // Update user's presence status
  const updatePresence = useCallback(async (status: 'online' | 'away' | 'offline') => {
    if (!isAuthenticated || !user) return;

    const presenceData: UserPresenceState = {
      userId: user.id,
      status,
      lastSeen: new Date(),
      userAgent: navigator.userAgent,
      location: window.location.pathname
    };

    try {
      const channel = supabase.channel(channelName);
      
      if (status === 'offline') {
        // Remove presence when going offline
        await channel.untrack();
      } else {
        // Track presence for online/away status
        await channel.track(presenceData);
      }

      setPresenceState(presenceData);
      setMetrics(prev => ({
        ...prev,
        totalPresenceEvents: prev.totalPresenceEvents + 1,
        lastPresenceUpdate: new Date()
      }));

    } catch (error) {
      console.error('Error updating presence:', error);
    }
  }, [isAuthenticated, user, channelName]);

  // Start presence tracking
  const startTracking = useCallback(async () => {
    if (!isAuthenticated || isTracking) return;

    setIsTracking(true);
    await updatePresence('online');

    // Set up presence channel
    const channel = supabase
      .channel(channelName, {
        config: {
          presence: {
            key: user?.id || 'anonymous'
          }
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const newState = channel.presenceState();
        const users: UserPresenceState[] = [];
        
        Object.values(newState).forEach((presences: any) => {
          presences.forEach((presence: UserPresenceState) => {
            users.push(presence);
          });
        });

        setOnlineUsers(users);
        setMetrics(prev => ({
          ...prev,
          onlineUsers: users.length,
          lastPresenceUpdate: new Date()
        }));
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences);
      })
      .subscribe();

    return channel;
  }, [isAuthenticated, isTracking, user, channelName, updatePresence]);

  // Stop presence tracking
  const stopTracking = useCallback(async () => {
    if (!isTracking) return;

    await updatePresence('offline');
    setIsTracking(false);
    
    // Calculate session duration
    const sessionDuration = Date.now() - sessionStartRef.getTime();
    setMetrics(prev => ({
      ...prev,
      averageSessionDuration: (prev.averageSessionDuration + sessionDuration) / 2
    }));
  }, [isTracking, updatePresence, sessionStartRef]);

  // Handle activity detection for away status
  const handleActivity = useCallback(() => {
    if (isTracking && presenceState?.status === 'away') {
      updatePresence('online');
    }
  }, [isTracking, presenceState?.status, updatePresence]);

  // Set up activity listeners
  useEffect(() => {
    if (!isTracking) return;

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  }, [isTracking, handleActivity]);

  // Set up periodic presence updates and away detection
  useEffect(() => {
    if (!isTracking) return;

    let lastActivity = Date.now();
    
    // Update last activity on user interaction
    const updateActivity = () => {
      lastActivity = Date.now();
    };

    const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    activityEvents.forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });

    // Periodic status check
    const interval = setInterval(() => {
      const timeSinceActivity = Date.now() - lastActivity;
      
      if (timeSinceActivity > awayTimeout && presenceState?.status !== 'away') {
        updatePresence('away');
      } else if (timeSinceActivity <= awayTimeout && presenceState?.status === 'away') {
        updatePresence('online');
      } else if (presenceState?.status === 'online') {
        // Refresh online status periodically
        updatePresence('online');
      }
    }, updateInterval);

    return () => {
      clearInterval(interval);
      activityEvents.forEach(event => {
        document.removeEventListener(event, updateActivity);
      });
    };
  }, [isTracking, awayTimeout, updateInterval, presenceState?.status, updatePresence]);

  // Handle page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        updatePresence('away');
      } else {
        updatePresence('online');
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [updatePresence]);

  // Auto-start tracking when authenticated
  useEffect(() => {
    if (isAuthenticated && !isTracking) {
      startTracking();
    } else if (!isAuthenticated && isTracking) {
      stopTracking();
    }
  }, [isAuthenticated, isTracking, startTracking, stopTracking]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (isTracking) {
        stopTracking();
      }
    };
  }, [isTracking, stopTracking]);

  return {
    presenceState,
    onlineUsers,
    metrics,
    isTracking,
    startTracking,
    stopTracking,
    updatePresence
  };
};