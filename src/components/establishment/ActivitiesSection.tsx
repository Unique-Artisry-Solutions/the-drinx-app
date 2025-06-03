
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// import { CardDescription, CardTitle } from '@/components/ui/card'; // Commented out to preserve future functionality
// import { Activity } from 'lucide-react'; // Commented out to preserve future functionality

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  user?: string;
}

interface ActivitiesSectionProps {
  activities: ActivityItem[];
}

const ActivitiesSection: React.FC<ActivitiesSectionProps> = ({ activities }) => {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Recent Activities</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No recent activities</p>
          ) : (
            activities.map((activity) => (
              <div key={activity.id} className="flex items-start justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="secondary">{activity.type}</Badge>
                    {activity.user && (
                      <span className="text-sm text-gray-600">by {activity.user}</span>
                    )}
                  </div>
                  <p className="text-sm">{activity.description}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.timestamp}</span>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivitiesSection;
