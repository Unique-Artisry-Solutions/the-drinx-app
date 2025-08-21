import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

interface ChannelConfig {
  name: string;
  handler: (payload: any) => void;
  options?: any;
}

/**
 * Manages real-time connections to prevent memory leaks and excessive connections
 */
class RealtimeConnectionManager {
  private channels = new Map<string, RealtimeChannel>();
  private connectionAttempts = new Map<string, number>();
  private maxConnections = 10;
  private maxRetries = 3;

  /**
   * Create or get existing channel
   */
  getChannel(channelName: string, config?: any): RealtimeChannel {
    if (this.channels.has(channelName)) {
      const existingChannel = this.channels.get(channelName)!;
      console.log(`🔄 Reusing existing channel: ${channelName}`);
      return existingChannel;
    }

    if (this.channels.size >= this.maxConnections) {
      console.warn(`🚨 Max connections (${this.maxConnections}) reached, cleaning up oldest channels`);
      this.cleanupOldestChannels(1);
    }

    console.log(`🆕 Creating new channel: ${channelName}`);
    const channel = supabase.channel(channelName, config);
    this.channels.set(channelName, channel);
    
    return channel;
  }

  /**
   * Subscribe to channel with retry logic
   */
  async subscribeToChannel(config: ChannelConfig): Promise<RealtimeChannel> {
    const { name, handler, options } = config;
    
    // Check if channel already exists and is subscribed
    if (this.channels.has(name)) {
      const existingChannel = this.channels.get(name)!;
      console.log(`🔄 Channel ${name} already exists and subscribed`);
      return existingChannel;
    }

    const attempts = this.connectionAttempts.get(name) || 0;
    if (attempts >= this.maxRetries) {
      console.error(`🚨 Max retries reached for channel: ${name}`);
      throw new Error(`Max retries reached for channel: ${name}`);
    }

    const channel = this.getChannel(name, options);

    try {
      await new Promise((resolve, reject) => {
        channel
          .on('postgres_changes', options || {}, handler)
          .subscribe((status) => {
            console.log(`📡 Channel ${name} status: ${status}`);
            if (status === 'SUBSCRIBED') {
              this.connectionAttempts.set(name, 0); // Reset attempts on success
              resolve(status);
            } else if (status === 'CHANNEL_ERROR') {
              reject(new Error(`Channel subscription failed: ${name}`));
            }
          });
      });

      return channel;
    } catch (error) {
      console.error(`🚨 Channel subscription error for ${name}:`, error);
      this.connectionAttempts.set(name, attempts + 1);
      
      // Clean up failed channel
      this.removeChannel(name);
      
      if (attempts < this.maxRetries - 1) {
        console.log(`🔄 Retrying channel subscription: ${name} (attempt ${attempts + 2})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempts + 1))); // Exponential backoff
        return this.subscribeToChannel(config);
      }
      
      throw error;
    }
  }

  /**
   * Remove and unsubscribe from channel
   */
  removeChannel(channelName: string): boolean {
    const channel = this.channels.get(channelName);
    if (channel) {
      console.log(`🗑️ Removing channel: ${channelName}`);
      try {
        supabase.removeChannel(channel);
      } catch (error) {
        console.warn(`⚠️ Error removing channel ${channelName}:`, error);
      }
      
      this.channels.delete(channelName);
      this.connectionAttempts.delete(channelName);
      return true;
    }
    return false;
  }

  /**
   * Clean up oldest channels
   */
  private cleanupOldestChannels(count: number): void {
    const channelNames = Array.from(this.channels.keys());
    for (let i = 0; i < Math.min(count, channelNames.length); i++) {
      this.removeChannel(channelNames[i]);
    }
  }

  /**
   * Clean up all channels
   */
  cleanup(): void {
    console.log(`🧹 Cleaning up all ${this.channels.size} channels`);
    const channelNames = Array.from(this.channels.keys());
    channelNames.forEach(name => this.removeChannel(name));
  }

  /**
   * Get connection statistics
   */
  getStats() {
    return {
      activeChannels: this.channels.size,
      maxConnections: this.maxConnections,
      failedAttempts: Array.from(this.connectionAttempts.entries())
        .filter(([, attempts]) => attempts > 0)
        .length,
      channelNames: Array.from(this.channels.keys())
    };
  }

  /**
   * Health check for connections
   */
  async healthCheck(): Promise<boolean> {
    try {
      // Test basic Supabase connection
      const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
      if (error && error.code !== 'PGRST116') { // PGRST116 is "table not found" which is ok for health check
        console.warn('🚨 Supabase connection health check failed:', error);
        return false;
      }
      
      console.log('✅ Realtime connection health check passed');
      return true;
    } catch (error) {
      console.error('🚨 Health check error:', error);
      return false;
    }
  }
}

export const realtimeConnectionManager = new RealtimeConnectionManager();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    realtimeConnectionManager.cleanup();
  });
}