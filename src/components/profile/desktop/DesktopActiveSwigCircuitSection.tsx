
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

const DesktopActiveSwigCircuitSection: React.FC = () => {
  const [activeCircuit, setActiveCircuit] = useState<ActiveSwigCircuit | null>(null);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [lastCheckInTime, setLastCheckInTime] = useState<Date | null>(null);
  
  const { 
    canCheckIn,
    formatTimeRemaining,
    attemptCheckIn
  } = useCheckInCooldown({ lastCheckInTime });
  
  useEffect(() => {
    // In a real app, this would fetch the active Swig Circuit from the server
    // For now, we'll get it from localStorage or use a mock
    const barCrawls = JSON.parse(localStorage.getItem('user_bar_crawls') || '[]');
    const active = barCrawls.find((bc: any) => bc.status === 'active');
    
    if (active) {
      setActiveCircuit(active);
    } else {
      // Use a mock for demonstration purposes
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
      
      // Store this mock in localStorage for persistence
      const updatedBarCrawls = [...barCrawls, mockCircuit];
      localStorage.setItem('user_bar_crawls', JSON.stringify(updatedBarCrawls));
    }
    
    // Get the last check-in time from localStorage
    const lastCheckIn = localStorage.getItem('last_check_in_time');
    if (lastCheckIn) {
      setLastCheckInTime(new Date(lastCheckIn));
      
      // Determine current stop index based on check-ins
      const lastEstId = localStorage.getItem('last_checked_in_establishment');
      if (lastEstId && active) {
        const estIndex = active.establishments?.findIndex(est => est.id === lastEstId);
        if (estIndex !== -1 && estIndex !== undefined) {
          setCurrentStopIndex(estIndex + 1); // Set to next stop
        }
      }
    }
  }, []);
  
  if (!activeCircuit) {
    return null;
  }
  
  // Make sure activeCircuit.establishments exists and is an array before accessing length
  const establishments = activeCircuit.establishments || [];
  const progress = (currentStopIndex / establishments.length) * 100;
  
  // Add safety checks for currentStop and nextStop
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
          <CardTitle>
            <div className="flex items-center">
              <Route className="h-5 w-5 mr-2 text-spiritless-pink" />
              Active Swig Circuit
            </div>
          </CardTitle>
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            In Progress
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="bg-white/70 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-medium text-lg">{activeCircuit.name || 'Untitled Swig Circuit'}</h3>
            <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>Organized by {activeCircuit.organizer || 'Unknown'}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {activeCircuit.theme && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-300">
                {activeCircuit.theme}
              </Badge>
            )}
            <Badge className="bg-blue-100 text-blue-800 border-blue-300">
              <Clock className="h-3 w-3 mr-1" />
              {new Date(activeCircuit.startDate).toLocaleDateString()} - {new Date(activeCircuit.endDate).toLocaleDateString()}
            </Badge>
            <Badge className="bg-amber-100 text-amber-800 border-amber-300">
              {establishments.length} Stops
            </Badge>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Progress</span>
              <span className="font-medium">{currentStopIndex}/{establishments.length} stops</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">Current Location</div>
              <div className="p-3 border rounded-md bg-green-50 dark:bg-green-900/20 flex items-start">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">{currentStop.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {currentStop.address || 'Address not available'}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium">Next Stop</div>
              {nextStop ? (
                <div className="p-3 border rounded-md bg-amber-50 dark:bg-amber-900/20 flex items-start">
                  <MapPin className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">{nextStop.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {nextStop.address || 'Address not available'}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-900/20 flex items-center">
                  <span className="text-gray-600 dark:text-gray-400">You've reached the last stop!</span>
                </div>
              )}
            </div>
          </div>
          
          {nextStop && (
            <div className="mt-4">
              {!canCheckIn && (
                <div className="mb-3 p-2 bg-amber-50 dark:bg-amber-900/20 text-sm border border-amber-200 rounded flex items-center">
                  <Timer className="h-4 w-4 mr-2 text-amber-600" />
                  <span>Check-in cooldown: Please wait {formatTimeRemaining()} before checking in to the next stop</span>
                </div>
              )}
              
              <div className="flex gap-3">
                <Button 
                  onClick={handleCheckIn} 
                  disabled={!canCheckIn}
                  className="flex-1"
                >
                  {canCheckIn ? 'Check In to Next Stop' : 'Waiting Cooldown...'}
                </Button>
                
                <Button asChild variant="outline">
                  <Link to={`/bar-crawl-details/${activeCircuit.id}`}>
                    View Details
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

export default DesktopActiveSwigCircuitSection;
