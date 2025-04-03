
// Re-export the UserTopNav component from its new location
import UserTopNav from './user/UserTopNav';

interface TabOption {
  value: string;
  label: string;
}

interface UserTopNavigationProps {
  activeTab?: string;
  handleTabChange?: (value: string) => void;
  tabOptions?: TabOption[];
}

const UserTopNavigation: React.FC<UserTopNavigationProps> = ({ 
  activeTab, 
  handleTabChange, 
  tabOptions 
}) => {
  return (
    <UserTopNav 
      activeTab={activeTab} 
      handleTabChange={handleTabChange} 
      tabOptions={tabOptions} 
    />
  );
};

export default UserTopNavigation;
