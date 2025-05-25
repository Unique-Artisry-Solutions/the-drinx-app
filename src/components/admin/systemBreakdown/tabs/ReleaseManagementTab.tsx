
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Calendar, GitBranch, Package, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const ReleaseManagementTab: React.FC = () => {
  const releases = [
    {
      id: 1,
      version: "v2.1.0",
      name: "Enhanced Promoter Features",
      status: "in_progress",
      progress: 75,
      features: 8,
      completedFeatures: 6,
      releaseDate: "2024-02-15",
      type: "major"
    },
    {
      id: 2,
      version: "v2.0.3",
      name: "Security & Performance",
      status: "completed",
      progress: 100,
      features: 5,
      completedFeatures: 5,
      releaseDate: "2024-01-28",
      type: "patch"
    },
    {
      id: 3,
      version: "v2.2.0",
      name: "Social Features Expansion",
      status: "planned",
      progress: 15,
      features: 12,
      completedFeatures: 2,
      releaseDate: "2024-03-20",
      type: "major"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'planned':
        return <Calendar className="h-4 w-4 text-gray-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'planned':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'major':
        return 'bg-purple-100 text-purple-800';
      case 'minor':
        return 'bg-blue-100 text-blue-800';
      case 'patch':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Release Management</h2>
        <p className="text-gray-600">
          Release planning, version control, and deployment management interface.
        </p>
      </div>

      <div className="flex gap-4 mb-6">
        <Button variant="default">
          <Package className="h-4 w-4 mr-2" />
          Create Release
        </Button>
        <Button variant="outline">
          <GitBranch className="h-4 w-4 mr-2" />
          View Branches
        </Button>
      </div>

      <div className="grid gap-4">
        {releases.map((release) => (
          <Card key={release.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {getStatusIcon(release.status)}
                  <h3 className="text-xl font-semibold">{release.version}</h3>
                  <Badge className={getStatusColor(release.status)}>
                    {release.status.replace('_', ' ')}
                  </Badge>
                  <Badge className={getTypeColor(release.type)}>
                    {release.type}
                  </Badge>
                </div>
                <h4 className="text-lg text-gray-700 mb-1">{release.name}</h4>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Release Date: {new Date(release.releaseDate).toLocaleDateString()}
                </p>
              </div>
              <div className="text-right">
                <Button variant="outline" size="sm">
                  View Details
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-gray-500">
                    {release.completedFeatures}/{release.features} features
                  </span>
                </div>
                <Progress value={release.progress} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-4 pt-2">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold">{release.features}</div>
                  <div className="text-xs text-gray-500">Total Features</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-green-600">{release.completedFeatures}</div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <div className="text-lg font-bold text-blue-600">{release.progress}%</div>
                  <div className="text-xs text-gray-500">Progress</div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
          <h4 className="font-semibold mb-2">Active Releases</h4>
          <div className="text-3xl font-bold text-blue-600">
            {releases.filter(r => r.status === 'in_progress').length}
          </div>
        </Card>
        <Card className="p-4 text-center">
          <h4 className="font-semibold mb-2">Completed</h4>
          <div className="text-3xl font-bold text-green-600">
            {releases.filter(r => r.status === 'completed').length}
          </div>
        </Card>
        <Card className="p-4 text-center">
          <h4 className="font-semibold mb-2">Planned</h4>
          <div className="text-3xl font-bold text-gray-600">
            {releases.filter(r => r.status === 'planned').length}
          </div>
        </Card>
        <Card className="p-4 text-center">
          <h4 className="font-semibold mb-2">Total Features</h4>
          <div className="text-3xl font-bold text-purple-600">
            {releases.reduce((sum, r) => sum + r.features, 0)}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReleaseManagementTab;
