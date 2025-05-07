import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SystemSettingsTable from '../SystemSettingsTable';
import { SystemSetting } from '@/types/SupabaseTables';
import { AlertCircle, Info, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  // Filter payment-related settings
  const paymentSettings = settings.filter(
    setting => setting.key.startsWith('payment.') || setting.category === 'payment'
  );
  
  // Filter fee-related settings
  const feeSettings = settings.filter(
    setting => setting.key.includes('fee') || setting.key.includes('commission')
  );
  
  // Filter gateway-related settings
  const gatewaySettings = settings.filter(
    setting => setting.key.includes('gateway') || setting.key.includes('provider')
  );

  return (
    <div className="space-y-6">
      {/* Processing Fee Section */}
      <Card>
        <CardHeader>
          <CardTitle>Processing Fees</CardTitle>
          <CardDescription>Configure platform fees, processing fees, and commission rates</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-6">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              Changes to fee percentages will affect all future transactions. Fee changes require approval 
              and are logged for audit purposes.
            </AlertDescription>
          </Alert>
          
          {feeSettings.length > 0 ? (
            <SystemSettingsTable
              settings={feeSettings}
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
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No fee settings configured yet.</p>
              <div className="inline-flex items-center mt-2 text-sm text-primary cursor-pointer">
                <PlusCircle className="mr-1 h-4 w-4" /> 
                Add a new fee setting
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Payment Gateway Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Gateways</CardTitle>
          <CardDescription>Configure payment processor connections and API keys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <Info className="h-5 w-5 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">API Configuration</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>API keys for payment gateways should be stored securely. Keys will be partially masked when displayed.</p>
                  <p className="mt-1">For security reasons, changing these settings requires approval and is logged.</p>
                </div>
              </div>
            </div>
          </div>
          
          <SystemSettingsTable
            settings={gatewaySettings}
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

      {/* Other Payment Settings */}
      <Card>
        <CardHeader>
          <CardTitle>General Payment Settings</CardTitle>
          <CardDescription>Configure other payment-related settings</CardDescription>
        </CardHeader>
        <CardContent>
          <SystemSettingsTable
            settings={paymentSettings.filter(s => 
              !feeSettings.includes(s) && !gatewaySettings.includes(s)
            )}
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
    </div>
  );
};

export default PaymentSettingsTab;
