
// Phase 3 Alternative: Migration Utilities
// Provides optional migration helpers for components that want to adopt new patterns

import { isolatedServiceRegistry } from '../registry/IsolatedServiceRegistry';
import { useCompatibleAuth } from '../compatibility/AuthCompatibilityWrapper';
import { safeTypeGuards, safeTypeConverters } from '../../utils/typeEnhancements';

// Migration helper for auth hooks
export const authMigrationUtils = {
  // Migrate from old auth pattern to new compatible pattern
  migrateAuthUsage: (component: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Migration] ${component} can now use useCompatibleAuth() for enhanced auth features`);
    }
    return useCompatibleAuth();
  },
  
  // Check if component is using old auth pattern
  detectOldAuthPattern: (authResult: any): boolean => {
    return authResult && !safeTypeGuards.hasProperty(authResult, 'state') && !safeTypeGuards.hasProperty(authResult, 'actions');
  },
  
  // Suggest migration for components
  suggestMigration: (componentName: string, currentPattern: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[Migration Suggestion] ${componentName} is using ${currentPattern}. Consider migrating to useCompatibleAuth() for enhanced features.`);
    }
  }
};

// Migration helper for service registration
export const serviceMigrationUtils = {
  // Gradually migrate services to new registry
  migrateToRegistry: <T>(serviceName: string, service: T, migrate: boolean = false): T => {
    if (migrate && !isolatedServiceRegistry.hasService(serviceName)) {
      isolatedServiceRegistry.registerService(serviceName, service);
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`[Migration] Service ${serviceName} registered in isolated registry`);
      }
    }
    
    // Always return original service to maintain functionality
    return service;
  },
  
  // Check migration status
  getMigrationStatus: () => {
    const registeredServices = isolatedServiceRegistry.getServiceNames();
    const metrics = isolatedServiceRegistry.getRegistryMetrics();
    
    return {
      registeredServices,
      totalRegistered: registeredServices.length,
      registryMetrics: metrics,
      migrationComplete: false // Always false for gradual migration
    };
  }
};

// Type migration utilities
export const typeMigrationUtils = {
  // Migrate unsafe type usage to safe alternatives
  migrateTypeUsage: <T>(value: unknown, validator: (v: unknown) => v is T, fallback: T): T => {
    if (validator(value)) {
      return value;
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.warn('[Type Migration] Unsafe type usage detected, using fallback:', { value, fallback });
    }
    
    return fallback;
  },
  
  // Suggest type improvements
  suggestTypeImprovement: (componentName: string, typeIssue: string) => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`[Type Suggestion] ${componentName}: ${typeIssue}. Consider using safeTypeGuards or safeTypeConverters.`);
    }
  }
};

// Overall migration status checker
export const migrationStatusChecker = {
  // Check what can be migrated in current codebase
  checkMigrationOpportunities: () => {
    const authStatus = authMigrationUtils.detectOldAuthPattern;
    const serviceStatus = serviceMigrationUtils.getMigrationStatus();
    
    return {
      auth: {
        canMigrate: true,
        impact: 'low',
        benefits: ['Enhanced type safety', 'Better error handling', 'Unified interface']
      },
      services: {
        canMigrate: true,
        impact: 'none', // Isolated implementation
        benefits: ['Service monitoring', 'Health checks', 'Centralized management']
      },
      types: {
        canMigrate: true,
        impact: 'low',
        benefits: ['Runtime safety', 'Better validation', 'Reduced errors']
      }
    };
  },
  
  // Generate migration plan for specific component
  generateMigrationPlan: (componentName: string) => {
    return {
      component: componentName,
      steps: [
        {
          step: 1,
          action: 'Import useCompatibleAuth',
          impact: 'none',
          reversible: true
        },
        {
          step: 2,
          action: 'Add service registry integration (optional)',
          impact: 'none',
          reversible: true
        },
        {
          step: 3,
          action: 'Enhance type safety (optional)',
          impact: 'low',
          reversible: true
        }
      ],
      estimatedEffort: 'minimal',
      rollbackPlan: 'Simply revert imports - no breaking changes'
    };
  }
};
