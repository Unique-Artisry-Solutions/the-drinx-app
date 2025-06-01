
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function CriteriaBuilder() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Criteria Builder</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input placeholder="Define audience criteria" />
          <Button>Add Criteria</Button>
        </div>
      </CardContent>
    </Card>
  );
}
