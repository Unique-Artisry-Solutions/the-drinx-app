
import { SystemSetting } from '@/components/admin/systemConfiguration/tabs/types';

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
