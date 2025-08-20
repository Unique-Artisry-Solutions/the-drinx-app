import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.0"
import { getSecurityConfig, getCorsHeaders, isOriginAllowed } from '../_shared/security.ts'
import { enforceRateLimit } from '../_shared/rateLimit.ts'
import { sanitizeObject } from '../_shared/sanitize.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
const admin = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

// Enhanced notification batching system
class NotificationBatcher {
  private batches = new Map<string, any[]>();
  private timers = new Map<string, number>();
  private readonly BATCH_SIZE = 50;
  private readonly BATCH_TIMEOUT = 5000; // 5 seconds

  addToBatch(userId: string, notification: any) {
    if (!this.batches.has(userId)) {
      this.batches.set(userId, []);
    }
    
    const batch = this.batches.get(userId)!;
    batch.push(notification);

    // Process batch if it reaches size limit
    if (batch.length >= this.BATCH_SIZE) {
      this.processBatch(userId);
      return;
    }

    // Set timer for batch processing
    if (!this.timers.has(userId)) {
      const timer = setTimeout(() => {
        this.processBatch(userId);
      }, this.BATCH_TIMEOUT);
      this.timers.set(userId, timer);
    }
  }

  private async processBatch(userId: string) {
    const batch = this.batches.get(userId);
    if (!batch || batch.length === 0) return;

    try {
      // Insert batch of notifications
      const { data, error } = await admin
        .from('notifications')
        .insert(batch)
        .select();

      if (error) throw error;

      // Send real-time broadcast
      await admin.channel('notifications')
        .send({
          type: 'broadcast',
          event: 'batch_notifications',
          payload: {
            userId,
            notifications: data,
            count: data?.length || 0
          }
        });

      console.log(`Processed batch of ${batch.length} notifications for user ${userId}`);
    } catch (error) {
      console.error('Error processing notification batch:', error);
      // Log error for monitoring
      await this.logError('batch_processing_error', { userId, batchSize: batch.length, error: error.message });
    } finally {
      // Clean up
      this.batches.delete(userId);
      const timer = this.timers.get(userId);
      if (timer) {
        clearTimeout(timer);
        this.timers.delete(userId);
      }
    }
  }

  private async logError(type: string, details: any) {
    try {
      await admin.from('notification_system_logs').insert({
        log_type: type,
        severity: 'error',
        details,
        timestamp: new Date().toISOString()
      });
    } catch (logError) {
      console.error('Failed to log error:', logError);
    }
  }

  // Force process all pending batches
  async flushAllBatches() {
    const userIds = Array.from(this.batches.keys());
    await Promise.all(userIds.map(userId => this.processBatch(userId)));
  }
}

// Throttling system for preventing notification spam
class NotificationThrottler {
  private userLimits = new Map<string, { count: number; resetTime: number }>();
  private readonly HOURLY_LIMIT = 100;
  private readonly RESET_INTERVAL = 3600000; // 1 hour

  canSendNotification(userId: string): boolean {
    const now = Date.now();
    const userLimit = this.userLimits.get(userId) || { count: 0, resetTime: now + this.RESET_INTERVAL };

    // Reset if time expired
    if (now > userLimit.resetTime) {
      userLimit.count = 0;
      userLimit.resetTime = now + this.RESET_INTERVAL;
    }

    // Check if under limit
    if (userLimit.count >= this.HOURLY_LIMIT) {
      return false;
    }

    // Increment count
    userLimit.count++;
    this.userLimits.set(userId, userLimit);
    return true;
  }

  getRemainingQuota(userId: string): number {
    const userLimit = this.userLimits.get(userId);
    if (!userLimit || Date.now() > userLimit.resetTime) {
      return this.HOURLY_LIMIT;
    }
    return Math.max(0, this.HOURLY_LIMIT - userLimit.count);
  }
}

// Performance monitoring
class PerformanceMonitor {
  private metrics = {
    requestCount: 0,
    errorCount: 0,
    avgResponseTime: 0,
    lastHour: { requests: 0, errors: 0 }
  };

  recordRequest(responseTime: number, isError = false) {
    this.metrics.requestCount++;
    this.metrics.avgResponseTime = (this.metrics.avgResponseTime + responseTime) / 2;
    
    if (isError) {
      this.metrics.errorCount++;
    }
  }

  async logMetrics() {
    try {
      await admin.from('notification_system_metrics').insert({
        request_count: this.metrics.requestCount,
        error_count: this.metrics.errorCount,
        avg_response_time: this.metrics.avgResponseTime,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log metrics:', error);
    }
  }

  getHealthStatus() {
    const errorRate = this.metrics.requestCount > 0 ? (this.metrics.errorCount / this.metrics.requestCount) : 0;
    return {
      healthy: errorRate < 0.05 && this.metrics.avgResponseTime < 1000,
      errorRate,
      avgResponseTime: this.metrics.avgResponseTime,
      totalRequests: this.metrics.requestCount
    };
  }
}

// Initialize systems
const batcher = new NotificationBatcher();
const throttler = new NotificationThrottler();
const monitor = new PerformanceMonitor();

serve(async (req) => {
  const startTime = Date.now();
  const origin = req.headers.get('origin');
  const config = getSecurityConfig();
  const cors = getCorsHeaders(origin, config);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: cors });
  }
  
  if (!isOriginAllowed(origin, config)) {
    monitor.recordRequest(Date.now() - startTime, true);
    return createErrorResponse('Origin not allowed', 403, cors);
  }

