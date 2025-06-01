
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AudienceInsights() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Audience Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Audience insights and trends will be displayed here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
