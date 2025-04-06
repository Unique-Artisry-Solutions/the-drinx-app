
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Route, Clock, ChevronRight, CheckCircle, CheckCircle2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

const DesktopActiveSwigCircuitSection: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Demo data - would come from a hook or context in real app
  const circuit = {
    id: "active-circuit-1",
    name: "Downtown Delight Tour",
    establishments: [
      { id: "est-1", name: "The Mocktail Lounge", address: "123 Main St" },
      { id: "est-2", name: "Zero Proof", address: "456 Oak Ave" },
      { id: "est-3", name: "Alcohol-Free Zone", address: "789 Pine Blvd" },
      { id: "est-4", name: "Sober City", address: "101 Elm St" }
    ],
    currentStopIndex: 1,
    theme: "Urban Exploration"
  };
  
  const progress = (circuit.currentStopIndex / circuit.establishments.length) * 100;
  const currentStop = circuit.establishments[circuit.currentStopIndex];
  const nextStop = circuit.establishments[circuit.currentStopIndex + 1];

  // Use navy blue background for the container
  const cardBgClass = isDark 
    ? "from-navy-900 to-navy-800 dark:from-navy-900 dark:to-navy-850" 
    : "from-navy-100 to-navy-200 dark:from-navy-900 dark:to-navy-850";

  return (
    <Card className={`bg-gradient-to-br ${cardBgClass} border-l-4 border-spiritless-pink shadow-md`}>
      <CardHeader className="pb-2 bg-gradient-to-r from-transparent to-spiritless-pink/10 rounded-tr-lg">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Route className="h-5 w-5 text-spiritless-pink" />
            Active Swig Circuit
          </CardTitle>
          <Badge className="bg-green-100 text-green-800 border-green-300">In Progress</Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-3">
        <div className={`${isDark ? 'bg-navy-800/80' : 'bg-white/80'} dark:bg-navy-800/60 rounded-lg p-4 shadow-sm backdrop-blur-sm`}>
          <div className="flex justify-between items-start mb-3">
            <div>
              <h3 className="font-semibold text-lg">{circuit.name}</h3>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700">
                  {circuit.theme}
                </Badge>
                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-300 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700">
                  {circuit.establishments.length} Stops
                </Badge>
              </div>
            </div>
            
            <Button asChild variant="outline" size="sm">
              <Link to={`/bar-crawl-details/${circuit.id}`}>
                View Details
                <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span className="font-medium">{circuit.currentStopIndex}/{circuit.establishments.length} stops</span>
            </div>
            <Progress value={progress} className="h-2.5" />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium mb-2">Current Location</div>
              <div className="p-3 border rounded-md bg-green-50 dark:bg-green-900/20 flex items-start shadow-sm">
                <CheckCircle2 className="h-5 w-5 mr-2 text-green-600 dark:text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium">{currentStop.name}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {currentStop.address}
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <div className="text-sm font-medium mb-2">Next Stop</div>
              {nextStop ? (
                <div className="p-3 border rounded-md bg-amber-50 dark:bg-amber-900/20 flex items-start shadow-sm">
                  <MapPin className="h-5 w-5 mr-2 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">{nextStop.name}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {nextStop.address}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-3 border rounded-md bg-gray-50 dark:bg-gray-900/20 flex items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">You've reached the last stop!</span>
                </div>
              )}
            </div>
          </div>
          
          {nextStop && (
            <div className="flex justify-end mt-4">
              <Button className="bg-spiritless-pink hover:bg-spiritless-pink/90">
                Check In to Next Stop
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DesktopActiveSwigCircuitSection;
