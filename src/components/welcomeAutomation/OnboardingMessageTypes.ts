
// Simplified message type definitions to avoid union type conflicts
export type OnboardingMessageType = 'welcome' | 'value_intro' | 'first_value' | 'event_invite' | 'custom';

// Base interface that all messages will use - this prevents union type conflicts
export interface OnboardingMessage {
  step_number: number;
  step_name: string;
  delay_minutes: number;
  message_type: OnboardingMessageType;
  subject_line: string;
  message_content: string;
}

// Type-safe message creation helpers that return the base interface
export const createWelcomeMessage = (stepNumber: number): OnboardingMessage => ({
  step_number: stepNumber,
  step_name: `Welcome Step ${stepNumber}`,
  delay_minutes: 0,
  message_type: 'welcome',
  subject_line: 'Welcome!',
  message_content: 'Welcome to our platform!'
});

export const createValueIntroMessage = (stepNumber: number): OnboardingMessage => ({
  step_number: stepNumber,
  step_name: `Value Introduction ${stepNumber}`,
  delay_minutes: 60,
  message_type: 'value_intro',
  subject_line: 'Discover What We Offer',
  message_content: 'Here\'s what you can expect from us...'
});

export const createFirstValueMessage = (stepNumber: number): OnboardingMessage => ({
  step_number: stepNumber,
  step_name: `First Value ${stepNumber}`,
  delay_minutes: 1440,
  message_type: 'first_value',
  subject_line: 'Your First Exclusive Offer',
  message_content: 'As a new member, here\'s something special for you...'
});

export const createEventInviteMessage = (stepNumber: number): OnboardingMessage => ({
  step_number: stepNumber,
  step_name: `Event Invitation ${stepNumber}`,
  delay_minutes: 2880,
  message_type: 'event_invite',
  subject_line: 'You\'re Invited!',
  message_content: 'Join us for an exclusive event...'
});

export const createCustomMessage = (stepNumber: number, customContent: Partial<OnboardingMessage> = {}): OnboardingMessage => ({
  step_number: stepNumber,
  step_name: `Custom Step ${stepNumber}`,
  delay_minutes: 0,
  message_type: 'custom',
  subject_line: 'Custom Message',
  message_content: 'Custom message content...',
  ...customContent
});
