import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/auth';

export interface SMSTemplate {
  id: string;
  name: string;
  template_key: string;
  message_template: string;
  variables: Record<string, any>;
  category: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateSMSTemplateParams {
  name: string;
  templateKey: string;
  messageTemplate: string;
  variables?: Record<string, any>;
  category?: string;
}

export const useSMSTemplates = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Get all active SMS templates
  const getTemplates = useQuery({
    queryKey: ['sms-templates'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sms_templates')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  // Get templates by category
  const getTemplatesByCategory = (category: string) => {
    return useQuery({
      queryKey: ['sms-templates', category],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('sms_templates')
          .select('*')
          .eq('category', category)
          .eq('is_active', true)
          .order('name');

        if (error) throw error;
        return data || [];
      }
    });
  };

  // Create SMS template (admin only)
  const createTemplate = useMutation({
    mutationFn: async (params: CreateSMSTemplateParams) => {
      if (!user?.id) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('sms_templates')
        .insert({
          name: params.name,
          template_key: params.templateKey,
          message_template: params.messageTemplate,
          variables: params.variables || {},
          category: params.category || 'general',
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sms-templates'] });
      toast({
        title: 'Template Created',
        description: 'SMS template created successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Template Creation Failed',
        description: error.message || 'Failed to create SMS template',
        variant: 'destructive'
      });
    }
  });

  // Update SMS template
  const updateTemplate = useMutation({
    mutationFn: async (params: { id: string; updates: Partial<SMSTemplate> }) => {
      const { data, error } = await supabase
        .from('sms_templates')
        .update(params.updates)
        .eq('id', params.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sms-templates'] });
      toast({
        title: 'Template Updated',
        description: 'SMS template updated successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update template',
        variant: 'destructive'
      });
    }
  });

  // Delete template
  const deleteTemplate = useMutation({
    mutationFn: async (templateId: string) => {
      // Soft delete by setting is_active to false
      const { error } = await supabase
        .from('sms_templates')
        .update({ is_active: false })
        .eq('id', templateId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sms-templates'] });
      toast({
        title: 'Template Deleted',
        description: 'SMS template deleted successfully'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Delete Failed',
        description: error.message || 'Failed to delete template',
        variant: 'destructive'
      });
    }
  });

  // Process template with variables
  const processTemplate = (template: string, variables: Record<string, any> = {}): string => {
    let processed = template;
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`;
      processed = processed.replace(new RegExp(placeholder, 'g'), String(value));
    }
    return processed;
  };

  // Get template categories
  const getCategories = useQuery({
    queryKey: ['sms-template-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sms_templates')
        .select('category')
        .eq('is_active', true);

      if (error) throw error;
      
      // Get unique categories
      const categories = [...new Set(data?.map(item => item.category) || [])];
      return categories;
    }
  });

  return {
    templates: getTemplates.data || [],
    isLoading: getTemplates.isLoading,
    categories: getCategories.data || [],
    createTemplate,
    updateTemplate,
    deleteTemplate,
    getTemplatesByCategory,
    processTemplate,
    refetch: getTemplates.refetch
  };
};