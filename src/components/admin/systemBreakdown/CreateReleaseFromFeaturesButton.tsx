
import React from 'react';
import { Button } from '@/components/ui/button';
import { Package, Calendar, ArrowRight } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface CreateReleaseFromFeaturesButtonProps {
  onClick: () => void;
}

const CreateReleaseFromFeaturesButton: React.FC<CreateReleaseFromFeaturesButtonProps> = ({ onClick }) => {
  const { toast } = useToast();
  
  const handleClick = () => {
    toast({
      title: "Feature Unavailable",
      description: "The Release Management module has been removed from the system.",
      duration: 5000,
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-500" />
          Feature Management
        </CardTitle>
        <CardDescription>
          Consolidate and manage application features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          The release management functionality has been removed from this system.
          Please contact your system administrator for more information about feature management.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleClick} className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Feature Management</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateReleaseFromFeaturesButton;
