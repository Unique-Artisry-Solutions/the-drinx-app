
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trash2, RefreshCw, Database } from 'lucide-react';

const CacheManagementTab = () => {
  const cacheMetrics = [
    {
      name: 'Hit Rate',
      value: 89,
      status: 'good'
    },
    {
      name: 'Memory Usage',
      value: 67,
      status: 'warning'
    },
    {
      name: 'Active Keys',
      value: 15420,
      status: 'good'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleClearCache = () => {
    console.log('Clearing cache...');
  };

  const handleRefreshStats = () => {
    console.log('Refreshing cache statistics...');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {cacheMetrics.map((metric) => (
          <Card key={metric.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {metric.name}
              </CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {typeof metric.value === 'number' && metric.value < 100 ? `${metric.value}%` : metric.value}
              </div>
              <Badge className={getStatusColor(metric.status)}>
                {metric.status}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cache Management</CardTitle>
          <CardDescription>
            Monitor and manage system cache performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cache Size</span>
              <span className="text-sm text-muted-foreground">2.3 GB / 4 GB</span>
            </div>
            <Progress value={57} className="h-2" />
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleRefreshStats}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Stats
            </Button>
            <Button variant="destructive" onClick={handleClearCache}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CacheManagementTab;
