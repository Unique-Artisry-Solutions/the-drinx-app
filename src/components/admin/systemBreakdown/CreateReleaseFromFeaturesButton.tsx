
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

interface CreateReleaseFromFeaturesButtonProps {
  onClick: () => void;
}

const CreateReleaseFromFeaturesButton: React.FC<CreateReleaseFromFeaturesButtonProps> = ({ onClick }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5 text-blue-500" />
          Prepare Next Release
        </CardTitle>
        <CardDescription>
          Consolidate implemented, partial, and not-started features into the next release
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">
          This action will create a new release scheduled for one month from today, and add all current 
          features to it based on their implementation status. Implemented features will be marked as completed,
          partial features as in progress, and not-started features as pending.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={onClick} className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Create Release from Features</span>
          <ArrowRight className="h-4 w-4 ml-1" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CreateReleaseFromFeaturesButton;
