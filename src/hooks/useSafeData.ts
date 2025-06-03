
/**
 * Custom hooks for safe data handling
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  safeGetEstablishment, 
  safeGetEvent, 
  safeGetUser, 
  safeEstablishmentArray,
  safeEventArray,
  safeUserArray,
  isValidEstablishment,
  isValidEvent,
  isValidUser
} from '@/utils/componentSafety';
import { Establishment, Event, User } from '@/types/CoreTypes';

export const useSafeEstablishments = (rawEstablishments: any[]) => {
  return useMemo(() => {
    if (!Array.isArray(rawEstablishments)) return [];
    return safeEstablishmentArray(rawEstablishments);
  }, [rawEstablishments]);
};

export const useSafeEvents = (rawEvents: any[]) => {
  return useMemo(() => {
    if (!Array.isArray(rawEvents)) return [];
    return safeEventArray(rawEvents);
  }, [rawEvents]);
};

export const useSafeUsers = (rawUsers: any[]) => {
  return useMemo(() => {
    if (!Array.isArray(rawUsers)) return [];
    return safeUserArray(rawUsers);
  }, [rawUsers]);
};

export const useSafeEstablishment = (rawEstablishment: any) => {
  return useMemo(() => {
    return safeGetEstablishment(rawEstablishment);
  }, [rawEstablishment]);
};

export const useSafeEvent = (rawEvent: any) => {
  return useMemo(() => {
    return safeGetEvent(rawEvent);
  }, [rawEvent]);
};

export const useSafeUser = (rawUser: any) => {
  return useMemo(() => {
    return safeGetUser(rawUser);
  }, [rawUser]);
};

// Validation hooks
export const useDataValidation = <T>(
  data: any,
  validator: (item: any) => item is T,
  fallback?: T
) => {
  const [isValid, setIsValid] = useState(false);
  const [validatedData, setValidatedData] = useState<T | undefined>(fallback);

  useEffect(() => {
    const valid = validator(data);
    setIsValid(valid);
    setValidatedData(valid ? data : fallback);
  }, [data, validator, fallback]);

  return { isValid, data: validatedData };
};

export const useEstablishmentValidation = (establishment: any) => {
  return useDataValidation(establishment, isValidEstablishment);
};

export const useEventValidation = (event: any) => {
  return useDataValidation(event, isValidEvent);
};

export const useUserValidation = (user: any) => {
  return useDataValidation(user, isValidUser);
};
