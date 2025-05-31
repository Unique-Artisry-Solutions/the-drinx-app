
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Download, Users, Settings } from 'lucide-react';

export function BulkTabContent() {
  const bulkOperations = [
    {
      icon: Upload,
      title: 'Bulk User Import',
      description: 'Import multiple users with their initial reward settings',
      difficulty: 'Easy',
      timeEstimate: '5-10 minutes'
    },
    {
      icon: Settings,
      title: 'Mass Point Updates',
      description: 'Update point balances for multiple users simultaneously',
      difficulty: 'Medium',
      timeEstimate: '10-15 minutes'
    },
    {
      icon: Users,
      title: 'Tier Migrations',
      description: 'Move users between reward tiers in bulk operations',
      difficulty: 'Advanced',
      timeEstimate: '15-20 minutes'
    },
    {
      icon: Download,
      title: 'Bulk Export',
      description: 'Export large datasets with custom field selection',
      difficulty: 'Easy',
      timeEstimate: '2-5 minutes'
    }
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Operations Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Bulk operations allow you to perform actions on multiple records simultaneously, 
            saving time and ensuring consistency across your reward program.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {bulkOperations.map((operation) => (
              <Card key={operation.title}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <operation.icon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{operation.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {operation.description}
                      </p>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {operation.difficulty}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {operation.timeEstimate}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
