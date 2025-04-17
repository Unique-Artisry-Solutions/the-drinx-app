
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Crown } from 'lucide-react';

interface VipPerksStepProps {
  vipWizard: any; // Using any for brevity, ideally would use a proper type
}

const VipPerksStep: React.FC<VipPerksStepProps> = ({ vipWizard }) => {
  const [newPerk, setNewPerk] = useState('');

  const handleAddCustomPerk = () => {
    if (newPerk.trim()) {
      vipWizard.addCustomPerk(newPerk.trim());
      setNewPerk('');
    }
  };

  return (
    <div className="space-y-5">
      <p className="text-muted-foreground">
        Customize the VIP experience by selecting the perks that will be included.
      </p>
      
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Standard VIP Perks</h3>
        
        <div className="space-y-4">
          {/* Skip Lines */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="skipLines" className="text-base">Skip Lines</Label>
              <p className="text-sm text-muted-foreground">Allow VIP guests to skip regular lines at venues</p>
            </div>
            <Switch
              id="skipLines"
              checked={vipWizard.skipLines}
              onCheckedChange={vipWizard.setSkipLines}
            />
          </div>
          
          {/* Priority Seating */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="prioritySeating" className="text-base">Priority Seating</Label>
              <p className="text-sm text-muted-foreground">Reserved seating areas at all venues</p>
            </div>
            <Switch
              id="prioritySeating"
              checked={vipWizard.prioritySeating}
              onCheckedChange={vipWizard.setPrioritySeating}
            />
          </div>
          
          {/* Complimentary Drinks */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="freeDrinks" className="text-base">Complimentary Drinks</Label>
              <p className="text-sm text-muted-foreground">Number of free signature drinks included</p>
            </div>
            <Input
              id="freeDrinks"
              type="number"
              min="0"
              max="10"
              value={vipWizard.freeDrinks}
              onChange={(e) => vipWizard.setFreeDrinks(parseInt(e.target.value) || 0)}
              className="w-20"
            />
          </div>
          
          {/* Exclusive Areas */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="exclusiveAccess" className="text-base">Exclusive Areas</Label>
              <p className="text-sm text-muted-foreground">Access to VIP-only areas at venues</p>
            </div>
            <Switch
              id="exclusiveAccess"
              checked={vipWizard.exclusiveAccess}
              onCheckedChange={vipWizard.setExclusiveAccess}
            />
          </div>
          
          {/* Merchandise */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="merchandise" className="text-base">Merchandise</Label>
              <p className="text-sm text-muted-foreground">Exclusive Swig Circuit merchandise</p>
            </div>
            <Switch
              id="merchandise"
              checked={vipWizard.merchandise}
              onCheckedChange={vipWizard.setMerchandise}
            />
          </div>
          
          {/* Meet & Greet */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="meetAndGreet" className="text-base">Meet & Greet</Label>
              <p className="text-sm text-muted-foreground">Opportunity to meet venue owners/mixologists</p>
            </div>
            <Switch
              id="meetAndGreet"
              checked={vipWizard.meetAndGreet}
              onCheckedChange={vipWizard.setMeetAndGreet}
            />
          </div>
        </div>
        
        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-3">Custom Perks</h3>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="E.g., Professional photoshoot"
                value={newPerk}
                onChange={(e) => setNewPerk(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newPerk.trim()) {
                    e.preventDefault();
                    handleAddCustomPerk();
                  }
                }}
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleAddCustomPerk}
                disabled={!newPerk.trim()}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            
            {vipWizard.customPerks.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-3">
                {vipWizard.customPerks.map((perk: string, index: number) => (
                  <Badge key={index} variant="outline" className="flex items-center gap-1 bg-purple-50 text-purple-700 hover:bg-purple-100">
                    {perk}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => vipWizard.removeCustomPerk(index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No custom perks added yet.</p>
            )}
          </div>
        </div>
      </div>
      
      <Card className="bg-purple-50 border-purple-200">
        <CardContent className="p-4 flex items-start space-x-3">
          <Crown className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-medium text-purple-800 mb-1">Pro Tip</h4>
            <p className="text-sm text-purple-700">
              The most successful VIP packages offer exclusive experiences that regular ticket holders 
              can't access. Consider adding unique touches like private tastings or personalized souvenirs.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VipPerksStep;
