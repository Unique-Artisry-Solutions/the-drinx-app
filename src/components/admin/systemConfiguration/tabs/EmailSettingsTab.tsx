
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SystemSettingsTable from '../SystemSettingsTable';
import { SettingsTabProps } from '../types';
import { Button } from '@/components/ui/button';
import { Plus, Mail, Send } from 'lucide-react';
import EmptyState from '../EmptyState';

const EmailSettingsTab: React.FC<SettingsTabProps> = ({
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
            <CardTitle>Email & Notification Settings</CardTitle>
            <CardDescription>Configure email templates and notification settings</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <Send className="h-4 w-4" /> Test Email
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
                  <Mail className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">Email Configuration</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>These settings control how emails are sent from the system.</p>
                    <p className="mt-1">Make sure to test your email configuration after making changes.</p>
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
            title="No email settings found" 
            description="Configure your email settings to enable sending notifications to users."
            icon="Mail" 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default EmailSettingsTab;
