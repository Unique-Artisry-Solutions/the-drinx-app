
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Target, TrendingUp } from 'lucide-react';
// import { AlertCircle } from 'lucide-react'; // Commented out to preserve future functionality

interface CampaignSegment {
  id: string;
  name: string;
  audienceSize: number;
  criteria: string[];
  performance: {
    openRate: number;
    clickRate: number;
    conversionRate: number;
  };
}

interface CampaignSegmentPanelProps {
  eventId: string;
  segments?: CampaignSegment[];
  onCreateSegment?: () => void;
}

const defaultSegments: CampaignSegment[] = [
  {
    id: '1',
    name: 'Frequent Attendees',
    audienceSize: 250,
    criteria: ['Attended 3+ events', 'High engagement'],
    performance: { openRate: 85, clickRate: 12, conversionRate: 8 }
  },
  {
    id: '2',
    name: 'Local Enthusiasts',
    audienceSize: 180,
    criteria: ['Within 10 miles', 'Cocktail interest'],
    performance: { openRate: 78, clickRate: 15, conversionRate: 12 }
  }
];

const CampaignSegmentPanel: React.FC<CampaignSegmentPanelProps> = ({
  eventId,
  segments = defaultSegments,
  onCreateSegment
}) => {
  const handleSegmentAction = (action: string, segmentId: string) => {
    console.log(`${action} segment ${segmentId} for event ${eventId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Campaign Segments</h3>
          <p className="text-sm text-gray-600">Target specific audience groups for your marketing campaigns</p>
        </div>
        {onCreateSegment && (
          <Button onClick={onCreateSegment}>
            <Target className="w-4 h-4 mr-2" />
            Create Segment
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {segments.map((segment) => (
          <Card key={segment.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{segment.name}</CardTitle>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {segment.audienceSize} people
                  </div>
                </div>
                <Select onValueChange={(action) => handleSegmentAction(action, segment.id)}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="edit">Edit</SelectItem>
                    <SelectItem value="duplicate">Duplicate</SelectItem>
                    <SelectItem value="delete">Delete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Criteria */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Criteria</h4>
                  <div className="flex flex-wrap gap-1">
                    {segment.criteria.map((criterion, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {criterion}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Performance</h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">
                        {segment.performance.openRate}%
                      </div>
                      <div className="text-xs text-gray-500">Open Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {segment.performance.clickRate}%
                      </div>
                      <div className="text-xs text-gray-500">Click Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">
                        {segment.performance.conversionRate}%
                      </div>
                      <div className="text-xs text-gray-500">Conversion</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Performing well
                  </div>
                  <Button size="sm" variant="outline">
                    View Analytics
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {segments.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h4 className="text-lg font-medium mb-2">No segments created</h4>
            <p className="mb-4">Create your first audience segment to start targeted marketing campaigns.</p>
            {onCreateSegment && (
              <Button onClick={onCreateSegment}>Create First Segment</Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CampaignSegmentPanel;
