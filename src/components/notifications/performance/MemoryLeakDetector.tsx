import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Activity, TrendingUp, RefreshCw, Zap, Shield } from 'lucide-react';

interface MemorySnapshot {
  timestamp: number;
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  components: number;
  eventListeners: number;
  notificationSubscriptions: number;
}

interface LeakDetectionResult {
  isLeaking: boolean;
  severity: 'low' | 'medium' | 'high' | 'critical';
  growthRate: number;
  recommendations: string[];
  suspiciousComponents: string[];
}

class MemoryLeakDetectorService {
  private snapshots: MemorySnapshot[] = [];
  private componentCounts = new Map<string, number>();
  private eventListenerCounts = new Map<string, number>();
  private subscriptionCounts = new Map<string, number>();
  private readonly MAX_SNAPSHOTS = 100;
  private readonly LEAK_THRESHOLD = 1024 * 1024 * 10; // 10MB growth
  private cleanupFunctions = new Set<() => void>();

  takeSnapshot(): MemorySnapshot {
    const performance = (window as any).performance;
    const memory = performance?.memory;

    const snapshot: MemorySnapshot = {
      timestamp: Date.now(),
      usedJSHeapSize: memory?.usedJSHeapSize || 0,
      totalJSHeapSize: memory?.totalJSHeapSize || 0,
      jsHeapSizeLimit: memory?.jsHeapSizeLimit || 0,
      components: this.countReactComponents(),
      eventListeners: this.countEventListeners(),
      notificationSubscriptions: this.countNotificationSubscriptions()
    };

    this.snapshots.push(snapshot);
    
    // Keep only recent snapshots
    if (this.snapshots.length > this.MAX_SNAPSHOTS) {
      this.snapshots.shift();
    }

    return snapshot;
  }

  analyzeLeaks(): LeakDetectionResult {
    if (this.snapshots.length < 10) {
      return {
        isLeaking: false,
        severity: 'low',
        growthRate: 0,
        recommendations: ['Collect more data for accurate analysis'],
        suspiciousComponents: []
      };
    }

    const recent = this.snapshots.slice(-10);
    const oldest = recent[0];
    const newest = recent[recent.length - 1];
    
    const memoryGrowth = newest.usedJSHeapSize - oldest.usedJSHeapSize;
    const timeSpan = newest.timestamp - oldest.timestamp;
    const growthRate = memoryGrowth / (timeSpan / 1000); // bytes per second

    const componentGrowth = newest.components - oldest.components;
    const listenerGrowth = newest.eventListeners - oldest.eventListeners;
    const subscriptionGrowth = newest.notificationSubscriptions - oldest.notificationSubscriptions;

    let severity: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let isLeaking = false;
    const recommendations: string[] = [];
    const suspiciousComponents: string[] = [];

    // Analyze memory growth
    if (memoryGrowth > this.LEAK_THRESHOLD) {
      isLeaking = true;
      if (growthRate > 1024 * 1024) { // > 1MB/s
        severity = 'critical';
        recommendations.push('Critical memory leak detected - immediate action required');
      } else if (growthRate > 512 * 1024) { // > 512KB/s
        severity = 'high';
        recommendations.push('High memory growth rate detected');
      } else if (growthRate > 100 * 1024) { // > 100KB/s
        severity = 'medium';
        recommendations.push('Moderate memory growth detected');
      }
    }

    // Analyze component growth
    if (componentGrowth > 50) {
      isLeaking = true;
      recommendations.push('Excessive component creation - check for unmounted components');
      suspiciousComponents.push(`React Components (+${componentGrowth})`);
    }

    // Analyze event listener growth
    if (listenerGrowth > 20) {
      isLeaking = true;
      recommendations.push('Event listeners not being cleaned up properly');
      suspiciousComponents.push(`Event Listeners (+${listenerGrowth})`);
    }

    // Analyze subscription growth
    if (subscriptionGrowth > 10) {
      isLeaking = true;
      recommendations.push('Notification subscriptions not being cleaned up');
      suspiciousComponents.push(`Subscriptions (+${subscriptionGrowth})`);
    }

    // Memory pressure analysis
    if (newest.totalJSHeapSize > newest.jsHeapSizeLimit * 0.9) {
      severity = 'critical';
      recommendations.push('Approaching memory limit - immediate cleanup required');
    }

    return {
      isLeaking,
      severity,
      growthRate,
      recommendations,
      suspiciousComponents
    };
  }

