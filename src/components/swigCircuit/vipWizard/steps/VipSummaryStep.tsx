
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Plus, Trash2, Crown } from 'lucide-react';

interface VipSummaryStepProps {
  vipWizard: any; // Using any for brevity, ideally would use a proper type
}

const VipSummaryStep: React.FC<VipSummaryStepProps> = ({ vipWizard }) => {
  const [newBenefit, setNewBenefit] = useState('');
  
  const handleAddAdditionalBenefit = () => {
    if (newBenefit.trim()) {
      vipWizard.addAdditionalBenefit(newBenefit.trim());
      setNewBenefit('');
    }
  };
  
  const benefits = vipWizard.generateBenefits();
  
  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Review your VIP package and make any final adjustments before creating it.
      </p>
      
      <Card className="border-2 border-purple-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-spiritless-pink p-2">
          <h3 className="text-white font-semibold text-center flex items-center justify-center gap-1.5">
            <Crown className="h-4 w-4" />
            {vipWizard.name}
            <Crown className="h-4 w-4" />
          </h3>
        </div>
        <CardContent className="p-4 space-y-4">
          <div className="flex justify-between items-baseline">
            <div className="space-y-1">
              <span className="text-lg font-bold">${vipWizard.price.toFixed(2)}</span>
              {vipWizard.limit && (
                <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                  Limited: {vipWizard.limit} available
                </Badge>
              )}
            </div>
          </div>
          
          <p className="text-sm text-gray-600">{vipWizard.description}</p>
          
          <div className="space-y-2">
            <h4 className="text-sm font-medium">VIP Benefits:</h4>
            <div className="space-y-1">
              {benefits.map((benefit: string, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Additional Benefits</h3>
        <p className="text-sm text-muted-foreground">
          Add any other benefits not covered by the VIP perks selection.
        </p>
        
        <div className="flex items-center gap-2">
          <Input
            placeholder="E.g., Commemorative Swig Circuit lanyard"
            value={newBenefit}
            onChange={(e) => setNewBenefit(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && newBenefit.trim()) {
                e.preventDefault();
                handleAddAdditionalBenefit();
              }
            }}
          />
          <Button 
            variant="outline" 
            size="icon" 
            onClick={handleAddAdditionalBenefit}
            disabled={!newBenefit.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        {vipWizard.additionalBenefits.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {vipWizard.additionalBenefits.map((benefit: string, index: number) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1 bg-blue-50 text-blue-700 hover:bg-blue-100">
                {benefit}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => vipWizard.removeAdditionalBenefit(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        )}
      </div>
      
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4 flex items-start space-x-3">
          <Crown className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-green-800 mb-1">Ready to Create</h4>
            <p className="text-sm text-green-700">
              Your VIP package is set up and ready to go! Click "Create VIP Package" to add it to your ticket tiers.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VipSummaryStep;
