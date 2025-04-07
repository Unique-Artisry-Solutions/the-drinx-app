
import { useState, useEffect } from 'react';

interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  returningVisitors: number;
  hasData: boolean;
}

export const useVisitorStats = () => {
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    totalVisits: 0,
    uniqueVisitors: 0,
    returningVisitors: 0,
    hasData: true
  });
  
  useEffect(() => {
    // Simulating API call to fetch visitor stats
    setTimeout(() => {
      // Using consistent data availability instead of random
      const hasData = true;
      
      setVisitorStats({
        totalVisits: hasData ? 278 : 0,
        uniqueVisitors: hasData ? 153 : 0,
        returningVisitors: hasData ? 62 : 0,
        hasData
      });
    }, 500);
  }, []);

  return visitorStats;
};
