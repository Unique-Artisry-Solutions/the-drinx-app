
/**
 * Admin utility functions for system management
 */

import { supabase } from '@/lib/supabase';
import { SystemSetting } from '@/types/SupabaseTables';

/**
 * Updates a system setting in the database
 */
export const updateSystemSetting = async (id: string, value: any, reason?: string) => {
  try {
    // First check if the setting exists
    const { data: setting, error: fetchError } = await supabase
      .from('system_settings')
      .select('*')
      .eq('id', id)
      .single();
      
    if (fetchError) throw new Error(fetchError.message);
    if (!setting) throw new Error('Setting not found');
    
    let changeReasonRequired = setting.is_protected;
    
    if (changeReasonRequired && !reason) {
      throw new Error('Change reason is required for protected settings');
    }
    
    // Update the setting
    const { data: updatedSetting, error: updateError } = await supabase
      .from('system_settings')
      .update({ 
        value, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id)
      .select()
      .single();
      
    if (updateError) throw new Error(updateError.message);
    
    // If change reason is provided or required, log it to the audit log
    if (reason || changeReasonRequired) {
      const { error: auditError } = await supabase
        .from('system_settings_audit_log')
        .insert({
          setting_key: setting.key,
          old_value: setting.value,
          new_value: value,
          change_reason: reason
        });
        
      if (auditError) {
        console.error('Error logging setting change:', auditError);
      }
    }
    
    return updatedSetting as SystemSetting;
  } catch (err) {
    console.error('Error updating system setting:', err);
    throw err;
  }
};
