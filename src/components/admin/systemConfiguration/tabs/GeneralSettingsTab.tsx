
import React from 'react';
import { SettingsTabProps } from './types';

const GeneralSettingsTab: React.FC<SettingsTabProps> = ({
  settings,
  isLoading,
  editingSettingId,
  editValue,
  onEdit,
  onSave,
  onCancel,
  onEditValueChange,
  isSubmitting,
  error,
  onEditClick,
  onSaveClick,
  onCancelClick,
  setEditValue,
  changeReason,
  setChangeReason
}) => {
  // Filter for general settings only
  const generalSettings = settings.filter(s => s.category === 'general');

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">General Settings</h2>
      {/* Tab content would go here */}
      <div className="text-muted-foreground">
        General system settings would be displayed here.
      </div>
    </div>
  );
};

export default GeneralSettingsTab;
