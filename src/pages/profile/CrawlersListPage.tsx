
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, MapPin, Clock } from 'lucide-react';
import BackButton from '@/components/navigation/BackButton';

interface CrawlerUser {
  id: string;
  name: string;
  avatar?: string;
  location?: string;
  checkedInTime?: string;
  isActive: boolean;
}

const CrawlersListPage: React.FC = () => {
  // Sample data - in a real app this would come from a database
  const [crawlers] = useState<CrawlerUser[]>([
    {
      id: '1',
      name: 'Alex Johnson',
      avatar: '/placeholder.svg',
      location: 'The Mocktail Lounge',
      checkedInTime: '45 minutes ago',
      isActive: true
    },
    {
      id: '2',
      name: 'Jamie Smith',
      avatar: '/placeholder.svg',
      location: 'Sober Bar & Kitchen',
      checkedInTime: '25 minutes ago',
      isActive: true
    },
    {
      id: '3',
      name: 'Casey Wilson',
      avatar: '/placeholder.svg',
      location: 'Dry Spirits',
      checkedInTime: '10 minutes ago',
      isActive: true
    },
    {
      id: '4',
      name: 'Taylor Green',
      avatar: '/placeholder.svg',
      location: 'Zero Proof Cocktails',
      checkedInTime: '5 minutes ago',
      isActive: true
    },
    {
      id: '5',
      name: 'Jordan Reed',
      location: 'Last seen: The Mocktail Lounge',
      checkedInTime: '2 hours ago',
      isActive: false
    }
  ]);

  return (
    <Layout>
      <div className="py-4 animate-fade-in max-w-3xl mx-auto">
        <div className="mb-4">
          <BackButton />
          <h1 className="text-2xl font-medium text-material-on-background">Bar Crawl Participants</h1>
          <p className="text-material-on-surface-variant">
            See who's currently participating in this bar crawl
          </p>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="p-4 bg-gray-50 flex justify-between items-center">
              <div>
                <h2 className="font-medium">Weekend Mocktail Tour</h2>
                <p className="text-sm text-gray-500">5 participants</p>
              </div>
              <Badge className="bg-green-500">Active Now</Badge>
            </div>
            <div className="divide-y">
              {crawlers.map((crawler) => (
                <div key={crawler.id} className="p-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={crawler.avatar} alt={crawler.name} />
                      <AvatarFallback>
                        <User className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{crawler.name}</div>
                      {crawler.location && (
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {crawler.location}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {crawler.checkedInTime}
                    {crawler.isActive ? (
                      <div className="w-2 h-2 rounded-full bg-green-500 ml-2"></div>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300 ml-2"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CrawlersListPage;
