
export interface WelcomeAutomationFlow {
  id: string;
  promoter_id?: string;
  flow_name: string;
  description?: string;
  is_active: boolean;
  flow_config: {
    duration_days: number;
    total_steps: number;
    auto_advance: boolean;
    personalization_enabled: boolean;
    engagement_tracking: boolean;
  };
  trigger_conditions: {
    trigger_on: string;
    delay_minutes: number;
    conditions: any[];
  };
  completion_criteria: {
    all_steps_completed: boolean;
    min_engagement_score: number;
    time_limit_days: number;
  };
  success_metrics: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ScheduledWelcomeMessage {
  id: string;
  automation_flow_id: string;
  promoter_id?: string;
  step_number: number;
  step_name: string;
  delay_minutes: number;
  message_type: 'welcome' | 'value_intro' | 'event_invite' | 'community_intro' | 'preference_setting' | 'milestone_celebration' | 'custom';
  subject_line?: string;
  message_content: string;
  message_data: Record<string, any>;
  send_conditions: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface FollowerOnboardingProgress {
  id: string;
  follower_id: string;
  automation_flow_id: string;
  current_step: number;
  completed_steps: number[];
  step_completion_dates: Record<string, string>;
  personalization_data: Record<string, any>;
  engagement_score: number;
  conversion_events: any[];
  started_at: string;
  completed_at?: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScheduledMessageDelivery {
  id: string;
  follower_id: string;
  scheduled_message_id: string;
  onboarding_progress_id: string;
  scheduled_for: string;
  sent_at?: string;
  delivery_status: 'scheduled' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed' | 'cancelled';
  response_data: Record<string, any>;
  engagement_metrics: Record<string, any>;
  error_message?: string;
  retry_count: number;
  created_at: string;
  updated_at: string;
}

export interface OnboardingStep {
  stepNumber: number;
  stepName: string;
  delayMinutes: number;
  messageType: string;
  isCompleted: boolean;
  completedAt?: string;
  scheduledFor?: string;
}
