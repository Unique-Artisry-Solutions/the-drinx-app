
import { z } from "zod";

export const preferencesSchema = z.object({
  notification_settings: z.object({
    point_changes: z.boolean(),
    tier_updates: z.boolean(),
    reward_availability: z.boolean()
  }),
  display_settings: z.object({
    points_format: z.enum(['standard', 'compact']),
    show_tier_progress: z.boolean(),
  })
});

export type PreferencesFormData = z.infer<typeof preferencesSchema>;
