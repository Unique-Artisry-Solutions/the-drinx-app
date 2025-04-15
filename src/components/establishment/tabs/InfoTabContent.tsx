
import React from 'react';
import { MapPin, Phone, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import { BusinessHour } from '../BusinessHoursEditor';

interface InfoTabContentProps {
  establishment: any;
  activeUsers: number;
  businessHoursDisplay: { days: string; hours: string }[];
  isLightTheme: boolean;
}

const InfoTabContent: React.FC<InfoTabContentProps> = ({ 
  establishment, 
  activeUsers, 
  businessHoursDisplay,
  isLightTheme
}) => {
  return (
    <Card className="vibrant-card">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex items-center accent-border-left">
            <MapPin className="h-5 w-5 mr-2 text-spiritless-pink" />
            <span className={isLightTheme ? "text-gray-700" : ""}>
              {establishment.address}
            </span>
          </div>
          <div className="flex items-center accent-border-left border-spiritless-green">
            <Phone className="h-5 w-5 mr-2 text-spiritless-green" />
            <span className={isLightTheme ? "text-gray-700" : ""}>
              {establishment.phone || '555-123-4567'}
            </span>
          </div>
          <div className="flex items-center accent-border-left border-spiritless-orange">
            <Users className="h-5 w-5 mr-2 text-spiritless-orange" />
            <span className={isLightTheme ? "text-gray-700" : ""}>
              {activeUsers} {activeUsers === 1 ? 'person' : 'people'} here now
            </span>
          </div>
          
          <div className="pt-4">
            <h3 className={cn(
              "font-medium mb-2 text-lg",
              isLightTheme ? "text-gray-800" : "gradient-text"
            )}>
              Business Hours
            </h3>
            <div className={cn(
              "grid grid-cols-2 gap-2 text-sm",
              isLightTheme ? "text-gray-700" : ""
            )}>
              {businessHoursDisplay.map((hours, index) => (
                <React.Fragment key={index}>
                  <div>{hours.days}</div>
                  <div>{hours.hours}</div>
                </React.Fragment>
              ))}
            </div>
          </div>
          
          <div className="pt-4">
            <h3 className={cn(
              "font-medium mb-2 text-lg",
              isLightTheme ? "text-gray-800" : "gradient-text"
            )}>
              About
            </h3>
            <p className={cn(
              "text-sm",
              isLightTheme ? "text-gray-600" : "text-material-on-surface-variant"
            )}>
              {establishment.description || `${establishment.name} is a premier destination for non-alcoholic cocktails. 
                We pride ourselves on creating innovative and delicious mocktails that everyone can enjoy.`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfoTabContent;
