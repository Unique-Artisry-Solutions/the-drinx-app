
import { useState } from 'react';

export const useRetryState = () => {
  const [isRetrying, setIsRetrying] = useState(false);

  return {
    isRetrying,
    setIsRetrying
  };
};
