
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, Trash2, Database, Clock } from 'lucide-react';
import { toast } from 'sonner';

const CacheManagementTab = () => {
  // Mock cache data - preserved as placeholder for future functionality
  const cacheStats = {
    totalEntries: 1247,
    hitRate: '94.2%',
    memoryUsage: '256MB',
    lastCleared: '2 hours ago'
  };

  const cacheEntries = [
    { key: 'user_rewards_123', size: '2.4KB', lastAccessed: '5 min ago', hitCount: 45 },
    { key: 'establishment_points_456', size: '1.8KB', lastAccessed: '12 min ago', hitCount: 23 },
    { key: 'tier_calculations_789', size: '3.1KB', lastAccessed: '1 hour ago', hitCount: 67 }
  ];

  const handleClearCache = () => {
    toast.success('Cache cleared successfully');
  };

  const handleRefreshCache = () => {
    toast.info('Cache refreshed');
  };

  const handleClearEntry = (key: string) => {
    toast.success(`Cache entry ${key} cleared`);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cacheStats.totalEntries}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hit Rate</CardTitle>
            <Badge variant="secondary">{cacheStats.hitRate}</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Cache efficiency</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Usage</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cacheStats.memoryUsage}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Cleared</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm">{cacheStats.lastCleared}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Cache Management
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={handleRefreshCache}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="destructive" size="sm" onClick={handleClearCache}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cacheEntries.map((entry) => (
              <div key={entry.key} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="space-y-1">
                  <div className="font-medium text-sm">{entry.key}</div>
                  <div className="text-xs text-muted-foreground">
                    Size: {entry.size} • Last accessed: {entry.lastAccessed} • Hits: {entry.hitCount}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleClearEntry(entry.key)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CacheManagementTab;
