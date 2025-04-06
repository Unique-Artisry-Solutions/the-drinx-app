
import { useState, useEffect } from 'react';

interface VisitorStats {
  totalVisits: number;
  uniqueVisitors: number;
  returningVisitors: number;
}

export const useVisitorStats = () => {
  const [visitorStats, setVisitorStats] = useState<VisitorStats>({
    totalVisits: 0,
    uniqueVisitors: 0,
    returningVisitors: 0
  });
  
  useEffect(() => {
    // Simulating API call to fetch visitor stats
    setTimeout(() => {
      setVisitorStats({
        totalVisits: 278,
        uniqueVisitors: 153,
        returningVisitors: 62
      });
    }, 500);
  }, []);

  return visitorStats;
};
