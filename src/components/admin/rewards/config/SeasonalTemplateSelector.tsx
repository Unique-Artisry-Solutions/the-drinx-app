
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronDown, Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SeasonalTemplate {
  id: string | number;
  name: string;
  startMonth: number;
  endMonth: number;
  pointsMultiplier: number;
  description: string;
}

export interface SeasonalTemplateSelectorProps {
  templates?: SeasonalTemplate[];
  onSelectTemplate?: (template: SeasonalTemplate) => void;
  onCreateTemplate?: (template: SeasonalTemplate) => void;
}

export function SeasonalTemplateSelector({
  templates = [],
  onSelectTemplate,
  onCreateTemplate
}: SeasonalTemplateSelectorProps) {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<SeasonalTemplate>>({
    name: '',
    startMonth: 1,
    endMonth: 2,
    pointsMultiplier: 1.5,
    description: ''
  });

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewTemplate(prev => ({
      ...prev,
      [name]: name === 'pointsMultiplier' ? parseFloat(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string | number) => {
    setNewTemplate(prev => ({
      ...prev,
      [name]: name === 'startMonth' || name === 'endMonth' ? Number(value) : value
    }));
  };

  const handleCreateTemplate = () => {
    if (onCreateTemplate && newTemplate.name) {
      onCreateTemplate({
        ...newTemplate,
        id: Date.now(),
        startMonth: newTemplate.startMonth || 1,
        endMonth: newTemplate.endMonth || 12,
        pointsMultiplier: newTemplate.pointsMultiplier || 1,
        description: newTemplate.description || ''
      } as SeasonalTemplate);
      setIsCreateDialogOpen(false);
      setNewTemplate({
        name: '',
        startMonth: 1,
        endMonth: 2,
        pointsMultiplier: 1.5,
        description: ''
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Seasonal Promotion Templates
        </CardTitle>
        <CardDescription>
          Apply or create seasonal promotion templates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {templates.length > 0 ? (
            <div className="grid gap-2">
              {templates.map(template => (
                <div 
                  key={template.id} 
                  className="p-3 border rounded-md flex justify-between items-center hover:bg-accent/10 cursor-pointer"
                  onClick={() => onSelectTemplate?.(template)}
                >
                  <div>
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {months.find(m => m.value === template.startMonth)?.label} - {months.find(m => m.value === template.endMonth)?.label}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="font-medium">×{template.pointsMultiplier}</span>
                    <p className="text-sm text-muted-foreground">Point Multiplier</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-6 bg-muted/30 rounded-md">
              <CalendarIcon className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
              <h3 className="font-medium mb-1">No Templates Available</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first seasonal promotion template
              </p>
            </div>
          )}
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">Create Template</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Seasonal Template</DialogTitle>
                <DialogDescription>
                  Create a new template for seasonal promotions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div>
                  <Label htmlFor="template-name">Template Name</Label>
                  <Input 
                    id="template-name"
                    name="name"
                    value={newTemplate.name || ''}
                    onChange={handleInputChange}
                    placeholder="e.g. Holiday Season Special"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="start-month">Start Month</Label>
                    <Select
                      value={String(newTemplate.startMonth)}
                      onValueChange={(value) => handleSelectChange('startMonth', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month.value} value={String(month.value)}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="end-month">End Month</Label>
                    <Select
                      value={String(newTemplate.endMonth)}
                      onValueChange={(value) => handleSelectChange('endMonth', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {months.map(month => (
                          <SelectItem key={month.value} value={String(month.value)}>
                            {month.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="points-multiplier">Points Multiplier</Label>
                  <Input 
                    id="points-multiplier"
                    name="pointsMultiplier"
                    type="number"
                    step="0.1"
                    min="1"
                    value={newTemplate.pointsMultiplier || 1.5}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div>
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea 
                    id="template-description"
                    name="description"
                    value={newTemplate.description || ''}
                    onChange={handleInputChange}
                    placeholder="Describe the seasonal promotion"
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleCreateTemplate}>Create Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
