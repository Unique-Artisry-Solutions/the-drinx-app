
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface LoyaltyProgram {
  id?: string;
  name: string;
  description: string;
  pointsPerPurchase: number;
  pointsPerDollar: number;
  isActive: boolean;
  enrollmentBonus: number;
  referralBonus: number;
  birthMonthBonus: number;
}

interface ProgramConfigSectionProps {
  program: LoyaltyProgram;
  onSave: (program: LoyaltyProgram) => void;
}

const ProgramConfigSection: React.FC<ProgramConfigSectionProps> = ({ program, onSave }) => {
  const [formData, setFormData] = useState<LoyaltyProgram>(program);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: parseInt(value, 10) || 0 }));
  };
  
  const handleToggleActive = (checked: boolean) => {
    setFormData(prev => ({ ...prev, isActive: checked }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onSave(formData);
      setIsSaving(false);
    }, 800);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Program Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Program Name</Label>
              <Input 
                id="name" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter program name"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter a description visible to customers"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pointsPerPurchase">Points Per Purchase</Label>
                <Input 
                  id="pointsPerPurchase" 
                  name="pointsPerPurchase"
                  type="number"
                  value={formData.pointsPerPurchase}
                  onChange={handleNumberChange}
                  min={0}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Points awarded for each completed purchase</p>
              </div>
              
              <div>
                <Label htmlFor="pointsPerDollar">Points Per Dollar</Label>
                <Input 
                  id="pointsPerDollar" 
                  name="pointsPerDollar"
                  type="number"
                  value={formData.pointsPerDollar}
                  onChange={handleNumberChange}
                  min={0}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Points awarded for each dollar spent</p>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-2">
              <h4 className="font-medium mb-3">Bonus Points</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="enrollmentBonus">Enrollment Bonus</Label>
                  <Input 
                    id="enrollmentBonus" 
                    name="enrollmentBonus"
                    type="number"
                    value={formData.enrollmentBonus}
                    onChange={handleNumberChange}
                    min={0}
                  />
                </div>
                
                <div>
                  <Label htmlFor="referralBonus">Referral Bonus</Label>
                  <Input 
                    id="referralBonus" 
                    name="referralBonus"
                    type="number"
                    value={formData.referralBonus}
                    onChange={handleNumberChange}
                    min={0}
                  />
                </div>
                
                <div>
                  <Label htmlFor="birthMonthBonus">Birthday Month Bonus</Label>
                  <Input 
                    id="birthMonthBonus" 
                    name="birthMonthBonus"
                    type="number"
                    value={formData.birthMonthBonus}
                    onChange={handleNumberChange}
                    min={0}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between border-t pt-4 mt-2">
              <div className="space-y-0.5">
                <Label htmlFor="isActive" className="text-base">Program Status</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.isActive ? 'Program is currently active and visible to customers' : 'Program is inactive and hidden from customers'}
                </p>
              </div>
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={handleToggleActive}
              />
            </div>
            
            <div className="flex justify-end mt-6">
              <Button type="submit" disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProgramConfigSection;
