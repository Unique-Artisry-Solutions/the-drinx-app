
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';

interface TabSystemMigrationProps {
  currentSystem: 'legacy' | 'new';
  onToggleSystem: () => void;
  pageTitle: string;
  migrationStatus: 'pending' | 'in-progress' | 'completed';
}

export const TabSystemMigration: React.FC<TabSystemMigrationProps> = ({
  currentSystem,
  onToggleSystem,
  pageTitle,
  migrationStatus
}) => {
  const getStatusBadge = () => {
    switch (migrationStatus) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Migrated
        </Badge>;
      case 'in-progress':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          <AlertCircle className="w-3 h-3 mr-1" />
          In Progress
        </Badge>;
      default:
        return <Badge variant="outline">
          Pending Migration
        </Badge>;
    }
  };

  return (
    <Card className="mb-6 border-blue-200 bg-blue-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg text-blue-900">
              Tab System Migration - {pageTitle}
            </CardTitle>
            <CardDescription className="text-blue-700">
              Current system: <strong>{currentSystem === 'new' ? 'New Responsive Tabs' : 'Legacy Tabs'}</strong>
            </CardDescription>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm text-blue-800 mb-2">
              {currentSystem === 'new' 
                ? 'Using the new responsive tab system with declarative configuration.'
                : 'Using the legacy tab system. Click to preview the new responsive system.'
              }
            </p>
            <div className="text-xs text-blue-600">
              New system features: Mobile dropdown, tablet scrolling, overflow handling, tab persistence
            </div>
          </div>
          <Button 
            onClick={onToggleSystem}
            variant={currentSystem === 'new' ? 'outline' : 'default'}
            size="sm"
            className="flex items-center gap-2"
          >
            {currentSystem === 'new' ? 'Switch to Legacy' : 'Preview New System'}
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
