
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SystemSettingsTable from '../SystemSettingsTable';
import { SettingsTabProps } from '../types';
import { Button } from '@/components/ui/button';
import { Plus, Shield, FileText } from 'lucide-react';
import EmptyState from '../EmptyState';

const SecuritySettingsTab: React.FC<SettingsTabProps> = ({
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
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Configure security and authentication settings</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <FileText className="h-4 w-4" /> View Audit Log
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
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <Shield className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">Security Warning</h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>These settings directly affect the security of your application.</p>
                    <p className="mt-1">Changes to these settings will be logged in the audit trail.</p>
                    <p className="mt-1">A reason must be provided when changing protected security settings.</p>
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
            title="No security settings found" 
            description="Configure security settings to protect your application and user data."
            icon="Shield" 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default SecuritySettingsTab;
