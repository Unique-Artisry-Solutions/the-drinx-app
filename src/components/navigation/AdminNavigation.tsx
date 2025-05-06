import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useUser } from '@/hooks/useUser';
import { Home, Settings, Users, LayoutDashboard, Calendar, Mailbox, ShoppingBag, Gift, BadgeCheck, ListChecks, PieChart, MessageSquare } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-2 rounded-md p-2 text-sm font-medium hover:bg-secondary ${
            isActive ? 'bg-secondary' : 'text-muted-foreground'
          }`
        }
      >
        {icon}
        {label}
      </NavLink>
    </li>
  );
};

export const AdminNavigation = () => {
  const { logout } = useAuth();
  const { user } = useUser();
  
  return (
    <nav className="space-y-1">
      <NavItem 
        to="/admin" 
        icon={<LayoutDashboard className="h-5 w-5" />} 
        label="Dashboard" 
      />
      
      <NavItem 
        to="/admin/events" 
        icon={<Calendar className="h-5 w-5" />} 
        label="Events" 
      />
      
      <NavItem 
        to="/admin/establishments" 
        icon={<Home className="h-5 w-5" />} 
        label="Establishments" 
      />
      
      <NavItem 
        to="/admin/promoters" 
        icon={<Users className="h-5 w-5" />} 
        label="Promoters" 
      />
      
      <NavItem 
        to="/admin/communications" 
        icon={<MessageSquare className="h-5 w-5" />} 
        label="Communications" 
      />
      
      <NavItem 
        to="/admin/rewards" 
        icon={<Gift className="h-5 w-5" />} 
        label="Rewards" 
      />
      
      <NavItem 
        to="/admin/moderation" 
        icon={<ListChecks className="h-5 w-5" />} 
        label="Moderation" 
      />
      
      <NavItem 
        to="/admin/system" 
        icon={<Settings className="h-5 w-5" />} 
        label="System Settings" 
      />
      
      <NavItem 
        to="/admin/analytics" 
        icon={<PieChart className="h-5 w-5" />} 
        label="Analytics" 
      />
      
      <NavItem 
        to="/admin/audience" 
        icon={<Users className="h-5 w-5" />} 
        label="Audience Management" 
      />
    </nav>
  );
};
