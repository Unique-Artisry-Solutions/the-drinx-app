import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  MapPin, 
  Route, 
  Clock, 
  Users, 
  CheckCircle2, 
  Timer
} from 'lucide-react';
import { useCheckInCooldown } from '@/hooks/useCheckInCooldown';

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
    canCheckIn,
    formatTimeRemaining,
    attemptCheckIn
  } = useCheckInCooldown({ lastCheckInTime });
  
  useEffect(() => {
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
        establishments: [
          { id: '1', name: 'Mocktail Heaven', address: '123 Main St' },
          { id: '2', name: 'Sober Bar', address: '456 Oak Ave' },
          { id: '3', name: 'Tropical Vibes', address: '789 Palm Blvd' },
          { id: '4', name: 'Zero Proof', address: '101 Pine St' }
        ],
        organizer: 'Alex Johnson',
        theme: 'Tropical Escape',
        status: 'active'
      };
      
      setActiveCircuit(mockCircuit);
      
      const updatedBarCrawls = [...barCrawls, mockCircuit];
      localStorage.setItem('user_bar_crawls', JSON.stringify(updatedBarCrawls));
    }
    
    const lastCheckIn = localStorage.getItem('last_check_in_time');
    if (lastCheckIn) {
      setLastCheckInTime(new Date(lastCheckIn));
      
      const lastEstId = localStorage.getItem('last_checked_in_establishment');
      if (lastEstId && active) {
        const estIndex = active.establishments?.findIndex(est => est.id === lastEstId);
        if (estIndex !== -1 && estIndex !== undefined) {
          setCurrentStopIndex(estIndex + 1);
        }
      }
    }
  }, []);
  
  if (!activeCircuit) {
    return null;
  }
  
  const establishments = activeCircuit.establishments || [];
  const progress = (currentStopIndex / establishments.length) * 100;
  
  const currentStop = establishments[currentStopIndex] || establishments[0] || { id: '', name: 'Unknown', address: 'No address available' };
  const nextStop = establishments[currentStopIndex + 1];
  
  const handleCheckIn = () => {
    if (!nextStop) return;
    
    const checkInSuccess = attemptCheckIn(nextStop.id, nextStop.name);
    if (checkInSuccess) {
      setLastCheckInTime(new Date());
      setCurrentStopIndex(prev => Math.min(prev + 1, establishments.length - 1));
    }
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-900 border-l-4 border-spiritless-pink">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base">
            <div className="flex items-center">
              <Route className="h-4 w-4 mr-1 text-spiritless-pink" />
              Active Swig Circuit
            </div>
          </CardTitle>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300 text-xs">
            In Progress
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 px-3 pb-3 space-y-3">
        <div className="bg-white/70 dark:bg-gray-800/50 rounded-lg p-3 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-sm">{activeCircuit?.name || 'Untitled Swig Circuit'}</h3>
          </div>
          
          <div className="flex flex-wrap gap-1 mb-3">
            {activeCircuit?.theme && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-300 text-xs">
                {activeCircuit.theme}
              </Badge>
            )}
            <Badge className="bg-amber-100 text-amber-800 border-amber-300 text-xs">
              {establishments.length} Stops
            </Badge>
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span className="font-medium">{currentStopIndex}/{establishments.length} stops</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid gap-3">
            <div className="space-y-1">
              <div className="text-xs font-medium text-left">Current Location</div>
              <div className="p-2 border rounded-md bg-green-50 dark:bg-green-900/20 flex items-start">
                <CheckCircle2 className="h-4 w-4 mr-2 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-sm">{currentStop.name}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                    <MapPin className="h-2 w-2 mr-1" />
                    {currentStop.address || 'Address not available'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs font-medium text-left">Next Stop</div>
              {nextStop ? (
                <div className="p-2 border rounded-md bg-amber-50 dark:bg-amber-900/20 flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium text-sm">{nextStop.name}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                      <MapPin className="h-2 w-2 mr-1" />
                      {nextStop.address || 'Address not available'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-2 border rounded-md bg-gray-50 dark:bg-gray-900/20 flex items-center">
                  <span className="text-xs text-gray-600 dark:text-gray-400">You've reached the last stop!</span>
                </div>
              )}
            </div>
          </div>
          
          {nextStop && (
            <div className="mt-3">
              {!canCheckIn && (
                <div className="mb-2 p-2 bg-amber-50 dark:bg-amber-900/20 text-xs border border-amber-200 rounded flex items-center">
                  <Timer className="h-3 w-3 mr-1 text-amber-600" />
                  <span>Cooldown: {formatTimeRemaining()}</span>
                </div>
              )}
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleCheckIn} 
                  disabled={!canCheckIn}
                  className="flex-1 text-xs py-1 px-2 h-auto"
                  size="sm"
                >
                  {canCheckIn ? 'Check In' : 'Waiting...'}
                </Button>
                
                <Button asChild variant="outline" size="sm" className="text-xs py-1 px-2 h-auto">
                  <Link to={`/bar-crawl-details/${activeCircuit.id}`}>
                    Details
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MobileActiveSwigCircuitSection;
