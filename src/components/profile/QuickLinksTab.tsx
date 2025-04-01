
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MapPin, CalendarClock } from 'lucide-react';

const QuickLinksTab: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Links</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button variant="outline" className="h-auto py-6 flex-col" asChild>
            <Link to="/profile/favorites">
              <Star size={24} className="mb-2 text-amber-500" />
              <span>Favorite Mocktails</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col" asChild>
            <Link to="/profile/visited">
              <MapPin size={24} className="mb-2 text-emerald-500" />
              <span>Visited Places</span>
            </Link>
          </Button>
          <Button variant="outline" className="h-auto py-6 flex-col" asChild>
            <Link to="/profile/bar-crawls">
              <CalendarClock size={24} className="mb-2 text-purple-500" />
              <span>My Bar Crawls</span>
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickLinksTab;
