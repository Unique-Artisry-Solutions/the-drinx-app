
export interface EventVisibilitySettings {
  isPrivate: boolean;
  requiresFollowing: boolean;
  allowedTiers: string[];
  maxAttendees?: number;
  guestListOnly: boolean;
  customSettings?: Record<string, any>;
}

export interface EventAccessInfo {
  hasAccess: boolean;
  accessType: 'public' | 'followers_only' | 'tier_restricted' | 'private';
  reason?: string;
  requiresFollowing?: boolean;
}
