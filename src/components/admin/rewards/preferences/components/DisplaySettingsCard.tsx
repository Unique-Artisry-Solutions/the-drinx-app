
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormField, FormControl, FormDescription, FormItem, FormLabel } from "@/components/ui/form";
import { Settings } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { PreferencesFormData } from '../types';

interface DisplaySettingsCardProps {
  form: UseFormReturn<PreferencesFormData>;
}

export function DisplaySettingsCard({ form }: DisplaySettingsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Display Settings
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <FormField
          control={form.control}
          name="display_settings.points_format"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Points Display Format</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select points format" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="standard">Standard (1,234)</SelectItem>
                  <SelectItem value="compact">Compact (1.2K)</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                Choose how points are displayed throughout the system
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="display_settings.show_tier_progress"
          render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Show Tier Progress</FormLabel>
                <FormDescription>
                  Display progress towards next reward tier
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
