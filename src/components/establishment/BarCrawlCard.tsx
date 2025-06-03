
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Users, Clock } from 'lucide-react';
import { BarCrawlRequest } from '@/hooks/useBarCrawlRequests';

interface BarCrawl {
  id: string;
  name: string;
  date: string;
  time: string;
  participants: number;
  maxParticipants?: number;
  status: 'active' | 'upcoming' | 'completed';
}

interface BarCrawlCardProps {
  barCrawl?: BarCrawl;
  crawl?: BarCrawlRequest;
  onViewDetails?: (id: string) => void;
  onJoin?: (id: string) => void;
  handleEndParticipation?: (id: string) => void;
  handleAcceptRequest?: (id: string) => void;
}

const BarCrawlCard: React.FC<BarCrawlCardProps> = ({ 
  barCrawl, 
  crawl,
  onViewDetails, 
  onJoin,
  handleEndParticipation,
  handleAcceptRequest
}) => {
  // Use either barCrawl or crawl data
  const data = barCrawl || crawl;
  
  if (!data) return null;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{data.name}</CardTitle>
          <Badge variant={data.status === 'active' ? 'default' : 'secondary'}>
            {data.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-1 gap-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              {data.date}
            </div>
            {'time' in data && (
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {data.time}
              </div>
            )}
            {'participants' in data && (
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-2" />
                {data.participants}
                {(data as BarCrawl).maxParticipants && `/${(data as BarCrawl).maxParticipants}`} participants
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            {onViewDetails && (
              <Button variant="outline" size="sm" onClick={() => onViewDetails(data.id)}>
                View Details
              </Button>
            )}
            {onJoin && data.status === 'upcoming' && (
              <Button size="sm" onClick={() => onJoin(data.id)}>
                Join
              </Button>
            )}
            {handleAcceptRequest && crawl?.status === 'pending' && (
              <Button size="sm" onClick={() => handleAcceptRequest(data.id)}>
                Accept Request
              </Button>
            )}
            {handleEndParticipation && (
              <Button variant="outline" size="sm" onClick={() => handleEndParticipation(data.id)}>
                End Participation
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarCrawlCard;
