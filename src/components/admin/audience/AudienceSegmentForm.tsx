import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface AudienceSegment {
  id?: string;
  name: string;
  description: string;
  criteria: Record<string, any>;
  status: 'active' | 'draft' | 'archived';
}

interface AudienceSegmentFormProps {
  segment?: AudienceSegment;
  onSubmit: (segment: AudienceSegment) => void;
  onCancel: () => void;
}

const AudienceSegmentForm = ({ segment, onSubmit, onCancel }: AudienceSegmentFormProps) => {
  const [formData, setFormData] = useState<AudienceSegment>({
    name: segment?.name || '',
    description: segment?.description || '',
    criteria: segment?.criteria || {},
    status: segment?.status || 'draft'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCriteriaChange = (newCriteria: Record<string, any>) => {
    setFormData(prev => ({ ...prev, criteria: newCriteria }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{segment ? 'Edit Segment' : 'Create Segment'}</CardTitle>
        <CardDescription>
          Define the criteria for your audience segment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Segment Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              rows={3}
            />
          </div>

          {/* Criteria Builder Component (replace with actual implementation) */}
          <div>
            <Label>Criteria</Label>
            {/* <CriteriaBuilder criteria={formData.criteria} onCriteriaChange={handleCriteriaChange} /> */}
            <p className="text-muted-foreground text-sm">
              (Criteria builder component will go here)
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleInputChange('status', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit">
              {segment ? 'Update Segment' : 'Create Segment'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default AudienceSegmentForm;
