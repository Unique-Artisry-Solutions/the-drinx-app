
export type SystemSettingCategory = 'general' | 'features' | 'notifications' | 'analytics' | 'security' | 'moderation';

export interface SystemSetting {
  id: string;
  key: string;
  value: any;
  description: string | null;
  category: SystemSettingCategory;
  is_protected: boolean;
  created_at: string;
  updated_at: string;
  updated_by: string | null;
}

export interface SystemSettingAuditLog {
  id: string;
  setting_key: string;
  old_value: any | null;
  new_value: any;
  changed_by: string | null;
  changed_at: string;
  change_reason: string | null;
}

export interface SettingsUpdatePayload {
  key: string;
  value: any;
  change_reason?: string;
}
