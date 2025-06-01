
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface RewardRule {
  id: string;
  establishment_id: string;
  name: string;
  description: string | null;
  event_type: string;
  conditions: any;
  actions: any;
  points: number;
  is_active: boolean;
  version: number;
  created_at: string;
  updated_at: string;
}

export function RewardRulesManagement() {
  const [rules, setRules] = useState<RewardRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('reward_rules')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform the data to match our interface
      const transformedRules: RewardRule[] = (data || []).map(rule => ({
        ...rule,
        description: rule.description || ''
      }));
      
      setRules(transformedRules);
    } catch (error) {
      console.error('Error fetching rules:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reward rules',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createRule = async () => {
    try {
      const newRule = {
        establishment_id: 'mock-establishment-id',
        name: 'New Rule',
        description: 'New reward rule',
        event_type: 'visit',
        conditions: {},
        actions: {},
        points: 10,
        is_active: true,
        version: 1
      };

      await supabase
        .from('reward_rules')
        .insert([newRule]);

      toast({
        title: 'Success',
        description: 'Reward rule created successfully',
      });
      
      fetchRules();
    } catch (error) {
      console.error('Error creating rule:', error);
      toast({
        title: 'Error',
        description: 'Failed to create reward rule',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Reward Rules Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading rules...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Reward Rules Management</CardTitle>
        <Button onClick={createRule}>
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </CardHeader>
      <CardContent>
        {rules.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No reward rules found. Create your first rule to get started.
          </p>
        ) : (
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{rule.name}</h3>
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{rule.points} points</span>
                    <span className={`text-xs px-2 py-1 rounded ${rule.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {rule.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
