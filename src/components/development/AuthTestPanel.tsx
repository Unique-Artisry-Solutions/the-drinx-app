
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/auth/AuthProvider';

const AuthTestPanel: React.FC = () => {
  const { user, isAuthenticated, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Test Panel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <span>Status:</span>
          <Badge variant={isAuthenticated ? "default" : "secondary"}>
            {isAuthenticated ? "Authenticated" : "Not Authenticated"}
          </Badge>
        </div>
        
        {user && (
          <div className="space-y-2">
            <p><strong>User ID:</strong> {user.id}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>User Type:</strong> {user.user_metadata?.user_type || 'Unknown'}</p>
          </div>
        )}
        
        {isAuthenticated && (
          <Button onClick={handleSignOut} disabled={isLoading}>
            {isLoading ? 'Signing out...' : 'Sign Out'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default AuthTestPanel;
