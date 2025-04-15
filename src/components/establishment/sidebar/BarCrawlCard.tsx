
import React from 'react';
import { Calendar } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface BarCrawlCardProps {
  establishment: any;
  onBarCrawlRequest: () => void;
  isLightTheme: boolean;
}

const BarCrawlCard: React.FC<BarCrawlCardProps> = ({
  establishment,
  onBarCrawlRequest,
  isLightTheme
}) => {
  return (
    <Card className="vibrant-card">
      <CardHeader>
        <CardTitle className={cn(
          "text-lg",
          isLightTheme ? "text-gray-800" : "gradient-text"
        )}>
          Bar Crawl Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className={cn(
              "text-sm",
              isLightTheme ? "text-gray-700" : ""
            )}>
              Currently participating:
            </span>
            <Badge variant="outline" className={establishment.inBarCrawl ? "bg-green-50 text-green-700 border-green-200" : "bg-gray-100"}>
              {establishment.inBarCrawl ? "Yes" : "No"}
            </Badge>
          </div>
          
          <Button className="w-full" variant="gradient" onClick={onBarCrawlRequest}>
            <Calendar className="h-4 w-4 mr-2" />
            Request to Join Bar Crawl
          </Button>
          
          <div className={cn(
            "text-xs mt-2",
            isLightTheme ? "text-gray-600" : "text-material-on-surface-variant"
          )}>
            Request this establishment to participate in upcoming bar crawls. The venue will receive your request and respond accordingly.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BarCrawlCard;
