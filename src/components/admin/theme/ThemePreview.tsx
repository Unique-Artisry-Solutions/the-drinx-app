
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Home, Settings } from 'lucide-react';

const ThemePreview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 p-4 border rounded-lg bg-background">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span className="font-medium">User Profile</span>
            </div>
            <Badge variant="secondary">Active</Badge>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button size="sm" className="w-full">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Button>
            <Button size="sm" variant="outline" className="w-full">
              <Settings className="h-4 w-4 mr-1" />
              Settings
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            This preview shows how your theme colors will appear across the application.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemePreview;
