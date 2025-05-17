
export interface SystemSetting {
  id: string;
  key: string;
  value: string;
  description?: string;
  type: 'string' | 'boolean' | 'number' | 'json';
  is_protected: boolean;
  category: string;
  updated_at: string;
  updated_by?: string;
}

export interface SettingsTabProps {
  settings: SystemSetting[];
  isLoading: boolean;
  editingSettingId: string | null;
  editValue: string;
  onEdit: (setting: SystemSetting) => void;
  onSave: (id: string, value: string) => Promise<void>;
  onCancel: () => void;
  onEditValueChange: (value: string) => void;
  isSubmitting: boolean;
  error: Error | null;
}
