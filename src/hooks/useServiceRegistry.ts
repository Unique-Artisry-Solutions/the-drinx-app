
import { useState, useEffect } from 'react';
import { serviceRegistry, type ServiceHealthStatus, type ServiceMetrics } from '@/services/ServiceRegistry';

export interface ServiceRegistryState {
  isInitialized: boolean;
  healthStatus: ServiceHealthStatus[];
  metrics: Map<string, ServiceMetrics>;
  isLoading: boolean;
  error: string | null;
}

export function useServiceRegistry() {
  const [state, setState] = useState<ServiceRegistryState>({
    isInitialized: false,
    healthStatus: [],
    metrics: new Map(),
    isLoading: true,
    error: null
  });

  useEffect(() => {
    initializeRegistry();
  }, []);

  const initializeRegistry = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await serviceRegistry.initialize();
      
      const healthStatus = serviceRegistry.getServiceHealth();
      const metrics = serviceRegistry.getServiceMetrics() as Map<string, ServiceMetrics>;
      
      setState({
        isInitialized: true,
        healthStatus,
        metrics,
        isLoading: false,
        error: null
      });
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Failed to initialize service registry'
      }));
    }
  };

  const getService = <T>(serviceName: string): T | null => {
    return serviceRegistry.getService<T>(serviceName);
  };

  const refreshData = async () => {
    try {
      const healthStatus = serviceRegistry.getServiceHealth();
      const metrics = serviceRegistry.getServiceMetrics() as Map<string, ServiceMetrics>;
      
      setState(prev => ({
        ...prev,
        healthStatus,
        metrics
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to refresh data'
      }));
    }
  };

  return {
    ...state,
    getService,
    refreshData,
    reinitialize: initializeRegistry
  };
}
