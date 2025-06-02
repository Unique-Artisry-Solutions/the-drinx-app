
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SystemSettingsTable from '../SystemSettingsTable';
import { SettingsTabProps } from '../types';
import { Button } from '@/components/ui/button';
import { Plus, Key, Code } from 'lucide-react';
import EmptyState from '../EmptyState';

const ApiSettingsTab: React.FC<SettingsTabProps> = ({
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
            <CardTitle>API Settings</CardTitle>
            <CardDescription>Manage API keys and integration settings</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1">
              <Key className="h-4 w-4" /> Manage API Keys
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
            <div className="bg-violet-50 border border-violet-200 rounded-md p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <Code className="h-5 w-5 text-violet-500" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-violet-800">API Configuration</h3>
                  <div className="mt-2 text-sm text-violet-700">
                    <p>These settings control the behavior of your application's API.</p>
                    <p className="mt-1">Changes to rate limits or CORS settings may affect third-party integrations.</p>
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
            title="No API settings found" 
            description="Configure API settings to manage rate limits, authentication, and access control."
            icon="Code" 
          />
        )}
      </CardContent>
    </Card>
  );
};

export default ApiSettingsTab;
