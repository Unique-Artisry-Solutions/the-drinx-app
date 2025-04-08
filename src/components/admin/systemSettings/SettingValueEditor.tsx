
import React, { useState } from 'react';
import { SystemSetting, SettingsUpdatePayload } from '@/types/SystemSettingsTypes';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { JsonView } from '@/components/admin/systemSettings/JsonView';
import { Edit2, Save } from 'lucide-react';

interface SettingValueEditorProps {
  setting: SystemSetting;
  onUpdate: (payload: SettingsUpdatePayload) => Promise<boolean>;
}

const SettingValueEditor: React.FC<SettingValueEditorProps> = ({ setting, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState<string | number | boolean>(setting.value);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [changeReason, setChangeReason] = useState('');
  
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
  const isArray = Array.isArray(currentValue);
  const isObject = typeof currentValue === 'object' && currentValue !== null && !isArray;
  const isComplex = isArray || isObject;
  
  const handleToggleEdit = () => {
    setEditValue(currentValue);
    setIsEditing(true);
  };
  
  const handleToggleBoolean = async (checked: boolean) => {
    if (setting.is_protected) {
      setEditValue(checked);
      setDialogOpen(true);
      return;
    }
    
    await onUpdate({
      key: setting.key,
      value: JSON.stringify(checked)
    });
  };
  
  const handleComplexEdit = () => {
    // Open a JSON editor dialog
    console.log("Complex editing not implemented yet");
  };
  
  const handleSave = async () => {
    if (setting.is_protected) {
      setDialogOpen(true);
      return;
    }
    
    const result = await onUpdate({
      key: setting.key,
      value: isBoolean 
        ? JSON.stringify(editValue) 
        : isNumeric 
          ? JSON.stringify(Number(editValue))
          : JSON.stringify(editValue)
    });
    
    if (result) {
      setIsEditing(false);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setEditValue(currentValue);
  };
  
  const handleConfirmProtectedChange = async () => {
    const result = await onUpdate({
      key: setting.key,
      value: isBoolean 
        ? JSON.stringify(editValue)
        : isNumeric 
          ? JSON.stringify(Number(editValue)) 
          : JSON.stringify(editValue),
      change_reason: changeReason
    });
    
    if (result) {
      setDialogOpen(false);
      setChangeReason('');
      setIsEditing(false);
    }
  };
  
  if (isBoolean) {
    return (
      <Switch 
        checked={currentValue} 
        onCheckedChange={handleToggleBoolean}
      />
    );
  }
  
  if (isComplex) {
    return (
      <div className="flex flex-col items-end">
        <div className="mb-1 max-w-xs overflow-hidden text-ellipsis text-xs">
          <JsonView data={currentValue} />
        </div>
        <Button size="sm" variant="outline" onClick={handleComplexEdit}>
          <Edit2 className="h-3 w-3 mr-1" />
          Edit
        </Button>
      </div>
    );
  }
  
  if (isEditing) {
    return (
      <div className="flex items-center gap-2 justify-end">
        <Input
          className="w-[120px] h-8 text-right"
          value={editValue?.toString() || ''}
          onChange={(e) => setEditValue(e.target.value)}
          type={isNumeric ? 'number' : 'text'}
        />
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
          <Button size="sm" variant="default" onClick={handleSave}>
            <Save className="h-3 w-3 mr-1" />
            Save
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2 justify-end">
      <Badge variant={isNumeric ? "secondary" : "outline"}>
        {currentValue?.toString() || ''}
      </Badge>
      <Button size="sm" variant="ghost" onClick={handleToggleEdit}>
        <Edit2 className="h-3 w-3" />
      </Button>
      
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
                <Badge variant="outline">{JSON.stringify(editValue)}</Badge>
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

export default SettingValueEditor;
