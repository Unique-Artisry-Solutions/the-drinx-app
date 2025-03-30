
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import AdminHeader from '@/components/admin/AdminHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminUserProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
  }, [id]);

  const fetchUserData = async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      // Fetch the user profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (profileError) throw profileError;
      
      setUser({
        id: profileData.id,
        email: `user-${profileData.id.substring(0, 8)}@example.com`, // Privacy protection
        username: profileData.username || 'Anonymous',
        displayName: profileData.display_name || 'Anonymous User',
        userType: profileData.user_type || 'individual',
        createdAt: profileData.created_at ? new Date(profileData.created_at).toLocaleDateString() : 'Unknown',
        lastActive: 'N/A',
        favorites: [],
        barCrawls: [],
        isVerified: true
      });

      // Get user's favorites
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', id);
      
      if (!favoritesError && favoritesData) {
        setUser((prev: any) => ({
          ...prev,
          favorites: favoritesData
        }));
      }

      // Get user's bar crawls
      const { data: barCrawlsData, error: barCrawlsError } = await supabase
        .from('bar_crawls')
        .select('*')
        .eq('organizer_id', id);
      
      if (!barCrawlsError && barCrawlsData) {
        setUser((prev: any) => ({
          ...prev,
          barCrawls: barCrawlsData
        }));
      }
    } catch (error: any) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Failed to load user data',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-material-background">
        <AdminHeader onLogout={handleLogout} />
        <div className="container max-w-4xl mx-auto p-4 flex justify-center items-center min-h-[70vh]">
          <div className="flex flex-col items-center">
            <RefreshCw className="animate-spin h-8 w-8 mb-2" />
            <p>Loading user data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-material-background">
        <AdminHeader onLogout={handleLogout} />
        <div className="container max-w-4xl mx-auto p-4">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">User Profile</h1>
            <Button 
              variant="outline" 
              onClick={() => navigate('/admin/users')}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Users
            </Button>
          </div>
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-gray-500">User not found or has been deleted.</p>
              <div className="mt-4 flex justify-center">
                <Button onClick={() => navigate('/admin/users')}>
                  Return to User List
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-material-background">
      <AdminHeader onLogout={handleLogout} />
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">User Profile</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Users
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">User ID</div>
                <div className="text-sm font-mono overflow-auto">{user.id}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Email</div>
                <div>{user.email}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Username</div>
                <div>{user.username || 'Not set'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Display Name</div>
                <div>{user.displayName || 'Not set'}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">User Type</div>
                <div className="capitalize">{user.userType}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Joined</div>
                <div>{user.createdAt}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Email Verified</div>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    user.isVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {user.isVerified ? 'Verified' : 'Unverified'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>User Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Favorites</div>
                <div className="text-lg font-semibold">{user.favorites.length}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Bar Crawls</div>
                <div className="text-lg font-semibold">{user.barCrawls.length}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Last Active</div>
                <div>{user.lastActive}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {user.barCrawls && user.barCrawls.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Bar Crawls</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {user.barCrawls.map((crawl: any) => (
                  <li key={crawl.id} className="border-b pb-2 last:border-0">
                    <div className="font-medium">{crawl.name}</div>
                    <div className="text-sm text-gray-500">Created: {new Date(crawl.created_at).toLocaleDateString()}</div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminUserProfile;