  private countReactComponents(): number {
    // Rough estimate of React components in the DOM
    const elements = document.querySelectorAll('[data-reactroot], [data-react-component]');
    return elements.length || document.querySelectorAll('div').length;
  }

  private countEventListeners(): number {
    // This is a rough estimate - actual counting would require browser dev tools
    const estimate = document.querySelectorAll('[onclick], [onchange], [onsubmit]').length;
    return estimate + (this.eventListenerCounts.size * 2);
  }

  private countNotificationSubscriptions(): number {
    return this.subscriptionCounts.size;
  }

  registerComponent(name: string): () => void {
    const count = this.componentCounts.get(name) || 0;
    this.componentCounts.set(name, count + 1);

    return () => {
      const newCount = this.componentCounts.get(name) || 1;
      if (newCount <= 1) {
        this.componentCounts.delete(name);
      } else {
        this.componentCounts.set(name, newCount - 1);
      }
    };
  }

  registerEventListener(type: string): () => void {
    const count = this.eventListenerCounts.get(type) || 0;
    this.eventListenerCounts.set(type, count + 1);

    return () => {
      const newCount = this.eventListenerCounts.get(type) || 1;
      if (newCount <= 1) {
        this.eventListenerCounts.delete(type);
      } else {
        this.eventListenerCounts.set(type, newCount - 1);
      }
    };
  }

  registerSubscription(name: string): () => void {
    const count = this.subscriptionCounts.get(name) || 0;
    this.subscriptionCounts.set(name, count + 1);

    const cleanup = () => {
      const newCount = this.subscriptionCounts.get(name) || 1;
      if (newCount <= 1) {
        this.subscriptionCounts.delete(name);
      } else {
        this.subscriptionCounts.set(name, newCount - 1);
      }
    };

    this.cleanupFunctions.add(cleanup);
    return cleanup;
  }

  forceGarbageCollection(): void {
    if ('gc' in window) {
      (window as any).gc();
    } else {
      // Trigger potential GC by creating and discarding objects
      const arrays = [];
      for (let i = 0; i < 100; i++) {
        arrays.push(new Array(1000).fill(0));
      }
      arrays.length = 0;
    }
  }

  getSnapshots(): MemorySnapshot[] {
    return [...this.snapshots];
  }

  clearSnapshots(): void {
    this.snapshots.length = 0;
  }

  cleanup(): void {
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions.clear();
    this.componentCounts.clear();
    this.eventListenerCounts.clear();
    this.subscriptionCounts.clear();
  }
}

// Global instance
const memoryDetector = new MemoryLeakDetectorService();

