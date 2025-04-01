
import React from 'react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Copy } from 'lucide-react';
import { BarCrawl } from '@/types/ProfileTypes';

interface SocialSharingTabProps {
  barCrawl: BarCrawl;
  copyShareLink: () => void;
  shareToSocialMedia: (platform: string) => void;
}

const SocialSharingTab: React.FC<SocialSharingTabProps> = ({
  barCrawl,
  copyShareLink,
  shareToSocialMedia
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Sharing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Share on Social Media</h3>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 h-20 flex-col gap-2"
                onClick={() => shareToSocialMedia('facebook')}
              >
                <Facebook size={24} className="text-blue-600" />
                <span>Facebook</span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 h-20 flex-col gap-2"
                onClick={() => shareToSocialMedia('twitter')}
              >
                <Twitter size={24} className="text-blue-400" />
                <span>Twitter</span>
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="flex-1 h-20 flex-col gap-2"
                onClick={() => shareToSocialMedia('instagram')}
              >
                <Instagram size={24} className="text-pink-500" />
                <span>Instagram</span>
              </Button>
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Direct Link</h3>
            <div className="flex gap-2">
              <Input
                value={`${window.location.origin}/bar-crawl/${barCrawl.id}`}
                readOnly
                className="flex-1 bg-gray-50"
              />
              <Button variant="outline" onClick={copyShareLink}>
                <Copy size={16} className="mr-2" />
                Copy
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md p-4 bg-gray-50">
            <h3 className="font-medium mb-2">Preview</h3>
            <div className="flex gap-4">
              <div className="h-24 w-24 bg-gray-200 rounded-md overflow-hidden">
                <img 
                  src={barCrawl.imageUrl || 'https://placehold.co/600x300'} 
                  alt={barCrawl.name}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{barCrawl.name}</h4>
                <p className="text-sm text-gray-600 mb-1">
                  {format(new Date(barCrawl.startDate), 'MMM d')} - {format(new Date(barCrawl.endDate), 'MMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-600">
                  {barCrawl.establishments.length} establishments • Organized by {barCrawl.organizer}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialSharingTab;
