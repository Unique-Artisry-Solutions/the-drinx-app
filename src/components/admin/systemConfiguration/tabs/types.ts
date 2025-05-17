
// Define SystemSetting interface directly
export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description?: string;
  category: string;
  is_protected: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SettingsTabProps {
  settings?: SystemSetting[];
  isLoading?: boolean;
  editingSettingId?: string | null;
  editValue?: any;
  changeReason?: string;
  onEdit?: (id: string, currentValue: any) => void;
  onSave?: (id: string, isProtected: boolean) => void;
  onCancel?: () => void;
  onEditValueChange?: (value: any) => void;
  setChangeReason?: (reason: string) => void;
  error?: Error | null;
  isSubmitting?: boolean;
}
