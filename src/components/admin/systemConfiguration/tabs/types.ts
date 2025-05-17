
import { SystemSetting } from '@/types/SupabaseTables';

export { SystemSetting };

export interface SettingsTabProps {
  settings: SystemSetting[];
  isLoading: boolean;
  editingSettingId: string | null;
  editValue: any;
  changeReason: string;
  onEdit: (id: string, value: any) => void;
  onSave: (id: string, isProtected: boolean) => Promise<void>;
  onCancel: () => void;
  onEditValueChange: (value: any) => void;
  setChangeReason: (reason: string) => void;
  isSubmitting: boolean;
  error: Error | null;
  onEditClick: (id: string, currentValue: any) => void;
  onSaveClick: (id: string, isProtected: boolean) => void;
  onCancelClick: () => void;
  setEditValue: (value: any) => void;
}
