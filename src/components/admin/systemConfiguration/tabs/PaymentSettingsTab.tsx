
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SystemSettingsTable from '../SystemSettingsTable';
import { SettingsTabProps } from '../types';
import { Button } from '@/components/ui/button';
import { Plus, Info, CreditCard, BarChart } from 'lucide-react';
import EmptyState from '../EmptyState';

const PaymentSettingsTab: React.FC<SettingsTabProps> = ({
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
  const hasSettings = settings && settings.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Payment Gateway Settings</CardTitle>
            <CardDescription>Configure payment processing settings</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <BarChart className="h-4 w-4" /> Revenue Report
            </Button>
            <Button size="sm" variant="outline" className="gap-1">
              <Plus className="h-4 w-4" /> Add Setting
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {hasSettings ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <CreditCard className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Service Fee Configuration</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>Changes to the service fee percentage will affect all future transactions. The percentage is applied to the total transaction amount before checkout.</p>
                    <p className="mt-1">For security reasons, changing this setting requires a reason to be provided.</p>
                    <p className="mt-1">Revenue from service fees is tracked in the analytics dashboard.</p>
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
          </>
        ) : (
          <EmptyState 
            title="No payment settings found" 
            description="Configure payment gateway settings to enable secure transaction processing."
            icon="CreditCard" 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentSettingsTab;
