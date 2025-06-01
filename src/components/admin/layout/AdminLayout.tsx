
import { Outlet } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import AdminTopNavigation from '@/components/navigation/AdminTopNavigation';
import AdminFooter from '@/components/admin/AdminFooter';
import { Toaster } from '@/components/ui/toaster';

interface AdminLayoutProps {
  children?: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const handleLogout = () => {
    console.log('Admin logout requested');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminTopNavigation onLogout={handleLogout} />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <Card className="min-h-[calc(100vh-200px)]">
          <CardContent className="p-6">
            {children || <Outlet />}
          </CardContent>
        </Card>
      </main>

      <Separator />
      <AdminFooter />
      <Toaster />
    </div>
  );
};

export default AdminLayout;
