import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CalendarClock, Users, Award, GlassWater, Clock, TagIcon, ArrowRight, MessageSquare } from 'lucide-react';

const AllActionsPage = () => {
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-start mb-6">
          <h1 className="text-2xl font-bold">Establishment Actions</h1>
          <p className="text-muted-foreground">Manage all actions related to your establishment</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <ActionCard 
            title="Update Profile"
            description="Complete or update your establishment profile information"
            icon={<Users className="h-5 w-5" />}
            to="/establishment/profile"
            completion={85}
          />
          
          <ActionCard 
            title="Mocktail Menu"
            description="Update your mocktail menu offerings"
            icon={<GlassWater className="h-5 w-5" />}
            to="/establishment/mocktail-menu"
            completion={60}
          />
          
          <ActionCard 
            title="Communication Hub"
            description="Manage conversations with promoters and partners"
            icon={<MessageSquare className="h-5 w-5" />}
            to="/establishment/communication"
            count={3}
          />
          
          <ActionCard 
            title="Promotional Offers"
            description="Create and manage special promotions"
            icon={<TagIcon className="h-5 w-5" />}
            to="/establishment/promotions"
            count={2}
          />
          
          <ActionCard 
            title="Swig Circuit Requests"
            description="Review and manage Swig Circuit participation requests"
            icon={<CalendarClock className="h-5 w-5" />}
            to="/establishment/bar-crawl-requests"
            count={1}
            isHighlighted
          />
          
          <ActionCard 
            title="View Analytics"
            description="Check visitor statistics and engagement"
            icon={<Award className="h-5 w-5" />}
            to="/establishment/analytics"
          />
          
          <ActionCard 
            title="Operating Hours"
            description="Set your establishment's operating hours"
            icon={<Clock className="h-5 w-5" />}
            to="/establishment/profile"
          />
        </div>
        
        <h3 className="text-lg font-medium mb-4 text-left">Recent Notifications</h3>
        
        <div className="space-y-4">
          <NotificationCard
            title="New Swig Circuit Request"
            description="Your establishment has been included in 'Holiday Mocktail Crawl'"
            time="2 hours ago"
            to="/establishment/bar-crawl-requests"
            isNew
          />
          
          <NotificationCard
            title="Profile Completion Reminder"
            description="Complete your profile to increase visibility to potential customers"
            time="1 day ago"
            to="/establishment/profile"
          />
          
          <NotificationCard
            title="New Mocktail Suggestion"
            description="A customer suggested a new mocktail for your menu"
            time="3 days ago"
            to="/establishment/mocktail-suggestions"
          />
        </div>
      </div>
    </Layout>
  );
};

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  to: string;
  completion?: number;
  count?: number;
  isHighlighted?: boolean;
}

const ActionCard = ({ title, description, icon, to, completion, count, isHighlighted }: ActionCardProps) => {
  return (
    <Card className={`overflow-hidden border ${isHighlighted ? 'border-primary' : ''}`}>
      <CardContent className="p-0">
        <Link to={to} className="block">
          <div className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-full ${isHighlighted ? 'bg-primary/20 text-primary' : 'bg-muted text-foreground'}`}>
                {icon}
              </div>
              {count !== undefined && (
                <div className="bg-primary rounded-full min-w-[28px] h-7 flex items-center justify-center text-white text-sm font-medium">
                  {count}
                </div>
              )}
            </div>
            
            <h3 className="text-lg font-medium mb-1 text-left">{title}</h3>
            <p className="text-muted-foreground text-sm mb-3 text-left">{description}</p>
            
            {completion !== undefined && (
              <div className="w-full bg-muted rounded-full h-2 mb-3">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${completion}%` }}
                ></div>
              </div>
            )}
            
            <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary hover:bg-transparent">
              <span className="mr-1">Go to section</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
};

interface NotificationCardProps {
  title: string;
  description: string;
  time: string;
  to: string;
  isNew?: boolean;
}

const NotificationCard = ({ title, description, time, to, isNew }: NotificationCardProps) => {
  return (
    <Link to={to}>
      <Card className={`hover:bg-muted/50 transition-colors ${isNew ? 'border-primary/50' : ''}`}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center">
                <h4 className="font-medium text-left">{title}</h4>
                {isNew && (
                  <span className="ml-2 px-2 py-0.5 bg-primary/20 text-primary text-xs rounded-full">
                    New
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1 text-left">{description}</p>
            </div>
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default AllActionsPage;
