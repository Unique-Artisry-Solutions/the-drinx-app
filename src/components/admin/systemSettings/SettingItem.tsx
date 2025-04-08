
import React, { useState } from 'react';
import { SystemSetting, SettingsUpdatePayload } from '@/types/SystemSettingsTypes';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Shield } from 'lucide-react';

interface SettingItemProps {
  setting: SystemSetting;
  onUpdate: (payload: SettingsUpdatePayload) => Promise<boolean>;
}

const SettingItem: React.FC<SettingItemProps> = ({ setting, onUpdate }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [changeReason, setChangeReason] = useState('');
  const [tempValue, setTempValue] = useState<any>(null);
  
  // Parse setting value
  const getValue = () => {
    try {
      if (setting.value === 'true') return true;
      if (setting.value === 'false') return false;
      return JSON.parse(setting.value);
    } catch (err) {
      return setting.value;
    }
  };
  
  const currentValue = getValue();
  
  // Determine setting input type
  const isBoolean = typeof currentValue === 'boolean';
  const isNumeric = typeof currentValue === 'number';
  const isObject = typeof currentValue === 'object' && currentValue !== null;
  
  const handleToggle = async (checked: boolean) => {
    if (setting.is_protected) {
      setTempValue(checked);
      setDialogOpen(true);
      return;
    }
    
    await onUpdate({
      key: setting.key,
      value: JSON.stringify(checked)
    });
  };

  const handleInputChange = async (value: string) => {
    if (setting.is_protected) {
      setTempValue(isNumeric ? Number(value) : value);
      setDialogOpen(true);
      return;
    }
    
    await onUpdate({
      key: setting.key,
      value: isNumeric ? JSON.stringify(Number(value)) : JSON.stringify(value)
    });
  };

  const handleConfirmProtectedChange = async () => {
    const result = await onUpdate({
      key: setting.key,
      value: JSON.stringify(tempValue),
      change_reason: changeReason
    });
    
    if (result) {
      setDialogOpen(false);
      setChangeReason('');
    }
  };
  
  const getKeyDisplay = () => {
    const parts = setting.key.split('.');
    if (parts.length > 1) {
      return (
        <span>
          <span className="text-muted-foreground">{parts[0]}.</span>
          <span>{parts.slice(1).join('.')}</span>
        </span>
      );
    }
    return setting.key;
  };
  
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="flex items-center gap-2">
          {setting.is_protected && <Shield className="h-3 w-3 text-amber-500" />}
          <span className="font-medium">{getKeyDisplay()}</span>
        </div>
        {setting.description && (
          <p className="text-xs text-muted-foreground">{setting.description}</p>
        )}
      </div>
      
      <div>
        {isBoolean ? (
          <Switch 
            checked={currentValue} 
            onCheckedChange={handleToggle}
          />
        ) : isObject ? (
          <Badge variant="outline" className="cursor-not-allowed">
            Complex value
          </Badge>
        ) : (
          <Input 
            className="w-[120px] h-8"
            value={isNumeric ? currentValue : currentValue?.toString() || ''}
            onChange={(e) => handleInputChange(e.target.value)}
            type={isNumeric ? 'number' : 'text'}
          />
        )}
      </div>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Setting Change</DialogTitle>
            <DialogDescription>
              This is a protected setting. Please provide a reason for this change.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <p className="font-medium">{setting.key}</p>
              <p className="text-xs text-muted-foreground">{setting.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1">Current Value</p>
                <Badge variant="outline">{JSON.stringify(currentValue)}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">New Value</p>
                <Badge variant="outline">{JSON.stringify(tempValue)}</Badge>
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-1">Change Reason</p>
              <Textarea
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Please explain why this protected setting is being changed"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleConfirmProtectedChange}
              disabled={!changeReason.trim()}
            >
              Confirm Change
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingItem;
