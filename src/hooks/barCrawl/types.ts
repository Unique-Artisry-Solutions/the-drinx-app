
/**
 * Props for the useBarCrawlParticipation hook
 */
export interface UseBarCrawlParticipationProps {
  /** The unique identifier for the bar crawl */
  barCrawlId: string;
}

/**
 * Data returned by the useBarCrawlParticipation hook
 */
export interface BarCrawlParticipationData {
  isParticipating: boolean;
  participantCount: number;
  maxParticipants?: number;
  canJoin: boolean;
}

/**
 * Data returned by the useBarCrawlStatus hook
 */
export interface BarCrawlStatusData {
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  startTime: string;
  endTime?: string;
  location?: string;
}

/**
 * Parameters for joining a bar crawl
 */
export interface JoinBarCrawlParams {
  barCrawlId: string;
  userId: string;
  preferences?: Record<string, any>;
}

/**
 * Parameters for leaving a bar crawl
 */
export interface LeaveBarCrawlParams {
  barCrawlId: string;
  userId: string;
  reason?: string;
}
