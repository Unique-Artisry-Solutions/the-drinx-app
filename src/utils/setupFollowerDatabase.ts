
import { supabase } from '@/integrations/supabase/client';

export async function setupFollowerDatabase() {
  try {
    console.log('Setting up follower database schema...');
    
    // Check if tables exist by trying to query them
    const checkTable = async (tableName: string) => {
      try {
        const { error } = await supabase.from(tableName as any).select('id').limit(1);
        return !error;
      } catch {
        return false;
      }
    };

    const promoterFollowersExists = await checkTable('promoter_followers');
    const notificationsExists = await checkTable('notifications');
    
    if (!promoterFollowersExists) {
      console.log('promoter_followers table not found - please run the database migration');
    }

    if (!notificationsExists) {
      console.log('notifications table not found - please run the database migration');
    }

    console.log('Database setup check completed');
    return promoterFollowersExists && notificationsExists;
  } catch (error) {
    console.error('Error setting up database:', error);
    return false;
  }
}
