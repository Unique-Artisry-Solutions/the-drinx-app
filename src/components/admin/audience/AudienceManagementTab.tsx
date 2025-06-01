import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Filter } from 'lucide-react';

interface AudienceSegment {
  id: string;
  name: string;
  description: string;
  size: number;
  criteria: Record<string, any>;
  status: 'active' | 'inactive' | 'draft';
}

interface AudienceManagementTabProps {
  // No props needed for now
}

const AudienceManagementTab = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  // Mock segments data
  const segments = [
    {
      id: '1',
      name: 'High Value Customers',
      description: 'Customers with lifetime value > $500',
      size: 1250,
      criteria: { minSpend: 500 },
      status: 'active' as const
    },
    {
      id: '2',
      name: 'Loyal Customers',
      description: 'Customers with > 10 orders',
      size: 870,
      criteria: { minOrders: 10 },
      status: 'active' as const
    },
    {
      id: '3',
      name: 'New Signups Last Month',
      description: 'Users who signed up in the last month',
      size: 320,
      criteria: { signupDate: 'last_month' },
      status: 'draft' as const
    },
    {
      id: '4',
      name: 'Inactive Users',
      description: 'Users who have not logged in for 90 days',
      size: 540,
      criteria: { lastLogin: '90_days' },
      status: 'inactive' as const
    }
  ];

  const filteredSegments = segments.filter(segment =>
    segment.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-semibold">Audience Segments</h2>
          <p className="text-muted-foreground">
            Manage and analyze your audience segments
          </p>
        </div>
        <div className="space-x-2">
          <Input
            type="search"
            placeholder="Search segments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-64"
          />
          <Button>
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create Segment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSegments.map((segment) => (
          <Card key={segment.id} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{segment.name}</CardTitle>
                <Badge variant={segment.status === 'active' ? 'default' : 'secondary'}>
                  {segment.status}
                </Badge>
              </div>
              <CardDescription>{segment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Segment Size</span>
                  <span className="font-medium">{segment.size.toLocaleString()}</span>
                </div>
                <Button variant="outline" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AudienceManagementTab;
