
// This file is kept for backward compatibility
// It re-exports the modular implementation from barCrawl directory
import { useBarCrawlParticipation as useBarCrawlParticipationHook } from './barCrawl/useBarCrawlParticipation';

export const useBarCrawlParticipation = useBarCrawlParticipationHook;
export default useBarCrawlParticipationHook;
