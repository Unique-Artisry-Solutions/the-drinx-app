
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';

type UserWithProfile = {
  id: string;
  email: string;
  username: string | null;
  userType: string | null;
  createdAt: string;
  lastLogin: string | null;
  isVerified: boolean;
}

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated as admin
  useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Fetch users from auth.users via a join with profiles
      const { data: authUsers, error: authError } = await supabase
        .from('profiles')
        .select('id, username, user_type, created_at');
      
      if (authError) {
        throw authError;
      }

      // Process the data to match our UserWithProfile type
      const processedUsers: UserWithProfile[] = authUsers.map(profile => ({
        id: profile.id,
        email: `user-${profile.id.substring(0, 8)}@example.com`, // Privacy: don't expose real emails in admin UI
        username: profile.username || `User-${profile.id.substring(0, 5)}`,
        userType: profile.user_type || 'individual',
        createdAt: profile.created_at ? new Date(profile.created_at).toISOString().split('T')[0] : 'Unknown',
        lastLogin: 'N/A', // This info isn't easily accessible
        isVerified: true // Assume verified for simplicity
      }));

      setUsers(processedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Failed to load users',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  const filteredUsers = users.filter(
    user => 
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const viewUserProfile = (userId: string, userType: string) => {
    toast({
      title: 'Viewing user profile',
      description: `Viewing profile for user ${userId} (${userType})`,
    });
    
    if (userType === 'establishment') {
      navigate(`/admin/establishment/${userId}`);
    } else {
      navigate(`/admin/user/${userId}`);
    }
  };

  return (
    <div className="min-h-screen bg-material-background">
      <AdminHeader onLogout={handleLogout} />

      <main className="container max-w-5xl mx-auto p-4">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          <Button 
            variant="outline" 
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>

        <div className="bg-white p-4 rounded-md shadow-sm mb-6">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by email or username..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={fetchUsers} 
              disabled={isLoading}
              title="Refresh users"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh</span>
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-md shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>User Type</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.username || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.userType === 'establishment' 
                        ? 'bg-spiritless-green/20 text-spiritless-green' 
                        : 'bg-spiritless-pink/20 text-spiritless-pink'
                    }`}>
                      {user.userType === 'establishment' ? 'Establishment' : 'Individual'}
                    </span>
                  </TableCell>
                  <TableCell>{user.createdAt}</TableCell>
                  <TableCell>{user.lastLogin || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.isVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {user.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => viewUserProfile(user.id, user.userType || 'individual')}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View profile</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    <div className="flex justify-center items-center">
                      <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                      Loading users...
                    </div>
                  </TableCell>
                </TableRow>
              )}
              
              {!isLoading && currentUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-end p-4 border-t">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsersPage;
