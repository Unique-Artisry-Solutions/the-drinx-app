
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SystemSetting } from '@/types/SupabaseTables';
import { useDebouncedToast } from '@/hooks/useDebouncedToast';

interface SystemSettingsTableProps {
  settings: SystemSetting[];
  isLoading: boolean;
  editingSettingId: string | null;
  editValue: any;
  changeReason: string;
  onEditClick: (settingId: string, currentValue: any) => void;
  onSaveClick: (settingId: string, isProtected: boolean) => void;
  onCancelClick: () => void;
  setEditValue: (value: any) => void;
  setChangeReason: (reason: string) => void;
}

const SystemSettingsTable: React.FC<SystemSettingsTableProps> = ({
  settings,
  isLoading,
  editingSettingId,
  editValue,
  changeReason,
  onEditClick,
  onSaveClick,
  onCancelClick,
  setEditValue,
  setChangeReason,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);
  const { showError } = useDebouncedToast();

  // Validate service fee percentage
  const validateServiceFee = (value: string): string | null => {
    const numericValue = parseFloat(value);
    
    if (isNaN(numericValue)) {
      return 'Service fee must be a valid number';
    }
    
    if (numericValue < 0) {
      return 'Service fee cannot be negative';
    }
    
    if (numericValue > 10) {
      return 'Service fee cannot exceed 10%';
    }
    
    return null;
  };

  // Handle input value change with validation
  const handleValueChange = (value: string, settingKey: string) => {
    setEditValue(value);
    
    if (settingKey === 'payment.service_fee_percentage') {
      const error = validateServiceFee(value);
      setValidationError(error);
    } else {
      setValidationError(null);
    }
  };

  // Enhanced save handler with validation
  const handleSave = (settingId: string, isProtected: boolean) => {
    const setting = settings.find(s => s.id === settingId);
    
    if (setting?.key === 'payment.service_fee_percentage') {
      const error = validateServiceFee(editValue);
      if (error) {
        showError('Validation Error', error);
        return;
      }
    }
    
    onSaveClick(settingId, isProtected);
  };
  const renderSettingValue = (value: any) => {
    if (value === null || value === undefined) return 'null';
    
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false';
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    
    return String(value);
  };

  if (isLoading) {
    return <div className="flex justify-center py-6"><div className="loader">Loading...</div></div>;
  }

  if (!settings || settings.length === 0) {
    return <div className="text-center py-6 text-muted-foreground">No settings found for this category.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left p-2">Name</th>
            <th className="text-left p-2">Description</th>
            <th className="text-left p-2">Value</th>
            <th className="text-left p-2 w-24">Actions</th>
          </tr>
        </thead>
        <tbody>
          {settings.map((setting) => (
            <tr key={setting.id} className="border-b hover:bg-muted/50">
              <td className="p-2 font-medium">{setting.key}</td>
              <td className="p-2 text-muted-foreground">{setting.description || '-'}</td>
              <td className="p-2">
                {editingSettingId === setting.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editValue}
                      onChange={(e) => handleValueChange(e.target.value, setting.key)}
                      className="w-full"
                      placeholder={setting.key === 'payment.service_fee_percentage' ? 'Enter percentage (0-10)' : undefined}
                    />
                    {validationError && (
                      <Alert variant="destructive">
                        <AlertDescription>{validationError}</AlertDescription>
                      </Alert>
                    )}
                    {setting.key === 'payment.service_fee_percentage' && !validationError && editValue && (
                      <div className="text-sm text-muted-foreground">
                        Preview: {editValue}% service fee on transactions
                      </div>
                    )}
                    {setting.is_protected && (
                      <div>
                        <Label htmlFor="changeReason">Reason for change (required):</Label>
                        <Input
                          id="changeReason"
                          value={changeReason}
                          onChange={(e) => setChangeReason(e.target.value)}
                          placeholder="Provide a reason for this change"
                          className="w-full mt-1"
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <pre className="whitespace-pre-wrap break-all bg-muted p-2 rounded text-sm max-h-24 overflow-auto">
                      {renderSettingValue(setting.value)}
                    </pre>
                    {setting.key === 'payment.service_fee_percentage' && (
                      <div className="text-xs text-muted-foreground mt-1">
                        Current service fee: {setting.value}%
                      </div>
                    )}
                  </div>
                )}
              </td>
              <td className="p-2">
                {editingSettingId === setting.id ? (
                  <div className="flex flex-col space-y-2">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleSave(setting.id, setting.is_protected)}
                      disabled={
                        (setting.is_protected && !changeReason) || 
                        validationError !== null
                      }
                    >
                      Save
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => {
                        onCancelClick();
                        setValidationError(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => onEditClick(setting.id, setting.value)}
                  >
                    Edit
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SystemSettingsTable;
