
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
import { Search, Eye, ChevronLeft, ChevronRight, RefreshCw, BadgeInfo } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AdminFooter from '@/components/admin/AdminFooter';

type UserWithProfile = {
  id: string;
  email: string;
  username: string | null;
  userType: string | null;
  createdAt: string;
  lastLogin: string | null;
  isVerified: boolean;
  isMock?: boolean;
}

const MOCK_TEST_USERS: UserWithProfile[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'testuser1@example.com',
    username: 'testuser1',
    userType: 'individual',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isVerified: true,
    isMock: true
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'testuser2@example.com',
    username: 'testuser2',
    userType: 'individual',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isVerified: true,
    isMock: true
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    email: 'testuser3@example.com',
    username: 'testuser3',
    userType: 'individual',
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isVerified: true,
    isMock: true
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'testuser4@example.com',
    username: 'testuser4',
    userType: 'individual',
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lastLogin: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isVerified: false,
    isMock: true
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    email: 'testuser5@example.com',
    username: 'testuser5',
    userType: 'individual',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lastLogin: null,
    isVerified: true,
    isMock: true
  },
  {
    id: '00000000-0000-0000-0000-00000000000b',
    email: 'mocktailbar1@example.com',
    username: 'mocktailbar1',
    userType: 'establishment',
    createdAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isVerified: true,
    isMock: true
  },
  {
    id: '00000000-0000-0000-0000-00000000000c',
    email: 'mocktailbar2@example.com',
    username: 'mocktailbar2',
    userType: 'establishment',
    createdAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isVerified: true,
    isMock: true
  },
  {
    id: '00000000-0000-0000-0000-00000000000d',
    email: 'mocktailbar3@example.com',
    username: 'mocktailbar3',
    userType: 'establishment',
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lastLogin: null,
    isVerified: false,
    isMock: true
  },
  {
    id: '00000000-0000-0000-0000-00000000000e',
    email: 'mocktailbar4@example.com',
    username: 'mocktailbar4',
    userType: 'establishment',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lastLogin: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isVerified: true,
    isMock: true
  },
  {
    id: '00000000-0000-0000-0000-00000000000f',
    email: 'adminuser@example.com',
    username: 'adminuser',
    userType: 'admin',
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    lastLogin: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isVerified: true,
    isMock: true
  }
];

const AdminUsersPage = () => {
  const [users, setUsers] = useState<UserWithProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [includeMockUsers, setIncludeMockUsers] = useState(true);
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

      // Combine real users with mock users if includeMockUsers is true
      const combinedUsers = includeMockUsers
        ? [...processedUsers, ...MOCK_TEST_USERS]
        : processedUsers;
      
      setUsers(combinedUsers);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Failed to load users',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      
      // If there's an error fetching real users, at least show mock users
      if (includeMockUsers) {
        setUsers(MOCK_TEST_USERS);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [includeMockUsers]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  const toggleMockUsers = () => {
    setIncludeMockUsers(!includeMockUsers);
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
    <div className="min-h-screen bg-material-background flex flex-col">
      <AdminHeader onLogout={handleLogout} />

      <main className="container max-w-5xl mx-auto p-4 flex-1">
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by email or username..."
                className="pl-9 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
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
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant={includeMockUsers ? "default" : "outline"}
                      size="sm"
                      onClick={toggleMockUsers}
                      className="flex items-center gap-1"
                    >
                      <BadgeInfo className="h-4 w-4 mr-1" />
                      {includeMockUsers ? "Hide Test Users" : "Show Test Users"}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Toggle mock test users for admin UI testing</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
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
                <TableRow key={user.id} className={user.isMock ? 'bg-slate-50' : ''}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-1">
                      {user.email}
                      {user.isMock && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <BadgeInfo className="h-3 w-3 text-blue-500" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="text-xs">This is a mock test user</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{user.username || 'N/A'}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.userType === 'establishment' 
                        ? 'bg-spiritless-green/20 text-spiritless-green' 
                        : user.userType === 'admin'
                          ? 'bg-spiritless-burgundy/20 text-spiritless-burgundy'
                          : 'bg-spiritless-pink/20 text-spiritless-pink'
                    }`}>
                      {user.userType === 'establishment' 
                        ? 'Establishment' 
                        : user.userType === 'admin'
                          ? 'Admin'
                          : 'Individual'}
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
      
      <AdminFooter />
    </div>
  );
};

export default AdminUsersPage;
