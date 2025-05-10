
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define the Auth context type
interface AuthContextType {
  user: { id: string } | null;
  isLoading: boolean;
  error: Error | null;
}

// Create the Auth context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  error: null
});

// Auth provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Mock authentication for testing
  useEffect(() => {
    setUser({ id: 'test-user-id' });
    setIsLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, error }}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth hook for component use
export const useAuth = () => useContext(AuthContext);
