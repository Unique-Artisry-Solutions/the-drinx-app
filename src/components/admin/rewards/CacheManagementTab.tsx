
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Trash2, Database } from "lucide-react";
import { toast } from 'sonner';

const CacheManagementTab = () => {
  const handleClearCache = (cacheType: string) => {
    toast.success(`${cacheType} cache cleared successfully`);
  };

  const handleRefreshCache = (cacheType: string) => {
    toast.info(`Refreshing ${cacheType} cache...`);
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redis Cache</CardTitle>
            <Database className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245MB</div>
            <p className="text-xs text-muted-foreground">
              Current usage
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => handleRefreshCache('Redis')}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleClearCache('Redis')}>
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Memory Cache</CardTitle>
            <Database className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128MB</div>
            <p className="text-xs text-muted-foreground">
              In-memory data
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => handleRefreshCache('Memory')}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleClearCache('Memory')}>
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CDN Cache</CardTitle>
            <Database className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.2GB</div>
            <p className="text-xs text-muted-foreground">
              Static assets
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="sm" variant="outline" onClick={() => handleRefreshCache('CDN')}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Refresh
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleClearCache('CDN')}>
                <Trash2 className="h-3 w-3 mr-1" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Cache Statistics</CardTitle>
          <CardDescription>Cache performance and hit rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">Overall Hit Rate</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">94.2%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Redis Hit Rate</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">96.8%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Memory Hit Rate</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">89.3%</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">CDN Hit Rate</span>
              <Badge variant="outline" className="bg-green-50 text-green-700">98.7%</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CacheManagementTab;
