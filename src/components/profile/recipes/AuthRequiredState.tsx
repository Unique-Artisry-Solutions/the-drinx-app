
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { GlassWater } from 'lucide-react';

const AuthRequiredState: React.FC = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="pt-6 text-center">
        <GlassWater className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium">Authentication Required</h3>
        <p className="text-muted-foreground mt-2 mb-6">Please log in to view and manage your recipes.</p>
      </CardContent>
    </Card>
  );
};

export default AuthRequiredState;
