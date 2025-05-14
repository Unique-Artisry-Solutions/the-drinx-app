
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useSavedCodes } from '@/contexts/SavedCodesContext';
import PromotionCodeShareCard from './PromotionCodeShareCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Bookmark } from 'lucide-react';

interface SavedPromotionCodesProps {
  maxHeight?: string;
  showTitle?: boolean;
}

const SavedPromotionCodes: React.FC<SavedPromotionCodesProps> = ({
  maxHeight = '300px',
  showTitle = true
}) => {
  const { savedCodes, isLoading, removeCode } = useSavedCodes();
  
  if (isLoading) {
    return (
      <Card>
        {showTitle && (
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Bookmark className="h-5 w-5 mr-2" />
              Saved Promotion Codes
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (savedCodes.length === 0) {
    return (
      <Card>
        {showTitle && (
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Bookmark className="h-5 w-5 mr-2" />
              Saved Promotion Codes
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <Bookmark className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium mb-1">No saved codes</h3>
            <p className="text-sm text-gray-500">
              You haven't saved any promotion codes yet.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      {showTitle && (
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center">
            <Bookmark className="h-5 w-5 mr-2" />
            Saved Promotion Codes ({savedCodes.length})
          </CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <ScrollArea className={`h-full max-h-[${maxHeight}]`}>
          <div className="space-y-4">
            {savedCodes.map((code) => (
              <PromotionCodeShareCard
                key={code.id}
                code={code.code}
                description={code.description}
                discountType={code.discount_type}
                discountValue={code.discount_value}
                expiryDate={code.end_date}
                isSaved={true}
                onSave={() => removeCode(code.id)}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default SavedPromotionCodes;
