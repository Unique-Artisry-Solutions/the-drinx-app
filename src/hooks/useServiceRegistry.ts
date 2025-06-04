
import { useState, useEffect } from 'react';
import { serviceRegistry } from '@/services/ServiceRegistry';
import type { ServiceHealthStatus, ServiceMetrics } from '@/services/ServiceRegistry';

export interface ServiceRegistryState {
  isInitialized: boolean;
  healthStatus: ServiceHealthStatus[];
  metrics: Map<string, ServiceMetrics>;
  isLoading: boolean;
  error: string | null;
  registeredServices: string[];
}

export interface ServiceRegistryActions {
  getService: <T>(serviceName: string) => T | null;
  refreshData: () => Promise<void>;
  reinitialize: () => Promise<void>;
  registerService: (name: string, service: any) => void;
  unregisterService: (name: string) => boolean;
  isServiceRegistered: (name: string) => boolean;
}

export interface UseServiceRegistryReturn extends ServiceRegistryState, ServiceRegistryActions {
  state: ServiceRegistryState;
  actions: ServiceRegistryActions;
}

export function useServiceRegistry(): UseServiceRegistryReturn {
  const [state, setState] = useState<ServiceRegistryState>({
    isInitialized: false,
    healthStatus: [],
    metrics: new Map(),
    isLoading: true,
    error: null,
    registeredServices: []
  });

  useEffect(() => {
    initializeRegistry();
  }, []);

  const initializeRegistry = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      await serviceRegistry.initialize();
      
      const healthStatus = await serviceRegistry.getServiceHealth();
      const metrics = serviceRegistry.getServiceMetrics();
      const registeredServices = Array.from(serviceRegistry.getAllServices().keys());
      
      setState({
        isInitialized: true,
        healthStatus,
        metrics,
        registeredServices,
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
      const healthStatus = await serviceRegistry.getServiceHealth();
      const metrics = serviceRegistry.getServiceMetrics();
      const registeredServices = Array.from(serviceRegistry.getAllServices().keys());
      
      setState(prev => ({
        ...prev,
        healthStatus,
        metrics,
        registeredServices
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to refresh data'
      }));
    }
  };

  const reinitialize = async () => {
    await serviceRegistry.reinitialize();
    await initializeRegistry();
  };

  const registerService = (name: string, service: any) => {
    serviceRegistry.registerService(name, service);
    refreshData();
  };

  const unregisterService = (name: string): boolean => {
    const result = serviceRegistry.unregisterService(name);
    if (result) {
      refreshData();
    }
    return result;
  };

  const isServiceRegistered = (name: string): boolean => {
    return serviceRegistry.isServiceRegistered(name);
  };

  const actions: ServiceRegistryActions = {
    getService,
    refreshData,
    reinitialize,
    registerService,
    unregisterService,
    isServiceRegistered
  };

  return {
    ...state,
    ...actions,
    state,
    actions
  };
}
