
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Search, Map, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuickActionCardsProps {
  showAuthPrompt?: boolean;
}

const QuickActionCards: React.FC<QuickActionCardsProps> = ({ showAuthPrompt = false }) => {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Search,
      title: 'Find Drinks',
      description: 'Discover new mocktails',
      action: () => navigate('/explore'),
      color: 'bg-blue-50 hover:bg-blue-100 text-blue-700'
    },
    {
      icon: Map,
      title: 'Nearby Places',
      description: 'Establishments near you',
      action: () => navigate('/explore'),
      color: 'bg-green-50 hover:bg-green-100 text-green-700'
    },
    {
      icon: Plus,
      title: 'Create Recipe',
      description: 'Share your mocktail',
      action: () => navigate('/profile'),
      color: 'bg-purple-50 hover:bg-purple-100 text-purple-700'
    },
    {
      icon: Calendar,
      title: 'Join Events',
      description: 'Find swig circuits',
      action: () => navigate('/explore'),
      color: 'bg-orange-50 hover:bg-orange-100 text-orange-700'
    }
  ];

  if (showAuthPrompt) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.slice(0, 2).map((action, index) => (
          <Card key={index} className={`p-4 cursor-pointer transition-colors ${action.color}`} onClick={action.action}>
            <div className="text-center">
              <action.icon className="h-8 w-8 mx-auto mb-2" />
              <h3 className="font-semibold">{action.title}</h3>
              <p className="text-sm opacity-80">{action.description}</p>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className={`h-auto p-4 flex flex-col items-center space-y-2 ${action.color}`}
            onClick={action.action}
          >
            <action.icon className="h-6 w-6" />
            <div className="text-center">
              <p className="font-medium text-sm">{action.title}</p>
              <p className="text-xs opacity-80">{action.description}</p>
            </div>
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActionCards;
