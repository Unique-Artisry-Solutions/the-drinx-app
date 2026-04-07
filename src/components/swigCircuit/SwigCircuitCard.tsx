
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Users, Clock, MapPin, ArrowRight } from 'lucide-react';

interface SwigCircuitCardProps {
  circuit: any;
  getThemeColor: (theme: string) => string;
  getThemeBorderColor: (theme: string) => string;
  getThemeImage: (theme: string) => string;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyIcon: (difficulty: string) => React.ReactNode;
}

const SwigCircuitCard: React.FC<SwigCircuitCardProps> = ({
  circuit,
  getThemeColor,
  getThemeBorderColor,
  getThemeImage,
  getDifficultyColor,
  getDifficultyIcon
}) => {
  return (
    <Link 
      key={circuit.id} 
      to={`/swig-circuit/${circuit.id}`} 
      className="block transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <Card className={`overflow-hidden border-b-4 ${getThemeBorderColor(circuit.theme)} shadow-md h-full`}>
        <div className={`h-28 bg-gradient-to-r ${getThemeColor(circuit.theme)} relative overflow-hidden`} style={{ backgroundImage: getThemeImage(circuit.theme) }}>
          <div className="absolute inset-0 flex flex-col justify-between p-4">
            <div className="flex justify-between items-start w-full">
              <Badge variant="outline" className="bg-white/90 text-gray-800 font-medium shadow-sm backdrop-blur-sm">
                {circuit.stops} stops
              </Badge>
              <Badge className={`${getDifficultyColor(circuit.difficulty)} flex items-center shadow-sm backdrop-blur-sm`}>
                {getDifficultyIcon(circuit.difficulty)}
                {circuit.difficulty}
              </Badge>
            </div>
            
            <h3 className="text-xl font-bold text-white drop-shadow-md bg-black/30 p-2 rounded backdrop-blur-sm">{circuit.name}</h3>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="mb-3">
            <Badge 
              variant="outline" 
              className={`${
                circuit.theme === 'Urban Exploration' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                circuit.theme === 'Weekend Getaway' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                circuit.theme === 'Cocktail Masters' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-green-50 text-green-700 border-green-200'
              } font-medium`}
            >
              {circuit.theme}
            </Badge>
          </div>
          
          {/* Route Preview */}
          <div className="mb-3 flex items-center">
            <div className="flex-1 flex items-center">
              {circuit.establishments.slice(0, 3).map((est: any, i: number) => (
                <div key={i} className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center -ml-2 first:ml-0 border-2 border-white ${i === 0 ? 'z-30' : i === 1 ? 'z-20' : 'z-10'}`}>
                  {est.image ? (
                    <img src={est.image} alt={est.name} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <MapPin size={14} className="text-gray-400" />
                  )}
                </div>
              ))}
              {circuit.establishments.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center -ml-2 border-2 border-white text-xs font-medium text-gray-500">
                  +{circuit.establishments.length - 3}
                </div>
              )}
              <ArrowRight className="h-4 w-4 text-gray-400 ml-2" />
            </div>
          </div>
          
          <div className="flex flex-col gap-2 mt-auto text-sm">
            <div className="flex items-center text-material-on-surface-variant">
              <Calendar className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
              <span>{new Date(circuit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
            
            <div className="flex items-center text-material-on-surface-variant">
              <Clock className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
              <span>{circuit.duration}</span>
            </div>
            
            <div className="flex items-center text-material-on-surface-variant">
              <Users className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
              <span>{circuit.participants} participants</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default SwigCircuitCard;
