
// Define shared types for authentication components
export interface UserAuthProps {
  onSuccess?: () => void;
  onClose?: () => void;
  defaultTab?: 'login' | 'signup';
  userType?: 'individual' | 'establishment' | 'promoter' | 'admin';
}
