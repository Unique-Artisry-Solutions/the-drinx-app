
import React, { createContext, useContext } from 'react';

/**
 * Provider factory that standardizes creation of context providers
 */
export function createProvider<T>(
  displayName: string,
  initialValue: T,
  useProviderHook: (initialValue: T) => T
) {
  const Context = createContext<T>(initialValue);
  Context.displayName = displayName;
  
  const Provider: React.FC<{
    children: React.ReactNode;
    initialValue?: T;
  }> = ({ children, initialValue: customInitialValue }) => {
    const value = useProviderHook(customInitialValue ?? initialValue);
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };
  
  const useContextHook = () => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${displayName} must be used within a ${displayName}Provider`);
    }
    return context;
  };
  
  return [Provider, useContextHook, Context] as const;
}

/**
 * Create a provider that shares its state across multiple instances
 * through a global registry
 */
export function createSharedProvider<T, K extends string>(
  displayName: string,
  initialValue: T,
  useProviderHook: (initialValue: T) => T,
  getSharedKey: () => K
) {
  // Global registry to share state across provider instances
  const globalRegistry = new Map<K, T>();
  
  const Context = createContext<T>(initialValue);
  Context.displayName = displayName;
  
  const Provider: React.FC<{
    children: React.ReactNode;
    initialValue?: T;
  }> = ({ children, initialValue: customInitialValue }) => {
    const sharedKey = getSharedKey();
    const value = useProviderHook(
      globalRegistry.get(sharedKey) ?? customInitialValue ?? initialValue
    );
    
    // Update the registry
    if (sharedKey) {
      globalRegistry.set(sharedKey, value);
    }
    
    return <Context.Provider value={value}>{children}</Context.Provider>;
  };
  
  const useContextHook = () => {
    const context = useContext(Context);
    if (context === undefined) {
      throw new Error(`use${displayName} must be used within a ${displayName}Provider`);
    }
    return context;
  };
  
  return [Provider, useContextHook, Context] as const;
}