  try {
    // Rate limiting
    const rate = await enforceRateLimit(req, 'notifications-realtime', { userLimit: 30, ipLimit: 100, windowSeconds: 60 });
    if (!rate.allowed) {
      monitor.recordRequest(Date.now() - startTime, true);
      return createErrorResponse('Rate limit exceeded', 429, cors);
    }

    const raw = await req.json();
    const clean = sanitizeObject(raw);
    const { action, params } = clean;
    
    switch (action) {
      case 'sendRealtimeNotification':
        return await handleRealtimeNotification(params, cors, startTime);
      
      case 'batchNotifications':
        return await handleBatchNotifications(params, cors, startTime);
      
      case 'getSystemMetrics':
        return await handleGetSystemMetrics(cors, startTime);
      
      case 'healthCheck':
        return await handleHealthCheck(cors, startTime);
      
      case 'flushBatches':
        return await handleFlushBatches(cors, startTime);
      
      default:
        monitor.recordRequest(Date.now() - startTime, true);
        return createErrorResponse('Invalid action', 400, cors);
    }
  } catch (error) {
    monitor.recordRequest(Date.now() - startTime, true);
    console.error('Unexpected error:', error);
    return createErrorResponse('Internal server error', 500, cors);
  }
});

async function handleRealtimeNotification(params: any, cors: Record<string, string>, startTime: number) {
  try {
    const { userId, title, content, priority = 'medium', metadata = {} } = params;
    
    if (!userId || !title || !content) {
      monitor.recordRequest(Date.now() - startTime, true);
      return createErrorResponse('Missing required fields', 400, cors);
    }

    // Check throttling
    if (!throttler.canSendNotification(userId)) {
      monitor.recordRequest(Date.now() - startTime, true);
      return createErrorResponse('User notification quota exceeded', 429, cors);
    }

    // Create notification object
    const notification = {
      recipient_id: userId,
      title,
      content,
      priority,
      metadata: { ...metadata, realtime: true },
      created_at: new Date().toISOString(),
      is_read: false
    };

    // Add to batch for processing
    batcher.addToBatch(userId, notification);

    // Send immediate real-time notification for high priority
    if (priority === 'high' || priority === 'urgent') {
      await admin.channel('notifications')
        .send({
          type: 'broadcast',
          event: 'urgent_notification',
          payload: { userId, notification }
        });
    }

    monitor.recordRequest(Date.now() - startTime);
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Notification queued for delivery',
        remainingQuota: throttler.getRemainingQuota(userId)
      }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    monitor.recordRequest(Date.now() - startTime, true);
    return createErrorResponse(`Error sending notification: ${error.message}`, 500, cors);
  }
}

async function handleBatchNotifications(params: any, cors: Record<string, string>, startTime: number) {
  try {
    const { notifications } = params;
    
    if (!Array.isArray(notifications) || notifications.length === 0) {
      monitor.recordRequest(Date.now() - startTime, true);
      return createErrorResponse('Invalid notifications array', 400, cors);
    }

    // Group notifications by user
    const userGroups = new Map<string, any[]>();
    for (const notification of notifications) {
      if (!notification.recipient_id) continue;
      
      if (!userGroups.has(notification.recipient_id)) {
        userGroups.set(notification.recipient_id, []);
      }
      userGroups.get(notification.recipient_id)!.push(notification);
    }

    // Add each user's notifications to batch
    for (const [userId, userNotifications] of userGroups) {
      for (const notification of userNotifications) {
        if (throttler.canSendNotification(userId)) {
          batcher.addToBatch(userId, notification);
        }
      }
    }

    monitor.recordRequest(Date.now() - startTime);
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Queued ${notifications.length} notifications for batch processing`
      }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    monitor.recordRequest(Date.now() - startTime, true);
    return createErrorResponse(`Error processing batch: ${error.message}`, 500, cors);
  }
}

async function handleGetSystemMetrics(cors: Record<string, string>, startTime: number) {
  try {
    const health = monitor.getHealthStatus();
    
    monitor.recordRequest(Date.now() - startTime);
    return new Response(
      JSON.stringify({ 
        status: 'ok',
        health,
        timestamp: new Date().toISOString()
      }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    monitor.recordRequest(Date.now() - startTime, true);
    return createErrorResponse(`Error getting metrics: ${error.message}`, 500, cors);
  }
}

async function handleHealthCheck(cors: Record<string, string>, startTime: number) {
  try {
    const health = monitor.getHealthStatus();
    
    monitor.recordRequest(Date.now() - startTime);
    return new Response(
      JSON.stringify({ 
        status: health.healthy ? 'healthy' : 'degraded',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        metrics: health
      }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    monitor.recordRequest(Date.now() - startTime, true);
    return createErrorResponse(`Health check failed: ${error.message}`, 500, cors);
  }
}

async function handleFlushBatches(cors: Record<string, string>, startTime: number) {
  try {
    await batcher.flushAllBatches();
    
    monitor.recordRequest(Date.now() - startTime);
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'All pending batches flushed'
      }),
      { headers: { ...cors, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    monitor.recordRequest(Date.now() - startTime, true);
    return createErrorResponse(`Error flushing batches: ${error.message}`, 500, cors);
  }
}

function createErrorResponse(message: string, status = 400, cors: Record<string, string>) {
  console.error('Error:', message);
  return new Response(
    JSON.stringify({ error: message }),
    {
      status,
      headers: { ...cors, 'Content-Type': 'application/json' },
    }
  );
}

// Periodic metrics logging (every 5 minutes)
setInterval(() => {
  monitor.logMetrics();
}, 300000);