
import { useState } from 'react';

export const useRegistrationError = () => {
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  return {
    registrationError,
    setRegistrationError
  };
};
