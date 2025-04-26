
import { useEventQueries } from './useEventQueries';
import { useEventMutations } from './useEventMutations';
import { useEventNotifications } from './useEventNotifications';
import { useLocationFilteredEvents } from './useLocationFilteredEvents';

export const useEvents = () => {
  const { events, isLoading } = useEventQueries();
  const { createEvent } = useEventMutations();
  const { scheduleEventNotifications } = useEventNotifications();
  const { getLocationFilteredEvents } = useLocationFilteredEvents();

  return {
    events,
    isLoading,
    createEvent,
    scheduleEventNotifications,
    getLocationFilteredEvents,
  };
};
