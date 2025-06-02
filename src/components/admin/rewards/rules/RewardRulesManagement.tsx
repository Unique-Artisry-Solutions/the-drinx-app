
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Plus, MoreHorizontal, Trash, Edit, Save, Settings, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

interface RewardRule {
  id: string;
  name: string;
  description: string;
  event_type: string;
  points: number;
  conditions: any;
  actions: any;
  is_active: boolean;
  establishment_id: string; // Added this required field
}

export function RewardRulesManagement() {
  const { toast } = useToast();
  const [rules, setRules] = useState<RewardRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRule, setCurrentRule] = useState<Partial<RewardRule>>({
    name: '',
    description: '',
    event_type: '',
    points: 0,
    conditions: {},
    actions: {},
    is_active: true,
    establishment_id: '00000000-0000-0000-0000-000000000000' // Default establishment ID
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  useEffect(() => {
    loadRules();
  }, []);
  
  const loadRules = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('reward_rules')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) throw error;
      setRules(data || []);
    } catch (error) {
      console.error("Error loading reward rules:", error);
      toast({
        title: "Error",
        description: "Failed to load reward rules",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveRule = async () => {
    if (!currentRule.name || !currentRule.event_type) {
      toast({
        title: "Validation Error",
        description: "Name and event type are required",
        variant: "destructive"
      });
      return;
    }
    
    setIsSaving(true);
    try {
      let result;
      
      if (isEditing && currentRule.id) {
        const { data, error } = await supabase
          .from('reward_rules')
          .update({
            name: currentRule.name,
            description: currentRule.description,
            event_type: currentRule.event_type,
            points: currentRule.points,
            conditions: currentRule.conditions,
            actions: currentRule.actions,
            is_active: currentRule.is_active,
            establishment_id: currentRule.establishment_id
          })
          .eq('id', currentRule.id)
          .select();
          
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('reward_rules')
          .insert({
            name: currentRule.name,
            description: currentRule.description,
            event_type: currentRule.event_type,
            points: currentRule.points,
            conditions: currentRule.conditions,
            actions: currentRule.actions,
            is_active: currentRule.is_active,
            establishment_id: currentRule.establishment_id
          })
          .select();
          
        if (error) throw error;
        result = data;
      }
      
      toast({
        title: isEditing ? "Rule Updated" : "Rule Created",
        description: `Successfully ${isEditing ? 'updated' : 'created'} rule: ${currentRule.name}`
      });
      
      await loadRules();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving reward rule:", error);
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'create'} reward rule`,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDeleteRule = async (id: string) => {
    try {
      const { error } = await supabase
        .from('reward_rules')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      toast({
        title: "Rule Deleted",
        description: "The reward rule has been deleted"
      });
      
      await loadRules();
    } catch (error) {
      console.error("Error deleting reward rule:", error);
      toast({
        title: "Error",
        description: "Failed to delete reward rule",
        variant: "destructive"
      });
    }
  };
  
  const handleToggleStatus = async (rule: RewardRule) => {
    try {
      const { error } = await supabase
        .from('reward_rules')
        .update({ is_active: !rule.is_active })
        .eq('id', rule.id);
        
      if (error) throw error;
      
      toast({
        title: "Status Updated",
        description: `Rule is now ${!rule.is_active ? 'active' : 'inactive'}`
      });
      
      await loadRules();
    } catch (error) {
      console.error("Error toggling rule status:", error);
      toast({
        title: "Error",
        description: "Failed to update rule status",
        variant: "destructive"
      });
    }
  };
  
  const addNewRule = () => {
    setCurrentRule({
      name: '',
      description: '',
      event_type: '',
      points: 0,
      conditions: {},
      actions: {},
      is_active: true,
      establishment_id: '00000000-0000-0000-0000-000000000000'
    });
    setIsEditing(false);
    setIsDialogOpen(true);
  };
  
  const editRule = (rule: RewardRule) => {
    setCurrentRule(rule);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-primary" />
          Reward Rules Management
        </CardTitle>
        <Button onClick={addNewRule}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Rule
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {rules.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No reward rules found. Create your first rule to get started.</p>
              </div>
            ) : (
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Event Type</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[100px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rules.map((rule) => (
                      <TableRow key={rule.id}>
                        <TableCell className="font-medium">{rule.name}</TableCell>
                        <TableCell>{rule.event_type}</TableCell>
                        <TableCell>{rule.points}</TableCell>
                        <TableCell>
                          <Badge variant={rule.is_active ? "default" : "outline"}>
                            {rule.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => editRule(rule)}>
                                <Edit className="h-4 w-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleStatus(rule)}>
                                {rule.is_active ? (
                                  <>
                                    <span className="h-4 w-4 mr-2">🚫</span> Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Check className="h-4 w-4 mr-2" /> Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteRule(rule.id)}
                              >
                                <Trash className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Rule' : 'Create New Rule'}</DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? 'Update the details for this reward rule.' 
                  : 'Define a new rule for awarding points to users.'}
              </DialogDescription>
            </DialogHeader>
            
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-4 p-1">
                <div>
                  <label className="text-sm font-medium mb-1 block">Rule Name</label>
                  <Input
                    value={currentRule.name || ''}
                    onChange={(e) => setCurrentRule({...currentRule, name: e.target.value})}
                    placeholder="e.g. Daily Check-in Bonus"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Description</label>
                  <Input
                    value={currentRule.description || ''}
                    onChange={(e) => setCurrentRule({...currentRule, description: e.target.value})}
                    placeholder="Brief description of this rule"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Event Type</label>
                  <Input
                    value={currentRule.event_type || ''}
                    onChange={(e) => setCurrentRule({...currentRule, event_type: e.target.value})}
                    placeholder="e.g. check_in, purchase, review"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-1 block">Points</label>
                  <Input
                    type="number"
                    value={currentRule.points || 0}
                    onChange={(e) => setCurrentRule({...currentRule, points: parseInt(e.target.value) || 0})}
                    placeholder="Number of points to award"
                  />
                </div>
                
                <div className="flex items-center space-x-2 pt-2">
                  <input
                    type="checkbox"
                    id="is-active"
                    checked={currentRule.is_active}
                    onChange={(e) => setCurrentRule({...currentRule, is_active: e.target.checked})}
                  />
                  <label htmlFor="is-active" className="text-sm font-medium">Rule Active</label>
                </div>
              </div>
            </ScrollArea>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveRule} disabled={isSaving}>
                {isSaving ? (
                  <span className="flex items-center gap-2">Saving <Loader2 className="h-4 w-4 animate-spin" /></span>
                ) : (
                  <span className="flex items-center gap-2">Save <Save className="h-4 w-4" /></span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
