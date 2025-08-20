import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Database, RefreshCw, Trash2, Settings, TrendingUp, AlertCircle } from 'lucide-react';

interface CacheStats {
  totalEntries: number;
  hitRate: number;
  missRate: number;
  cacheSize: number;
  lastCleared: string | null;
  memoryUsage: number;
}

interface CacheEntry {
  key: string;
  value: any;
  timestamp: number;
  ttl: number;
  hits: number;
  size: number;
}

class NotificationCacheManager {
  private cache = new Map<string, CacheEntry>();
  private stats: CacheStats = {
    totalEntries: 0,
    hitRate: 0,
    missRate: 0,
    cacheSize: 0,
    lastCleared: null,
    memoryUsage: 0
  };
  private totalRequests = 0;
  private totalHits = 0;
  private maxSize = 1000; // Maximum number of entries
  private defaultTTL = 300000; // 5 minutes

  set(key: string, value: any, ttl = this.defaultTTL): void {
    // Remove expired entries if cache is full
    if (this.cache.size >= this.maxSize) {
      this.cleanupExpired();
      if (this.cache.size >= this.maxSize) {
        // Remove oldest entries
        const entries = Array.from(this.cache.entries())
          .sort((a, b) => a[1].timestamp - b[1].timestamp);
        const toRemove = Math.floor(this.maxSize * 0.1); // Remove 10%
        for (let i = 0; i < toRemove; i++) {
          this.cache.delete(entries[i][0]);
        }
      }
    }

    const entry: CacheEntry = {
      key,
      value,
      timestamp: Date.now(),
      ttl,
      hits: 0,
      size: this.calculateSize(value)
    };

    this.cache.set(key, entry);
    this.updateStats();
  }

  get(key: string): any | null {
    this.totalRequests++;
    const entry = this.cache.get(key);

    if (!entry) {
      this.updateStats();
      return null;
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      this.updateStats();
      return null;
    }

    entry.hits++;
    this.totalHits++;
    this.updateStats();
    return entry.value;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }
    return true;
  }

  delete(key: string): boolean {
    const result = this.cache.delete(key);
    this.updateStats();
    return result;
  }

  clear(): void {
    this.cache.clear();
    this.stats.lastCleared = new Date().toISOString();
    this.totalRequests = 0;
    this.totalHits = 0;
    this.updateStats();
  }

  cleanupExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
    this.updateStats();
  }

  getStats(): CacheStats {
    return { ...this.stats };
  }

  getAllEntries(): CacheEntry[] {
    return Array.from(this.cache.values())
      .sort((a, b) => b.hits - a.hits); // Sort by most accessed
  }

  setMaxSize(size: number): void {
    this.maxSize = size;
  }

  setDefaultTTL(ttl: number): void {
    this.defaultTTL = ttl;
  }

  private calculateSize(value: any): number {
    try {
      return JSON.stringify(value).length;
    } catch {
      return 0;
    }
  }

  private updateStats(): void {
    const totalSize = Array.from(this.cache.values())
      .reduce((sum, entry) => sum + entry.size, 0);

    this.stats = {
      totalEntries: this.cache.size,
      hitRate: this.totalRequests > 0 ? (this.totalHits / this.totalRequests) * 100 : 0,
      missRate: this.totalRequests > 0 ? ((this.totalRequests - this.totalHits) / this.totalRequests) * 100 : 0,
      cacheSize: totalSize,
      lastCleared: this.stats.lastCleared,
      memoryUsage: this.estimateMemoryUsage()
    };
  }

  private estimateMemoryUsage(): number {
    // Rough estimate of memory usage in bytes
    return this.cache.size * 100 + this.stats.cacheSize; // Overhead + data
  }
}

// Global cache instance
const notificationCache = new NotificationCacheManager();

