
import { useState, useEffect } from 'react';

interface EnhancedSystemData {
  performanceMetrics: {
    cpuUsage: number;
    memoryUsage: number;
    responseTime: number;
    uptime: number;
    errorRate: number;
  };
  userEngagement: {
    activeUsers: number;
    sessionDuration: number;
    pageViews: number;
    bounceRate: number;
  };
  qualityMetrics: {
    codeQuality: number;
    testCoverage: number;
    securityScore: number;
    performanceScore: number;
  };
  resourceData: {
    developers: number;
    infrastructure: number;
    budget: number;
    capacity: number;
  };
  dependencies: {
    total: number;
    outdated: number;
    vulnerable: number;
    critical: number;
  };
  technicalDebt: {
    score: number;
    items: number;
    estimated_hours: number;
  };
  changeImpact: {
    high: number;
    medium: number;
    low: number;
  };
  riskFactors: {
    security: number;
    performance: number;
    maintainability: number;
    scalability: number;
  };
  complianceItems: {
    total: number;
    compliant: number;
    pending: number;
    failed: number;
  };
  earlyWarnings: {
    critical: number;
    warning: number;
    info: number;
  };
}

export function useEnhancedSystemData() {
  const [data, setData] = useState<EnhancedSystemData>({
    performanceMetrics: {
      cpuUsage: 45,
      memoryUsage: 68,
      responseTime: 120,
      uptime: 99.8,
      errorRate: 0.02
    },
    userEngagement: {
      activeUsers: 1247,
      sessionDuration: 420,
      pageViews: 8934,
      bounceRate: 23.5
    },
    qualityMetrics: {
      codeQuality: 87,
      testCoverage: 72,
      securityScore: 94,
      performanceScore: 89
    },
    resourceData: {
      developers: 8,
      infrastructure: 12,
      budget: 85000,
      capacity: 78
    },
    dependencies: {
      total: 342,
      outdated: 23,
      vulnerable: 2,
      critical: 0
    },
    technicalDebt: {
      score: 73,
      items: 45,
      estimated_hours: 120
    },
    changeImpact: {
      high: 12,
      medium: 34,
      low: 89
    },
    riskFactors: {
      security: 15,
      performance: 8,
      maintainability: 22,
      scalability: 5
    },
    complianceItems: {
      total: 156,
      compliant: 142,
      pending: 12,
      failed: 2
    },
    earlyWarnings: {
      critical: 0,
      warning: 3,
      info: 8
    }
  });

  const [isLoading, setIsLoading] = useState(true);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate some random variations to simulate real data
    setData(prevData => ({
      ...prevData,
      performanceMetrics: {
        ...prevData.performanceMetrics,
        cpuUsage: Math.floor(Math.random() * 30) + 40,
        memoryUsage: Math.floor(Math.random() * 20) + 60,
        responseTime: Math.floor(Math.random() * 50) + 100
      },
      userEngagement: {
        ...prevData.userEngagement,
        activeUsers: Math.floor(Math.random() * 500) + 1000,
        pageViews: Math.floor(Math.random() * 2000) + 8000
      }
    }));
    
    setIsLoading(false);
  };

  useEffect(() => {
    refreshData();
  }, []);

  return {
    data,
    isLoading,
    refreshData
  };
}
