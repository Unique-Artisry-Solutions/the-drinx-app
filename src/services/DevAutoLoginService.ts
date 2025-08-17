import { supabase } from '@/integrations/supabase/client';
import { TEST_CREDENTIALS } from '@/components/auth/constants/testUsers';
import { toast } from '@/hooks/use-toast';

export type TestUserType = 'individual' | 'establishment' | 'promoter' | 'admin';

export class DevAutoLoginService {
  /**
   * Check if we're in a development environment
   */
  static isDevelopmentMode(): boolean {
    const hostname = window.location.hostname;
    return hostname === 'localhost' || 
           hostname === '127.0.0.1' ||
           hostname.includes('preview--') ||
           hostname.includes('lovable');
  }

  /**
   * Get the currently selected dev user type from localStorage
   */
  static getCurrentDevUserType(): TestUserType | null {
    if (!this.isDevelopmentMode()) return null;
    return localStorage.getItem('dev_auto_login_user_type') as TestUserType | null;
  }

  /**
   * Set the dev user type in localStorage
   */
  static setCurrentDevUserType(userType: TestUserType | null): void {
    if (!this.isDevelopmentMode()) return;
    
    if (userType) {
      localStorage.setItem('dev_auto_login_user_type', userType);
    } else {
      localStorage.removeItem('dev_auto_login_user_type');
    }
  }

  /**
   * Auto-login with the specified test user type
   */
  static async autoLogin(userType: TestUserType): Promise<{ success: boolean; error?: string }> {
    if (!this.isDevelopmentMode()) {
      return { success: false, error: 'Not in development mode' };
    }

    const credentials = TEST_CREDENTIALS[userType];
    if (!credentials) {
      return { success: false, error: 'Invalid user type' };
    }

    try {
      // Sign out first to ensure clean state
      await supabase.auth.signOut();

      // Sign in with test credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) {
        console.error('Auto-login failed:', error);
        return { success: false, error: error.message };
      }

      if (data.user) {
        this.setCurrentDevUserType(userType);
        console.log(`[DevAutoLogin] Successfully logged in as ${userType}:`, credentials.email);
        
        toast({
          title: 'Development Login',
          description: `Logged in as ${credentials.name} (${userType})`,
        });

        return { success: true };
      }

      return { success: false, error: 'No user data returned' };
    } catch (error) {
      console.error('Auto-login error:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  /**
   * Switch to a different test user type
   */
  static async switchUserType(userType: TestUserType): Promise<{ success: boolean; error?: string }> {
    return this.autoLogin(userType);
  }

  /**
   * Logout from development mode
   */
  static async logout(): Promise<void> {
    if (!this.isDevelopmentMode()) return;

    try {
      await supabase.auth.signOut();
      this.setCurrentDevUserType(null);
      
      toast({
        title: 'Development Logout',
        description: 'Logged out from test account',
      });
    } catch (error) {
      console.error('Dev logout error:', error);
    }
  }

  /**
   * Initialize auto-login on app start if a user type is stored
   */
  static async initializeAutoLogin(): Promise<void> {
    if (!this.isDevelopmentMode()) return;

    const storedUserType = this.getCurrentDevUserType();
    if (!storedUserType) return;

    // Check if already logged in
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      console.log(`[DevAutoLogin] Already logged in, skipping auto-login`);
      return;
    }

    console.log(`[DevAutoLogin] Initializing auto-login for ${storedUserType}`);
    await this.autoLogin(storedUserType);
  }

  /**
   * Get all available test user types
   */
  static getAvailableUserTypes(): { type: TestUserType; label: string; credentials: typeof TEST_CREDENTIALS.individual }[] {
    return [
      { type: 'individual', label: 'Individual User', credentials: TEST_CREDENTIALS.individual },
      { type: 'establishment', label: 'Business Owner', credentials: TEST_CREDENTIALS.establishment },
      { type: 'promoter', label: 'Event Promoter', credentials: TEST_CREDENTIALS.promoter },
      { type: 'admin', label: 'Administrator', credentials: TEST_CREDENTIALS.admin },
    ];
  }
}