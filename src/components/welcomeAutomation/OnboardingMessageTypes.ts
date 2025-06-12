
// Safe message type definitions for onboarding automation
export type OnboardingMessageType = 'welcome' | 'value_intro' | 'first_value' | 'event_invite' | 'custom';

export interface OnboardingMessage {
  step_number: number;
  step_name: string;
  delay_minutes: number;
  message_type: OnboardingMessageType;
  subject_line: string;
  message_content: string;
}

// Base interface for all message types
interface BaseMessage {
  step_number: number;
  step_name: string;
  delay_minutes: number;
  subject_line: string;
  message_content: string;
}

// Specific message type interfaces
export interface WelcomeMessage extends BaseMessage {
  message_type: 'welcome';
}

export interface ValueIntroMessage extends BaseMessage {
  message_type: 'value_intro';
}

export interface FirstValueMessage extends BaseMessage {
  message_type: 'first_value';
}

export interface EventInviteMessage extends BaseMessage {
  message_type: 'event_invite';
}

export interface CustomMessage extends BaseMessage {
  message_type: 'custom';
}

// Union type for all message types
export type TypedOnboardingMessage = 
  | WelcomeMessage 
  | ValueIntroMessage 
  | FirstValueMessage 
  | EventInviteMessage 
  | CustomMessage;

// Type-safe message creation helpers
export const createWelcomeMessage = (stepNumber: number): WelcomeMessage => ({
  step_number: stepNumber,
  step_name: `Welcome Step ${stepNumber}`,
  delay_minutes: 0,
  message_type: 'welcome',
  subject_line: 'Welcome!',
  message_content: 'Welcome to our platform!'
});

export const createValueIntroMessage = (stepNumber: number): ValueIntroMessage => ({
  step_number: stepNumber,
  step_name: `Value Introduction ${stepNumber}`,
  delay_minutes: 60,
  message_type: 'value_intro',
  subject_line: 'Discover What We Offer',
  message_content: 'Here\'s what you can expect from us...'
});

export const createFirstValueMessage = (stepNumber: number): FirstValueMessage => ({
  step_number: stepNumber,
  step_name: `First Value ${stepNumber}`,
  delay_minutes: 1440,
  message_type: 'first_value',
  subject_line: 'Your First Exclusive Offer',
  message_content: 'As a new member, here\'s something special for you...'
});

export const createEventInviteMessage = (stepNumber: number): EventInviteMessage => ({
  step_number: stepNumber,
  step_name: `Event Invitation ${stepNumber}`,
  delay_minutes: 2880,
  message_type: 'event_invite',
  subject_line: 'You\'re Invited!',
  message_content: 'Join us for an exclusive event...'
});

export const createCustomMessage = (stepNumber: number, customContent: Partial<CustomMessage> = {}): CustomMessage => ({
  step_number: stepNumber,
  step_name: `Custom Step ${stepNumber}`,
  delay_minutes: 0,
  message_type: 'custom',
  subject_line: 'Custom Message',
  message_content: 'Custom message content...',
  ...customContent
});
