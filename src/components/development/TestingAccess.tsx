
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { TestTube, ExternalLink } from 'lucide-react';
import { useDevelopmentMode } from '@/contexts/DevelopmentModeContext';
import { useNavigate } from 'react-router-dom';

const TestingAccess: React.FC = () => {
  const { isDevelopment } = useDevelopmentMode();
  const navigate = useNavigate();

  if (!isDevelopment) return null;

  return (
    <Card className="fixed top-4 right-4 z-50 border-blue-300 bg-blue-50 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <TestTube className="h-5 w-5 text-blue-600" />
          <div className="flex-1">
            <p className="font-medium text-blue-800 text-sm">MVP Testing Suite</p>
            <p className="text-xs text-blue-600">Comprehensive testing environment</p>
          </div>
          <Button
            size="sm"
            onClick={() => navigate('/testing')}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <ExternalLink className="h-3 w-3 mr-1" />
            Open
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestingAccess;
