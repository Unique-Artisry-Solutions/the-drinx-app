
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const testRoutes = [
  { path: '/', label: 'Home', type: 'public' },
  { path: '/profile', label: 'Profile', type: 'protected' },
  { path: '/establishment/dashboard', label: 'Establishment Dashboard', type: 'establishment' },
  { path: '/promoter/dashboard', label: 'Promoter Dashboard', type: 'promoter' },
];

const RouteTestRunner: React.FC = () => {
  const navigate = useNavigate();
  const [lastTestedRoute, setLastTestedRoute] = useState<string>('');

  const testRoute = (path: string) => {
    setLastTestedRoute(path);
    navigate(path);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Route Test Runner</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          {testRoutes.map((route) => (
            <div key={route.path} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                <span>{route.label}</span>
                <Badge variant="outline">{route.type}</Badge>
              </div>
              <Button size="sm" onClick={() => testRoute(route.path)}>
                Test
              </Button>
            </div>
          ))}
        </div>
        
        {lastTestedRoute && (
          <div className="text-sm text-gray-600">
            Last tested: {lastTestedRoute}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RouteTestRunner;
