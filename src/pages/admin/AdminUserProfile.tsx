import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AdminSimplifiedLayout } from '@/components/admin/layout/AdminSimplifiedLayout';
import BackButton from '@/components/navigation/BackButton';
import TableSkeleton from '@/components/loading/skeletons/TableSkeleton';
import { SimplifiedAdminService, AdminUser } from '@/services/admin/SimplifiedAdminService';
import { toast } from 'sonner';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  Building, 
  Info,
  AlertCircle
} from 'lucide-react';

const AdminUserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) {
        setError('No user ID provided');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        
        const userData = await SimplifiedAdminService.getUserById(id);
        
        if (!userData) {
          setError('User not found');
          toast.error('User not found');
        } else {
          setUser(userData);
        }
      } catch (err: any) {
        console.error('Error fetching user:', err);
        setError(err.message || 'Failed to load user data');
        toast.error('Failed to load user data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserTypeBadge = (userType?: string) => {
    const colors = {
      admin: 'destructive',
      establishment: 'default',
      promoter: 'secondary',
      individual: 'outline'
    } as const;
    
    return (
      <Badge variant={colors[userType as keyof typeof colors] || 'outline'}>
        {userType || 'individual'}
      </Badge>
    );
  };

  const getRolesBadges = (roles?: string[]) => {
    if (!roles || roles.length === 0) return <Badge variant="outline">No active roles</Badge>;
    
    return (
      <div className="flex flex-wrap gap-1">
        {roles.map((role, index) => (
          <Badge key={index} variant="secondary" className="text-xs">
            {role}
          </Badge>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <AdminSimplifiedLayout 
        title="User Profile" 
        description="Loading user information..."
      >
        <div className="mb-4">
          <BackButton fallbackPath="/admin/users" />
        </div>
        <TableSkeleton rows={3} columns={2} hasHeader={false} />
      </AdminSimplifiedLayout>
    );
  }

  if (error || !user) {
    return (
      <AdminSimplifiedLayout 
        title="User Profile" 
        description="User information could not be loaded"
      >
        <div className="mb-4">
          <BackButton fallbackPath="/admin/users" />
        </div>
        
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error || 'User not found'}</span>
            </div>
            <p className="text-muted-foreground mt-2">
              The requested user could not be found or there was an error loading their information.
            </p>
            <div className="flex space-x-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => navigate('/admin/users')}
              >
                Back to Users List
              </Button>
              <Button 
                variant="default" 
                onClick={() => window.location.reload()}
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </AdminSimplifiedLayout>
    );
  }

  return (
    <AdminSimplifiedLayout 
      title={`User Profile: ${user.display_name || user.username || 'Unknown User'}`}
      description="Detailed user account information and settings"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <BackButton fallbackPath="/admin/users" />
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Button>
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              Manage Roles
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Display Name</label>
                    <p className="text-lg">{user.display_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Username</label>
                    <p className="text-lg">{user.username || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">User Type</label>
                    <div className="mt-1">
                      {getUserTypeBadge(user.user_type)}
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                    <p className="text-lg">{user.phone || 'Not provided'}</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Bio</label>
                  <p className="text-lg mt-1">{user.bio || 'No bio provided'}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Roles & Permissions</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Active Roles</label>
                  <div className="mt-2">
                    {getRolesBadges(user.active_roles)}
                  </div>
                </div>
              </CardContent>
            </Card>

            {user.establishment_name && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building className="h-5 w-5" />
                    <span>Establishment</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Associated Establishment</label>
                    <p className="text-lg mt-1 font-medium text-primary">
                      {user.establishment_name}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Account Details Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5" />
                  <span>Account Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">User ID</label>
                  <p className="text-sm font-mono bg-muted p-2 rounded mt-1">
                    {user.id}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <label className="text-sm font-medium text-muted-foreground flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Account Created</span>
                  </label>
                  <p className="text-sm mt-1">{formatDate(user.created_at)}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Password</span>
                  </div>
                  <p className="text-sm mt-1">
                    Password details are not accessible for security reasons
                  </p>
                </div>
                
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Last Login</span>
                  </div>
                  <p className="text-sm mt-1">
                    Login tracking not currently implemented
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminSimplifiedLayout>
  );
};

export default AdminUserProfile;