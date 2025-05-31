
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, BookOpen } from 'lucide-react';

interface GuideHeaderProps {
  title: string;
  description: string;
  version?: string;
  lastUpdated?: string;
}

export function GuideHeader({ 
  title, 
  description, 
  version = '1.0', 
  lastUpdated = '2024-01-15' 
}: GuideHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-xl">{title}</CardTitle>
              <p className="text-muted-foreground mt-1">{description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
            <Badge variant="outline">v{version}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Last updated: {lastUpdated}</span>
          <span>•</span>
          <span>6 sections available</span>
          <span>•</span>
          <span>~15 min read</span>
        </div>
      </CardContent>
    </Card>
  );
}
