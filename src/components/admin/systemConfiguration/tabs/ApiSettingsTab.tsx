
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SystemSettingsTable from '../SystemSettingsTable';
import { SystemSetting } from '@/types/SupabaseTables';

interface ApiSettingsTabProps {
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

const ApiSettingsTab: React.FC<ApiSettingsTabProps> = ({
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
        <CardTitle>API Settings</CardTitle>
        <CardDescription>Manage API keys and integration settings</CardDescription>
      </CardHeader>
      <CardContent>
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

export default ApiSettingsTab;
