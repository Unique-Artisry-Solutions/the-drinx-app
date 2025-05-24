
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SystemSettingsTable from '../SystemSettingsTable';
import { SettingsTabProps } from '../types';
import { Button } from '@/components/ui/button';
import { Plus, Info } from 'lucide-react';
import EmptyState from '../EmptyState';

const GeneralSettingsTab: React.FC<SettingsTabProps> = ({
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
            <CardTitle>General Settings</CardTitle>
            <CardDescription>Manage system-wide configuration settings</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="gap-1">
            <Plus className="h-4 w-4" /> Add Setting
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {hasSettings ? (
          <>
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <Info className="h-5 w-5 text-blue-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">About General Settings</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>These settings control the core functionality of the application.</p>
                    <p className="mt-1">Changes to these settings will affect how the system operates.</p>
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
            title="No general settings found" 
            description="There are no general settings configured yet. Click the button above to add your first setting."
            icon="Settings" 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsTab;