const NotificationCache: React.FC = () => {
  const [stats, setStats] = useState<CacheStats>(notificationCache.getStats());
  const [entries, setEntries] = useState<CacheEntry[]>([]);
  const [maxSize, setMaxSize] = useState(1000);
  const [defaultTTL, setDefaultTTL] = useState(300);
  const [autoCleanup, setAutoCleanup] = useState(true);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    const updateData = () => {
      setStats(notificationCache.getStats());
      setEntries(notificationCache.getAllEntries());
    };

    updateData();
    const interval = setInterval(updateData, 2000); // Update every 2 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    notificationCache.setMaxSize(maxSize);
  }, [maxSize]);

  useEffect(() => {
    notificationCache.setDefaultTTL(defaultTTL * 1000); // Convert to milliseconds
  }, [defaultTTL]);

  useEffect(() => {
    if (!autoCleanup) return;

    const cleanup = () => {
      notificationCache.cleanupExpired();
    };

    const interval = setInterval(cleanup, 60000); // Cleanup every minute
    return () => clearInterval(interval);
  }, [autoCleanup]);

  const handleClearCache = async () => {
    setIsClearing(true);
    // Add slight delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));
    notificationCache.clear();
    setIsClearing(false);
  };

  const handleManualCleanup = () => {
    notificationCache.cleanupExpired();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getHealthStatus = () => {
    if (stats.hitRate > 80) return { status: 'excellent', color: 'green' };
    if (stats.hitRate > 60) return { status: 'good', color: 'blue' };
    if (stats.hitRate > 40) return { status: 'fair', color: 'yellow' };
    return { status: 'poor', color: 'red' };
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Notification Cache Management
          </CardTitle>
          <CardDescription>
            Monitor and manage notification caching for optimal performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="entries">Cache Entries</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-blue-500" />
                      <div className="text-sm font-medium">Total Entries</div>
                    </div>
                    <div className="text-2xl font-bold">{stats.totalEntries}</div>
                    <div className="text-xs text-muted-foreground">
                      Max: {maxSize}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <div className="text-sm font-medium">Hit Rate</div>
                    </div>
                    <div className="text-2xl font-bold">{stats.hitRate.toFixed(1)}%</div>
                    <Badge variant={getHealthStatus().status === 'excellent' ? 'default' : 'secondary'}>
                      {getHealthStatus().status}
                    </Badge>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-500" />
                      <div className="text-sm font-medium">Cache Size</div>
                    </div>
                    <div className="text-2xl font-bold">{formatBytes(stats.cacheSize)}</div>
                    <div className="text-xs text-muted-foreground">
                      Memory: {formatBytes(stats.memoryUsage)}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-purple-500" />
                      <div className="text-sm font-medium">Miss Rate</div>
                    </div>
                    <div className="text-2xl font-bold">{stats.missRate.toFixed(1)}%</div>
                    <div className="text-xs text-muted-foreground">
                      {stats.lastCleared ? `Cleared: ${formatTime(new Date(stats.lastCleared).getTime())}` : 'Never cleared'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cache Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Entries Used</span>
                      <span>{stats.totalEntries} / {maxSize}</span>
                    </div>
                    <Progress value={(stats.totalEntries / maxSize) * 100} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button 
                  onClick={handleClearCache}
                  disabled={isClearing}
                  variant="destructive"
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  {isClearing ? "Clearing..." : "Clear All Cache"}
                </Button>
                <Button 
                  onClick={handleManualCleanup}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Cleanup Expired
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="entries" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Cache Entries</h3>
                <Badge variant="outline">{entries.length} entries</Badge>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {entries.length === 0 ? (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center text-muted-foreground">
                        <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>No cache entries found</p>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  entries.map((entry, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium truncate">{entry.key}</div>
                            <div className="text-sm text-muted-foreground">
                              Created: {formatTime(entry.timestamp)} • 
                              Hits: {entry.hits} • 
                              Size: {formatBytes(entry.size)}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              TTL: {Math.max(0, Math.floor((entry.ttl - (Date.now() - entry.timestamp)) / 1000))}s
                            </Badge>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => notificationCache.delete(entry.key)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="maxSize">Maximum Cache Size</Label>
                    <Input
                      id="maxSize"
                      type="number"
                      value={maxSize}
                      onChange={(e) => setMaxSize(parseInt(e.target.value))}
                      min="100"
                      max="10000"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Maximum number of entries to store
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="defaultTTL">Default TTL (seconds)</Label>
                    <Input
                      id="defaultTTL"
                      type="number"
                      value={defaultTTL}
                      onChange={(e) => setDefaultTTL(parseInt(e.target.value))}
                      min="30"
                      max="3600"
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Default time-to-live for cache entries
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="autoCleanup">Auto Cleanup</Label>
                      <div className="text-xs text-muted-foreground">
                        Automatically remove expired entries
                      </div>
                    </div>
                    <Switch
                      id="autoCleanup"
                      checked={autoCleanup}
                      onCheckedChange={setAutoCleanup}
                    />
                  </div>

                  <Alert>
                    <Settings className="h-4 w-4" />
                    <AlertDescription>
                      Changes to cache settings take effect immediately. 
                      Reducing max size may cause immediate cleanup.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Hit/Miss Ratio</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Hit Rate</span>
                          <span>{stats.hitRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={stats.hitRate} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span>Miss Rate</span>
                          <span>{stats.missRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={stats.missRate} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Memory Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold">
                        {formatBytes(stats.memoryUsage)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Data: {formatBytes(stats.cacheSize)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Overhead: {formatBytes(stats.memoryUsage - stats.cacheSize)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Recommendations</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {stats.hitRate < 50 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Low hit rate detected. Consider increasing cache size or TTL.
                        </AlertDescription>
                      </Alert>
                    )}
                    {stats.totalEntries > maxSize * 0.9 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Cache is nearly full. Consider increasing max size.
                        </AlertDescription>
                      </Alert>
                    )}
                    {stats.memoryUsage > 10 * 1024 * 1024 && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          High memory usage detected. Consider clearing cache or reducing TTL.
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCache;
export { notificationCache };