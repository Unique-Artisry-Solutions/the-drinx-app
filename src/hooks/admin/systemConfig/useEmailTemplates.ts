
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SystemEmailTemplate } from '@/types/SupabaseTables';

interface UseEmailTemplatesResult {
  emailTemplates: SystemEmailTemplate[];
  isLoading: boolean;
  error: string | null;
  fetchEmailTemplates: () => Promise<void>;
  updateEmailTemplate: (id: string, updates: Partial<SystemEmailTemplate>) => Promise<SystemEmailTemplate | null>;
  createEmailTemplate: (template: Partial<SystemEmailTemplate>) => Promise<SystemEmailTemplate | null>;
  deleteEmailTemplate: (id: string) => Promise<boolean>;
  previewEmailTemplate: (id: string, testData?: Record<string, any>) => Promise<string | null>;
}

export const useEmailTemplates = (): UseEmailTemplatesResult => {
  const [emailTemplates, setEmailTemplates] = useState<SystemEmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEmailTemplates = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .select('*')
        .order('name');
        
      if (error) throw new Error(error.message);
      setEmailTemplates(data || []);
    } catch (err) {
      console.error('Error fetching email templates:', err);
      setError(err instanceof Error ? err.message : 'Failed to load email templates');
      toast({
        title: 'Error',
        description: 'Failed to load email templates. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmailTemplate = async (id: string, updates: Partial<SystemEmailTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
          last_updated_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setEmailTemplates(prev => 
        prev.map(template => template.id === id ? data as SystemEmailTemplate : template)
      );
      
      toast({
        title: 'Success',
        description: 'Email template updated successfully.',
      });
      
      return data as SystemEmailTemplate;
    } catch (err) {
      console.error('Error updating email template:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to update email template',
        variant: 'destructive'
      });
      return null;
    }
  };

  const createEmailTemplate = async (template: Partial<SystemEmailTemplate>) => {
    try {
      const { data, error } = await supabase
        .from('email_templates')
        .insert({
          ...template,
          is_active: template.is_active ?? true,
          variables: template.variables ?? [],
          last_updated_by: (await supabase.auth.getUser()).data.user?.id,
        })
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setEmailTemplates(prev => [...prev, data as SystemEmailTemplate]);
      
      toast({
        title: 'Success',
        description: 'Email template created successfully.',
      });
      
      return data as SystemEmailTemplate;
    } catch (err) {
      console.error('Error creating email template:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to create email template',
        variant: 'destructive'
      });
      return null;
    }
  };

  const deleteEmailTemplate = async (id: string) => {
    try {
      const { error } = await supabase
        .from('email_templates')
        .delete()
        .eq('id', id);
        
      if (error) throw new Error(error.message);
      
      // Update local state
      setEmailTemplates(prev => prev.filter(template => template.id !== id));
      
      toast({
        title: 'Success',
        description: 'Email template deleted successfully.',
      });
      
      return true;
    } catch (err) {
      console.error('Error deleting email template:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to delete email template',
        variant: 'destructive'
      });
      return false;
    }
  };

  const previewEmailTemplate = async (id: string, testData?: Record<string, any>) => {
    try {
      // In a real implementation, this would call a server endpoint to render the template
      // For now, we'll just return the template with variables replaced
      const template = emailTemplates.find(t => t.id === id);
      if (!template) throw new Error('Template not found');
      
      // Simple variable substitution
      let preview = template.body_html;
      if (testData) {
        Object.entries(testData).forEach(([key, value]) => {
          preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), String(value));
        });
      }
      
      return preview;
    } catch (err) {
      console.error('Error previewing email template:', err);
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to preview email template',
        variant: 'destructive'
      });
      return null;
    }
  };

  return {
    emailTemplates,
    isLoading,
    error,
    fetchEmailTemplates,
    updateEmailTemplate,
    createEmailTemplate,
    deleteEmailTemplate,
    previewEmailTemplate
  };
};
