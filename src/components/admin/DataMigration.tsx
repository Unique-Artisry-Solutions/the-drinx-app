
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const DataMigration: React.FC = () => {
  const [isMigrating, setIsMigrating] = useState(false);
  const { toast } = useToast();

  const handleMigration = async () => {
    try {
      setIsMigrating(true);
      // Simulate migration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Migration successful',
        description: 'Sample data has been migrated successfully',
      });
    } catch (error) {
      toast({
        title: 'Migration failed',
        description: 'There was an error during migration',
        variant: 'destructive',
      });
    } finally {
      setIsMigrating(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Data Migration</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Migrate sample data to the database
        </p>
        <Button 
          onClick={handleMigration} 
          disabled={isMigrating}
          className="w-full"
        >
          {isMigrating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Migrating...
            </>
          ) : (
            'Start Migration'
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DataMigration;
