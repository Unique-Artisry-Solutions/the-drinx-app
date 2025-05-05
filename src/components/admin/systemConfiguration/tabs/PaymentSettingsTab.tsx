
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SystemSettingsTable from '../SystemSettingsTable';
import { SystemSetting } from '@/types/SupabaseTables';
import { InfoCircle } from 'lucide-react';

interface PaymentSettingsTabProps {
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

const PaymentSettingsTab: React.FC<PaymentSettingsTabProps> = ({
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Gateway Settings</CardTitle>
        <CardDescription>Configure payment processing settings</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <InfoCircle className="h-5 w-5 text-blue-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Service Fee Configuration</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Changes to the service fee percentage will affect all future transactions. The percentage is applied to the total transaction amount before checkout.</p>
                <p className="mt-1">For security reasons, changing this setting requires a reason to be provided.</p>
              </div>
            </div>
          </div>
        </div>
        
        <SystemSettingsTable
          settings={settings}
          isLoading={isLoading}
          editingSettingId={editingSettingId}
          editValue={editValue}
          changeReason={changeReason}
          onEditClick={onEditClick}
          onSaveClick={onSaveClick}
          onCancelClick={onCancelClick}
          setEditValue={setEditValue}
          setChangeReason={setChangeReason}
        />
      </CardContent>
    </Card>
  );
};

export default PaymentSettingsTab;
