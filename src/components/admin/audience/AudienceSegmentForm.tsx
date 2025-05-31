import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Save, X } from 'lucide-react';
import { CriteriaBuilder } from './CriteriaBuilder';

interface AudienceSegment {
  id?: string;
  name: string;
  description: string;
  criteria: any[];
  isActive: boolean;
  estimatedSize?: number;
}

interface AudienceSegmentFormProps {
  segment?: AudienceSegment;
  onSave: (segment: AudienceSegment) => void;
  onCancel: () => void;
}

export function AudienceSegmentForm({ segment, onSave, onCancel }: AudienceSegmentFormProps) {
  const [formData, setFormData] = useState<AudienceSegment>({
    name: segment?.name || '',
    description: segment?.description || '',
    criteria: segment?.criteria || [],
    isActive: segment?.isActive ?? true,
    estimatedSize: segment?.estimatedSize || 0,
    ...segment
  });

  const [activeTab, setActiveTab] = useState('basic');

  const handleInputChange = (field: keyof AudienceSegment, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name.trim()) {
      return;
    }
    onSave(formData);
  };

  const calculateEstimatedSize = () => {
    // Mock calculation based on criteria - preserved as placeholder
    const baseSize = 10000;
    const criteriaMultiplier = Math.max(0.1, 1 - (formData.criteria.length * 0.2));
    return Math.floor(baseSize * criteriaMultiplier);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {segment ? 'Edit Segment' : 'Create New Segment'}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Segment
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="criteria">Criteria</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Segment Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter segment name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe this audience segment"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => handleInputChange('isActive', e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="isActive">Active segment</Label>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="criteria" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Audience Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <CriteriaBuilder
                criteria={formData.criteria}
                onCriteriaChange={(criteria) => handleInputChange('criteria', criteria)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Segment Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Segment Details</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Name:</span>
                      <span className="text-sm font-medium">{formData.name || 'Unnamed Segment'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Status:</span>
                      <Badge variant={formData.isActive ? "default" : "secondary"}>
                        {formData.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Criteria Count:</span>
                      <span className="text-sm font-medium">{formData.criteria.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Estimated Size:</span>
                      <span className="text-sm font-medium">{calculateEstimatedSize().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className="text-sm text-muted-foreground">
                    {formData.description || 'No description provided'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
