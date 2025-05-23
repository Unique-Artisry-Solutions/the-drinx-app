
import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useNavigation } from '@/contexts/NavigationContext';
import { LinkProps } from '@/types/navigation/LinkTypes';

interface NavLinkProps extends LinkProps {
  className?: string;
}

interface UserNavLinksProps {
  userType?: 'individual' | 'establishment' | 'promoter';
}

const NavLink: React.FC<NavLinkProps> = ({
  href,
  children,
  className,
  activeClassName = "text-primary",
  ...props
}) => {
  const { isPathActive } = useNavigation();
  const isActive = isPathActive(href);
  
  return (
    <Link 
      to={href} 
      className={cn(
        "px-3 py-2 text-sm font-medium transition-colors hover:text-primary",
        isActive ? activeClassName : "text-foreground/70",
        className
      )} 
      {...props}
    >
      {children}
    </Link>
  );
};

const UserNavLinks: React.FC<UserNavLinksProps> = ({ userType = 'individual' }) => {
  // Return appropriate navigation links based on user type
  if (userType === 'establishment') {
    return (
      <nav className="hidden md:flex items-center gap-1">
        <NavLink href="/establishment/dashboard">Dashboard</NavLink>
        <NavLink href="/establishment/profile">Profile</NavLink>
        <NavLink href="/establishment/menu">Menu</NavLink>
        <NavLink href="/establishment/analytics">Analytics</NavLink>
      </nav>
    );
  }

  if (userType === 'promoter') {
    return (
      <nav className="hidden md:flex items-center gap-1">
        <NavLink href="/promoter/dashboard">Dashboard</NavLink>
        <NavLink href="/promoter/events">Events</NavLink>
        <NavLink href="/promoter/analytics">Analytics</NavLink>
        <NavLink href="/promoter/profile">Profile</NavLink>
      </nav>
    );
  }

  // Individual user navigation
  return (
    <nav className="hidden md:flex items-center gap-1">
      <NavLink href="/explore">Explore</NavLink>
      <NavLink href="/map">Map</NavLink>
      <NavLink href="/swig-circuits">Swig Circuits</NavLink>
      <NavLink href="/events">Events</NavLink>
      <NavLink href="/pricing">Pricing</NavLink>
    </nav>
  );
};

export default UserNavLinks;
