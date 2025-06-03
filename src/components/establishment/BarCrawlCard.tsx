
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock } from 'lucide-react';
// import { MapPinIcon } from 'lucide-react'; // Commented out to preserve future functionality

interface BarCrawl {
  id: string;
  name: string;
  date: string;
  time: string;
  participants: number;
  maxParticipants: number;
  status: 'active' | 'upcoming' | 'completed';
}

interface BarCrawlCardProps {
  barCrawl: BarCrawl;
  onViewDetails?: (id: string) => void;
  onJoin?: (id: string) => void;
}

const BarCrawlCard: React.FC<BarCrawlCardProps> = ({ 
  barCrawl, 
  onViewDetails, 
  onJoin 
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{barCrawl.name}</CardTitle>
          <Badge variant={barCrawl.status === 'active' ? 'default' : 'secondary'}>
            {barCrawl.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {barCrawl.date}
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2" />
              {barCrawl.time}
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-2" />
              {barCrawl.participants}/{barCrawl.maxParticipants} participants
            </div>
          </div>
          
          <div className="flex gap-2">
            {onViewDetails && (
              <Button variant="outline" size="sm" onClick={() => onViewDetails(barCrawl.id)}>
                View Details
              </Button>
            )}
            {onJoin && barCrawl.status === 'upcoming' && (
              <Button size="sm" onClick={() => onJoin(barCrawl.id)}>
                Join
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarCrawlCard;