const MemoryLeakDetectorComponent: React.FC = () => {
  const [snapshots, setSnapshots] = useState<MemorySnapshot[]>([]);
  const [analysis, setAnalysis] = useState<LeakDetectionResult | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [autoDetection, setAutoDetection] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const cleanup = memoryDetector.registerComponent('MemoryLeakDetector');
    return cleanup;
  }, []);

  useEffect(() => {
    if (autoDetection) {
      intervalRef.current = setInterval(() => {
        const snapshot = memoryDetector.takeSnapshot();
        setSnapshots(memoryDetector.getSnapshots());
        
        const newAnalysis = memoryDetector.analyzeLeaks();
        setAnalysis(newAnalysis);
        
        // Alert on critical leaks
        if (newAnalysis.severity === 'critical') {
          console.warn('Critical memory leak detected!', newAnalysis);
        }
      }, 5000); // Take snapshot every 5 seconds

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoDetection]);

  const handleTakeSnapshot = () => {
    const snapshot = memoryDetector.takeSnapshot();
    setSnapshots(memoryDetector.getSnapshots());
    setAnalysis(memoryDetector.analyzeLeaks());
  };

  const handleForceGC = () => {
    memoryDetector.forceGarbageCollection();
    setTimeout(handleTakeSnapshot, 1000); // Take snapshot after GC
  };

  const handleClearSnapshots = () => {
    memoryDetector.clearSnapshots();
    setSnapshots([]);
    setAnalysis(null);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      default: return 'green';
    }
  };

  const chartData = snapshots.map(snapshot => ({
    time: new Date(snapshot.timestamp).toLocaleTimeString(),
    memory: Math.round(snapshot.usedJSHeapSize / 1024 / 1024), // MB
    components: snapshot.components,
    listeners: snapshot.eventListeners
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Memory Leak Detection
          </CardTitle>
          <CardDescription>
            Monitor and detect memory leaks in notification system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="monitoring" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="monitoring">Live Monitoring</TabsTrigger>
              <TabsTrigger value="analysis">Leak Analysis</TabsTrigger>
              <TabsTrigger value="charts">Memory Charts</TabsTrigger>
            </TabsList>

            <TabsContent value="monitoring" className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={handleTakeSnapshot}
                  className="flex items-center gap-2"
                >
                  <Activity className="h-4 w-4" />
                  Take Snapshot
                </Button>
                <Button
                  onClick={() => setAutoDetection(!autoDetection)}
                  variant={autoDetection ? "destructive" : "default"}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  {autoDetection ? "Stop Auto Detection" : "Start Auto Detection"}
                </Button>
                <Button
                  onClick={handleForceGC}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Zap className="h-4 w-4" />
                  Force GC
                </Button>
                <Button
                  onClick={handleClearSnapshots}
                  variant="outline"
                >
                  Clear Data
                </Button>
              </div>

              {snapshots.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <Activity className="h-4 w-4 text-blue-500" />
                        <div className="text-sm font-medium">Memory Used</div>
                      </div>
                      <div className="text-2xl font-bold">
                        {formatBytes(snapshots[snapshots.length - 1]?.usedJSHeapSize || 0)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Limit: {formatBytes(snapshots[snapshots.length - 1]?.jsHeapSizeLimit || 0)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <div className="text-sm font-medium">Components</div>
                      </div>
                      <div className="text-2xl font-bold">
                        {snapshots[snapshots.length - 1]?.components || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Active components
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 text-purple-500" />
                        <div className="text-sm font-medium">Event Listeners</div>
                      </div>
                      <div className="text-2xl font-bold">
                        {snapshots[snapshots.length - 1]?.eventListeners || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Registered listeners
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-orange-500" />
                        <div className="text-sm font-medium">Subscriptions</div>
                      </div>
                      <div className="text-2xl font-bold">
                        {snapshots[snapshots.length - 1]?.notificationSubscriptions || 0}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Active subscriptions
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {snapshots.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Memory Usage Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Memory Used</span>
                        <span>
                          {((snapshots[snapshots.length - 1]?.usedJSHeapSize || 0) / (snapshots[snapshots.length - 1]?.jsHeapSizeLimit || 1) * 100).toFixed(1)}%
                        </span>
                      </div>
                      <Progress 
                        value={(snapshots[snapshots.length - 1]?.usedJSHeapSize || 0) / (snapshots[snapshots.length - 1]?.jsHeapSizeLimit || 1) * 100} 
                        className="h-2" 
                      />
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analysis" className="space-y-4">
              {analysis ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Leak Analysis Results</h3>
                    <Badge variant={analysis.isLeaking ? 'destructive' : 'default'}>
                      {analysis.isLeaking ? 'LEAK DETECTED' : 'NO LEAKS'}
                    </Badge>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className={`h-5 w-5 text-${getSeverityColor(analysis.severity)}-500`} />
                        Severity: {analysis.severity.toUpperCase()}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="text-sm">
                          <strong>Growth Rate:</strong> {formatBytes(analysis.growthRate)}/second
                        </div>
                        {analysis.suspiciousComponents.length > 0 && (
                          <div className="text-sm">
                            <strong>Suspicious Components:</strong>
                            <ul className="list-disc list-inside ml-4">
                              {analysis.suspiciousComponents.map((component, index) => (
                                <li key={index}>{component}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {analysis.recommendations.map((recommendation, index) => (
                          <Alert key={index} variant={analysis.severity === 'critical' ? 'destructive' : 'default'}>
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{recommendation}</AlertDescription>
                          </Alert>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No analysis available yet. Take some snapshots to begin leak detection.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="charts" className="space-y-4">
              {chartData.length > 0 ? (
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Memory Usage Over Time</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="memory" 
                            stroke="#8884d8" 
                            name="Memory (MB)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Component & Listener Growth</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Line 
                            type="monotone" 
                            dataKey="components" 
                            stroke="#82ca9d" 
                            name="Components"
                          />
                          <Line 
                            type="monotone" 
                            dataKey="listeners" 
                            stroke="#ffc658" 
                            name="Event Listeners"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center text-muted-foreground">
                      <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>No chart data available. Start monitoring to see memory trends.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MemoryLeakDetectorComponent;
export { memoryDetector };
