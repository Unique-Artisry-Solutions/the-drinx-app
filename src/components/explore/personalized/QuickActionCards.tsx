
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Search, Users, Camera, Trophy } from 'lucide-react';

interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: string;
  href: string;
  color: string;
}

interface QuickActionCardsProps {
  actions: QuickAction[];
}

const QuickActionCards: React.FC<QuickActionCardsProps> = ({ actions }) => {
  const getIcon = (iconName: string) => {
    const icons = {
      map: MapPin,
      calendar: Calendar,
      search: Search,
      users: Users,
      camera: Camera,
      trophy: Trophy,
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Search;
    return <IconComponent className="h-5 w-5" />;
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      pink: 'bg-pink-50 border-pink-200 hover:bg-pink-100 text-pink-700',
      blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100 text-blue-700',
      green: 'bg-green-50 border-green-200 hover:bg-green-100 text-green-700',
      purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100 text-purple-700',
      orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100 text-orange-700',
      amber: 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-700',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {actions.map((action) => (
          <Card 
            key={action.id} 
            className={`group cursor-pointer transition-all duration-200 hover:shadow-md ${getColorClasses(action.color)}`}
          >
            <CardContent className="p-4">
              <Link to={action.href} className="block text-center space-y-3">
                <div className="flex justify-center">
                  <div className="p-2 rounded-lg bg-white/50 group-hover:bg-white/80 transition-colors">
                    {getIcon(action.icon)}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-sm mb-1">{action.title}</h3>
                  <p className="text-xs opacity-75 leading-tight">{action.description}</p>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuickActionCards;
