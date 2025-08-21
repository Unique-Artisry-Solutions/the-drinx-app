import React, { useEffect, useState } from 'react';
import { useSessionStability } from '@/hooks/useSessionStability';

interface PerformanceMetrics {
  loadTime: number;
  memoryUsage: number;
  connectionType: string;
  renderCount: number;
  lastRenderTime: number;
}

/**
 * Development performance monitoring component
 */
export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    memoryUsage: 0,
    connectionType: 'unknown',
    renderCount: 0,
    lastRenderTime: Date.now()
  });
  
  const sessionStability = useSessionStability();
  const [isVisible, setIsVisible] = useState(false);

  // Update render metrics
  useEffect(() => {
    setMetrics(prev => ({
      ...prev,
      renderCount: prev.renderCount + 1,
      lastRenderTime: Date.now()
    }));
  });

  // Initialize performance metrics
  useEffect(() => {
    const updateMetrics = () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const memory = (performance as any).memory;
      const connection = (navigator as any).connection;

      setMetrics(prev => ({
        ...prev,
        loadTime: navigation ? navigation.loadEventEnd - navigation.fetchStart : 0,
        memoryUsage: memory ? memory.usedJSHeapSize / 1024 / 1024 : 0,
        connectionType: connection ? connection.effectiveType : 'unknown'
      }));
    };

    updateMetrics();
    const interval = setInterval(updateMetrics, 5000);

    return () => clearInterval(interval);
  }, []);

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <>
      {/* Toggle button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-4 right-4 z-50 bg-orange-500 text-white p-2 rounded-full shadow-lg hover:bg-orange-600 transition-colors"
        title="Performance Monitor"
      >
        📊
      </button>

      {/* Performance panel */}
      {isVisible && (
        <div className="fixed bottom-16 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-xl p-4 w-80 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              Performance Monitor
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-sm">
            {/* Session Stability */}
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Session:</strong>
              <div className={`ml-2 ${sessionStability.isStable ? 'text-green-600' : 'text-red-600'}`}>
                {sessionStability.isStable ? '✅ Stable' : '❌ Unstable'}
              </div>
              {sessionStability.lastValidation && (
                <div className="ml-2 text-gray-600 dark:text-gray-400 text-xs">
                  Last check: {sessionStability.lastValidation.toLocaleTimeString()}
                </div>
              )}
              {sessionStability.errors.length > 0 && (
                <div className="ml-2 text-red-600 text-xs">
                  Errors: {sessionStability.errors.length}
                </div>
              )}
            </div>

            {/* Performance Metrics */}
            <div>
              <strong className="text-gray-700 dark:text-gray-300">Performance:</strong>
              <div className="ml-2 space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div>Load Time: {Math.round(metrics.loadTime)}ms</div>
                <div>Memory: {Math.round(metrics.memoryUsage)}MB</div>
                <div>Connection: {metrics.connectionType}</div>
                <div>Renders: {metrics.renderCount}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="border-t pt-3">
              <button
                onClick={() => sessionStability.validateSession()}
                disabled={sessionStability.isValidating}
                className="w-full px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {sessionStability.isValidating ? 'Validating...' : 'Force Session Check'}
              </button>
            </div>

            {/* Dev Tools */}
            <div className="border-t pt-3 text-xs text-gray-500 dark:text-gray-400">
              <div>Env: {process.env.NODE_ENV}</div>
              <div>Host: {window.location.hostname}</div>
              <div>Route: {window.location.pathname}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PerformanceMonitor;