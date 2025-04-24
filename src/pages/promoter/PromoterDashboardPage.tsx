
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { MessageSquare, CalendarDays, ChartBar, Users, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';

const PromoterDashboardPage = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    const userType = localStorage.getItem('user_type');
    
    if (!isLoading) {
      // If not loading and no user, redirect to auth
      if (!user) {
        // Store the current page as redirect destination
        localStorage.setItem('auth_redirect', '/promoter/dashboard');
        toast({
          title: "Authentication Required",
          description: "Please sign in to access the promoter dashboard",
          variant: "destructive"
        });
        navigate('/login');
      } 
      // If user but wrong type, show error and redirect
      else if (userType !== 'promoter') {
        toast({
          title: "Access Restricted",
          description: "This area is for promoters only",
          variant: "destructive"
        });
        navigate('/landing');
      }
    }
  }, [user, isLoading, navigate, toast]);

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto max-w-6xl px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-purple-600 mb-4">
            Promoter Dashboard
          </h1>
          
          <div className="mb-6">
            <Alert className="bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-600">
                  Notification testing has been moved to the admin panel. Visit the 
                  <Link to="/admin/notification-testing" className="text-blue-700 font-medium mx-1 underline">
                    Notification Testing
                  </Link>
                  section to test all notification types.
                </AlertDescription>
              </div>
            </Alert>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-600 mb-2">
                Active Promotions
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                You currently have no active promotions.
              </p>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Create Promotion
              </Button>
            </div>
            
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-600 mb-2">
                Performance Overview
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Track the performance of your promotions here.
              </p>
              <Button variant="outline" className="flex items-center gap-2">
                <ChartBar className="h-4 w-4" />
                View Analytics
              </Button>
            </div>

            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-600 mb-2">
                Venue Communications
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Connect and message venues for your events.
              </p>
              <Link to="/promoter/communication">
                <Button variant="outline" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Open Inbox
                </Button>
              </Link>
            </div>
            
            <div className="bg-purple-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-purple-600 mb-2">
                Brand Connections
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Connect with brands to enhance your events.
              </p>
              <Button variant="outline" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Explore Brands
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PromoterDashboardPage;
