
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import AdminHeader from '@/components/admin/AdminHeader';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

// Sample data - would be fetched from Supabase in a real application
const sampleUsers = [
  {
    id: '1',
    email: 'user1@example.com',
    username: 'user1',
    userType: 'individual',
    createdAt: '2023-01-15',
    lastLogin: '2023-06-20',
    isVerified: true
  },
  {
    id: '2',
    email: 'user2@example.com',
    username: 'user2',
    userType: 'individual',
    createdAt: '2023-02-10',
    lastLogin: '2023-06-18',
    isVerified: true
  },
  {
    id: '3',
    email: 'establishment1@example.com',
    username: 'Cool Bar',
    userType: 'establishment',
    createdAt: '2023-03-05',
    lastLogin: '2023-06-19',
    isVerified: true
  },
  {
    id: '4',
    email: 'user3@example.com',
    username: 'user3',
    userType: 'individual',
    createdAt: '2023-03-20',
    lastLogin: '2023-06-15',
    isVerified: false
  },
  {
    id: '5',
    email: 'establishment2@example.com',
    username: 'Mocktail Haven',
    userType: 'establishment',
    createdAt: '2023-04-12',
    lastLogin: '2023-06-17',
    isVerified: true
  },
];

const AdminUsersPage = () => {
  const [users, setUsers] = useState(sampleUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is authenticated as admin
  React.useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  const filteredUsers = users.filter(
    user => 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const viewUserProfile = (userId: string, userType: string) => {
    // In a real app, this would navigate to the appropriate profile page
    // using the user's ID to fetch their profile data
    toast({
      title: 'Viewing user profile',
      description: `Viewing profile for user ${userId} (${userType})`,
    });
    
    // This is just for demonstration
    if (userType === 'establishment') {
      navigate(`/establishment/${userId}`);
    } else {
      // In a real app, this would go to the user's profile page
      navigate(`/profile`);
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
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by email or username..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
                <TableHead>Last Login</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.email}</TableCell>
                  <TableCell>{user.username}</TableCell>
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
                  <TableCell>{user.lastLogin}</TableCell>
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
                      onClick={() => viewUserProfile(user.id, user.userType)}
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View profile</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              
              {currentUsers.length === 0 && (
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
