
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Crown } from 'lucide-react';

interface VipBasicDetailsStepProps {
  vipWizard: any; // Using any for brevity, ideally would use a proper type
}

const VipBasicDetailsStep: React.FC<VipBasicDetailsStepProps> = ({ vipWizard }) => {
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Let's start by setting up the basic details for your VIP package.
      </p>
      
      <div className="space-y-4">
        <div className="grid gap-3">
          <Label htmlFor="vipName">Package Name</Label>
          <Input
            id="vipName"
            placeholder="VIP Experience"
            value={vipWizard.name}
            onChange={(e) => vipWizard.setName(e.target.value)}
          />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="vipPrice">Price ($)</Label>
          <Input
            id="vipPrice"
            type="number"
            min="0"
            step="0.01"
            placeholder="75.00"
            value={vipWizard.price}
            onChange={(e) => vipWizard.setPrice(parseFloat(e.target.value) || 0)}
          />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="vipDescription">Description</Label>
          <Textarea
            id="vipDescription"
            placeholder="Premium access and exclusive perks for your Swig Circuit experience."
            value={vipWizard.description}
            onChange={(e) => vipWizard.setDescription(e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="grid gap-3">
          <Label htmlFor="vipLimit">
            Ticket Limit 
            <span className="text-sm text-muted-foreground ml-2">(Limited availability increases perceived value)</span>
          </Label>
          <Input
            id="vipLimit"
            type="number"
            min="1"
            placeholder="10"
            value={vipWizard.limit}
            onChange={(e) => vipWizard.setLimit(parseInt(e.target.value) || undefined)}
          />
        </div>
      </div>
      
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4 flex items-start space-x-3">
          <Crown className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-purple-800 mb-1">Pro Tip</h4>
            <p className="text-sm text-purple-700">
              VIP packages typically sell best when priced at 2-3 times the standard ticket
              price. Consider what unique value you're offering to justify the premium.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VipBasicDetailsStep;
