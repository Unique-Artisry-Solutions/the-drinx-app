
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { migrateAllData } from '@/utils/supabaseMigration';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const DataMigration: React.FC = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const { toast } = useToast();

  const handleMigration = async () => {
    try {
      setIsMigrating(true);
      const success = await migrateAllData();
      
      if (success) {
        toast({
          title: 'Migration successful',
          description: 'Sample data has been added to Supabase',
        });
      } else {
        toast({
          title: 'Migration failed',
          description: 'There was an error migrating the data',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Migration error:', error);
      toast({
        title: 'Migration error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <div className="p-4 border rounded-md bg-white shadow-sm">
      <h3 className="text-lg font-medium mb-2">Data Migration</h3>
      <p className="text-sm text-muted-foreground mb-4">
        Upload sample data (establishments, cocktails, bar crawls) to Supabase
      </p>
      <Button 
        onClick={handleMigration} 
        disabled={isMigrating}
        className="w-full"
      >
        {isMigrating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Migrating data...
          </>
        ) : (
          'Migrate Sample Data to Supabase'
        )}
      </Button>
    </div>
  );
};

export default DataMigration;
