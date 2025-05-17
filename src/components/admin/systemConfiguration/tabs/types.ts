
export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: string;
  is_protected: boolean;
  updated_at: string;
}

export interface SettingsTabProps {
  settings: SystemSetting[];
  isLoading: boolean;
  editingSettingId: string | null;
  editValue: string;
  changeReason: string;
  onEdit: (id: string, value: any) => void;
  onSave: (id: string, isProtected: boolean) => Promise<void>;
  onCancel: () => void;
  onEditValueChange: (value: any) => void;
  setChangeReason: (reason: string) => void;
  isSubmitting: boolean;
  error: Error | null;
  onEditClick?: (id: string) => void;
  onSaveClick?: (id: string) => void;
  onCancelClick?: () => void;
  setEditValue: (value: string) => void;
}
