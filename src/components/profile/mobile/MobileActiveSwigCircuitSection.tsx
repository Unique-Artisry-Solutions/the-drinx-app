
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useCheckInCooldown } from '@/hooks/useCheckInCooldown';
import { useTheme } from '@/contexts/ThemeContext';
import SwigCircuitHeader from './SwigCircuitHeader';
import CircuitProgress from './CircuitProgress';
import StopInfo from './StopInfo';
import CircuitActions from './CircuitActions';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';

interface Establishment {
  id: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
}

interface ActiveSwigCircuit {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  establishments: Establishment[];
  organizer: string;
  theme?: string;
  status?: string;
}

const MobileActiveSwigCircuitSection: React.FC = () => {
  const [activeCircuit, setActiveCircuit] = useState<ActiveSwigCircuit | null>(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [lastCheckInTime, setLastCheckInTime] = useState<Date | null>(null);
  
  const {
    theme
  } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();
  
  const {
    canCheckIn,
    formatTimeRemaining,
    attemptCheckIn
  } = useCheckInCooldown({
    lastCheckInTime
  });

  useEffect(() => {
    // Load active bar crawl from localStorage for now
    // In a production app, this would come from Supabase
    const loadActiveBarCrawl = async () => {
      const barCrawls = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
      const active = barCrawls.find((bc: any) => bc.status === 'active');
      
      if (active) {
        setActiveCircuit(active);
      } else {
        const mockCircuit = {
          id: 'active-1',
          name: 'Downtown Delights Tour',
          startDate: new Date().toISOString().split('T')[0],
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          establishments: [{
            id: '1',
            name: 'Mocktail Heaven',
            address: '123 Main St'
          }, {
            id: '2',
            name: 'Sober Bar',
            address: '456 Oak Ave'
          }, {
            id: '3',
            name: 'Tropical Vibes',
            address: '789 Palm Blvd'
          }, {
            id: '4',
            name: 'Zero Proof',
            address: '101 Pine St'
          }],
          organizer: 'Alex Johnson',
          theme: 'Tropical Escape',
          status: 'active'
        };
        
        setActiveCircuit(mockCircuit);
        const updatedBarCrawls = [...barCrawls, mockCircuit];
        localStorage.setItem('user_bar_crawls', JSON.stringify(updatedBarCrawls));
      }
    };
    
    // Load check-in data
    const loadCheckInData = async () => {
      const lastCheckIn = localStorage.getItem('last_check_in_time');
      if (lastCheckIn) {
        setLastCheckInTime(new Date(lastCheckIn));
      }
      
      // Get last checked in establishment to determine current stop index
      const lastEstId = localStorage.getItem('last_checked_in_establishment');
      
      if (lastEstId && activeCircuit) {
        const estIndex = activeCircuit.establishments?.findIndex(est => est.id === lastEstId);
        if (estIndex !== -1 && estIndex !== undefined) {
          setCurrentStopIndex(estIndex + 1); // Set to the next stop after the last check-in
        }
      }
    };
    
    loadActiveBarCrawl();
    loadCheckInData();
  }, []);

  const handleCheckIn = () => {
    if (!activeCircuit) return;
    
    // The actual check-in logic now happens in CircuitActions component
    // This function is called after a successful check-in
    setCurrentStopIndex(prev => Math.min(prev + 1, activeCircuit.establishments.length - 1));
    setLastCheckInTime(new Date());
  };

  if (!activeCircuit) {
    return null;
  }

  const establishments = activeCircuit.establishments || [];
  const currentStop = establishments[currentStopIndex] || establishments[0] || {
    id: '',
    name: 'Unknown',
    address: 'No address available'
  };
  const nextStop = establishments[currentStopIndex + 1];

  // Use navy blue background for the container
  const cardBgClass = isDark ? "from-navy-900 to-navy-800 dark:from-navy-900 dark:to-navy-850" : "from-navy-100 to-navy-200 dark:from-navy-900 dark:to-navy-850";
  
  return <Card className={`bg-gradient-to-br ${cardBgClass} border-l-4 border-spiritless-pink shadow-md`}>
      <CardHeader className="pb-2 bg-gradient-to-r from-transparent to-spiritless-pink/10 rounded-tr-lg">
        <SwigCircuitHeader />
      </CardHeader>
      
      <CardContent className="pt-0 pb-3 space-y-3 py-px px-0 my-[7px]">
        <div className={`${isDark ? 'bg-navy-800/80' : 'bg-white/80'} dark:bg-navy-800/60 rounded-lg p-3 backdrop-blur-sm shadow-sm`}>
          <CircuitProgress name={activeCircuit.name} theme={activeCircuit.theme} currentStopIndex={currentStopIndex} totalStops={establishments.length} />
          
          <div className="grid gap-3">
            <div className="space-y-1">
              <div className="text-xs font-medium text-left">Current Location</div>
              <StopInfo type="current" stop={currentStop} />
            </div>
            
            <div className="space-y-1">
              <div className="text-xs font-medium text-left">Next Stop</div>
              <StopInfo type="next" stop={nextStop} isLastStop={currentStopIndex === establishments.length - 1} />
            </div>
          </div>
          
          <CircuitActions 
            circuitId={activeCircuit.id}
            establishmentId={nextStop?.id}
            establishmentName={nextStop?.name}
            hasNextStop={!!nextStop} 
            canCheckIn={canCheckIn} 
            formatTimeRemaining={formatTimeRemaining} 
            onCheckIn={handleCheckIn} 
          />
        </div>
      </CardContent>
    </Card>;
};

export default MobileActiveSwigCircuitSection;
