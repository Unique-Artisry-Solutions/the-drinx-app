import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminHeader from '@/components/admin/AdminHeader';
import { useNavigate } from 'react-router-dom';
import SystemSettingsPanel from '@/components/admin/systemSettings/SystemSettingsPanel';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const isAdmin = localStorage.getItem('admin_authenticated') === 'true';
    if (!isAdmin) {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_authenticated');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-material-background">
      <AdminHeader onLogout={handleLogout} />
      
      <main className="container max-w-7xl mx-auto p-4 pt-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your application from a central location</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">1,234</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Establishments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">56</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Moderation Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">7</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">Recent Users</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <p>Overview content here</p>
              </TabsContent>

              <TabsContent value="users">
                <p>Users content here</p>
              </TabsContent>

              <TabsContent value="activity">
                <p>Activity content here</p>
              </TabsContent>
            </Tabs>
          </div>
          
          <div>
            <SystemSettingsPanel mode="compact" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
