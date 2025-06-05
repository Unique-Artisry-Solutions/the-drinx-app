
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCompatibleAuth } from '@/services/compatibility/AuthCompatibilityWrapper';
import { safeTypeConverters } from '@/utils/typeEnhancements';
import { User, Shield, Clock } from 'lucide-react';

const SafeUserProfile: React.FC = () => {
  const auth = useCompatibleAuth();
  
  // Safe type conversions
  const safeUserName = safeTypeConverters.toString(auth.user?.user_metadata?.name || auth.user?.email, 'Anonymous User');
  const safeUserEmail = safeTypeConverters.toString(auth.user?.email, 'No email');
  const safeUserType = safeTypeConverters.toUserType(auth.userType, 'individual');
  
  if (!auth.isAuthenticated) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Please sign in to view your profile</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (auth.isLoading) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <Clock className="h-12 w-12 text-blue-400 mx-auto mb-2 animate-spin" />
            <p className="text-blue-600">Loading profile...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'establishment': return 'bg-green-100 text-green-800';
      case 'promoter': return 'bg-purple-100 text-purple-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          User Profile (Safe Auth)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={auth.user?.user_metadata?.avatar_url} />
            <AvatarFallback>{getInitials(safeUserName)}</AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <h3 className="text-lg font-semibold">{safeUserName}</h3>
            <p className="text-sm text-gray-600">{safeUserEmail}</p>
            <Badge className={getUserTypeColor(safeUserType)}>
              {safeUserType.charAt(0).toUpperCase() + safeUserType.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-sm font-medium">Auth Status</p>
            <Badge variant={auth.authStable ? "default" : "destructive"}>
              {auth.authStable ? 'Stable' : 'Unstable'}
            </Badge>
          </div>
          
          <div className="text-center">
            <p className="text-sm font-medium">Session</p>
            <Badge variant={auth.session ? "default" : "secondary"}>
              {auth.session ? 'Active' : 'Inactive'}
            </Badge>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-50 rounded-md">
          <p className="text-xs text-green-700">
            ✓ Using useCompatibleAuth() with safe type converters for enhanced reliability
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SafeUserProfile;
