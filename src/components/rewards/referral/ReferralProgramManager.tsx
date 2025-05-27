
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useReferralPrograms } from '@/hooks/promotional/useReferralPrograms';
import { ReferralProgram } from '@/types/promotional';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { Plus, Edit, Trash2, Users, TrendingUp } from 'lucide-react';

interface ReferralProgramFormData {
  name: string;
  description: string;
  referrer_reward_type: 'points' | 'percentage' | 'fixed';
  referrer_reward_value: number;
  referee_reward_type: 'points' | 'percentage' | 'fixed';
  referee_reward_value: number;
  max_uses_per_user?: number;
  expiration_date?: string;
  is_active: boolean;
}

export const ReferralProgramManager: React.FC = () => {
  const { user } = useAuth();
  const { programs, createProgram, updateProgram, isLoading } = useReferralPrograms(user?.id || '');
  const [isCreating, setIsCreating] = useState(false);
  const [editingProgram, setEditingProgram] = useState<ReferralProgram | null>(null);
  const [formData, setFormData] = useState<ReferralProgramFormData>({
    name: '',
    description: '',
    referrer_reward_type: 'points',
    referrer_reward_value: 100,
    referee_reward_type: 'points',
    referee_reward_value: 50,
    is_active: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingProgram) {
        await updateProgram({
          id: editingProgram.id,
          updates: formData
        });
        setEditingProgram(null);
      } else {
        await createProgram({
          ...formData,
          promoter_id: user?.id || '',
          tier_multipliers: {
            tier1: 1.0,
            tier2: 1.2,
            tier3: 1.5,
            tier4: 1.8,
            tier5: 2.0
          }
        });
      }
      
      setIsCreating(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save referral program:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      referrer_reward_type: 'points',
      referrer_reward_value: 100,
      referee_reward_type: 'points',
      referee_reward_value: 50,
      is_active: true
    });
  };

  const handleEdit = (program: ReferralProgram) => {
    setEditingProgram(program);
    setFormData({
      name: program.name,
      description: program.description || '',
      referrer_reward_type: program.referrer_reward_type as any,
      referrer_reward_value: program.referrer_reward_value,
      referee_reward_type: program.referee_reward_type as any,
      referee_reward_value: program.referee_reward_value,
      max_uses_per_user: program.max_uses_per_user || undefined,
      expiration_date: program.expiration_date || undefined,
      is_active: program.is_active
    });
    setIsCreating(true);
  };

  if (isLoading) {
    return <div className="p-4">Loading referral programs...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Referral Programs</h2>
        <Button
          onClick={() => setIsCreating(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Program
        </Button>
      </div>

      {(isCreating || editingProgram) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingProgram ? 'Edit Referral Program' : 'Create New Referral Program'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Program Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="is_active">Active</Label>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Referrer Reward</Label>
                  <div className="flex gap-2">
                    <select
                      value={formData.referrer_reward_type}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        referrer_reward_type: e.target.value as any 
                      })}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="points">Points</option>
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                    <Input
                      type="number"
                      value={formData.referrer_reward_value}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        referrer_reward_value: Number(e.target.value) 
                      })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Referee Reward</Label>
                  <div className="flex gap-2">
                    <select
                      value={formData.referee_reward_type}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        referee_reward_type: e.target.value as any 
                      })}
                      className="px-3 py-2 border rounded-md"
                    >
                      <option value="points">Points</option>
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                    <Input
                      type="number"
                      value={formData.referee_reward_value}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        referee_reward_value: Number(e.target.value) 
                      })}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Button type="submit">
                  {editingProgram ? 'Update Program' : 'Create Program'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setEditingProgram(null);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {programs.map((program) => (
          <Card key={program.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{program.name}</h3>
                  <p className="text-gray-600 text-sm mt-1">{program.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Referrer: {program.referrer_reward_value} {program.referrer_reward_type}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      Referee: {program.referee_reward_value} {program.referee_reward_type}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`px-2 py-1 rounded-full text-xs ${
                    program.is_active 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {program.is_active ? 'Active' : 'Inactive'}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(program)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
