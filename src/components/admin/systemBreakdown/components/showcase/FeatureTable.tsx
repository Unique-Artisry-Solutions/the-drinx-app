
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FeatureShowcaseData } from '../../types';
import * as Icons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FeatureTableProps {
  features: FeatureShowcaseData[];
}

const FeatureTable: React.FC<FeatureTableProps> = ({ features }) => {
  const [selectedFeature, setSelectedFeature] = useState<FeatureShowcaseData | null>(null);
  
  // Create a dynamic icon component
  const DynamicIcon = ({ iconName }: { iconName: string }) => {
    const LucideIcon = (Icons as any)[iconName.charAt(0).toUpperCase() + iconName.slice(1)] || Icons.Star;
    return <LucideIcon className="h-4 w-4" />;
  };
  
  if (features.length === 0) {
    return (
      <div className="text-center py-12">
        <Icons.FileText className="h-12 w-12 mx-auto text-gray-300 mb-3" />
        <h3 className="text-lg font-medium text-gray-600">No features to display</h3>
        <p className="text-gray-500 mt-2">Try changing your search or filter criteria.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Feature</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Business Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {features.map((feature) => {
              // Determine status badge style
              const statusBadgeStyle = 
                feature.implementationStatus === 'implemented' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-amber-100 text-amber-800';
              
              // Determine business value badge style
              const valueBadgeStyle = 
                feature.businessValue === 'high' 
                  ? 'bg-purple-100 text-purple-800'
                  : feature.businessValue === 'medium'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800';
              
              return (
                <TableRow key={feature.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-100 p-1 rounded">
                        <DynamicIcon iconName={feature.icon || 'star'} />
                      </div>
                      <div>
                        <div className="font-medium flex items-center gap-1">
                          {feature.name}
                          {feature.isSignature && (
                            <Icons.Star className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {feature.description}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {feature.showcaseCategory}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={valueBadgeStyle}>
                      {feature.businessValue}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={statusBadgeStyle}>
                      {feature.implementationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedFeature(feature)}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Feature Details Dialog */}
      <Dialog open={!!selectedFeature} onOpenChange={(open) => !open && setSelectedFeature(null)}>
        {selectedFeature && (
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <div className="flex items-center gap-3">
                <div className="bg-gray-100 p-2 rounded-lg">
                  <DynamicIcon iconName={selectedFeature.icon || 'star'} />
                </div>
                <DialogTitle className="text-xl">{selectedFeature.name}</DialogTitle>
              </div>
              <DialogDescription>
                {selectedFeature.description}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Implementation Status</div>
                  <Badge className={
                    selectedFeature.implementationStatus === 'implemented' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }>
                    {selectedFeature.implementationStatus}
                  </Badge>
                </div>
                
                <div>
                  <div className="text-sm font-medium">Business Value</div>
                  <Badge className={
                    selectedFeature.businessValue === 'high' 
                      ? 'bg-purple-100 text-purple-800'
                      : selectedFeature.businessValue === 'medium'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                  }>
                    {selectedFeature.businessValue}
                  </Badge>
                </div>
                
                <div>
                  <div className="text-sm font-medium">Category</div>
                  <div>{selectedFeature.showcaseCategory}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">Complexity</div>
                  <div className="capitalize">{selectedFeature.complexity}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">Implementations</div>
                  <div>{selectedFeature.implementations !== undefined ? selectedFeature.implementations : 'N/A'}</div>
                </div>
                
                <div>
                  <div className="text-sm font-medium">Average Rating</div>
                  <div className="flex items-center gap-1">
                    <Icons.Star className="h-4 w-4 text-yellow-500" />
                    {selectedFeature.avgRating !== undefined ? selectedFeature.avgRating.toFixed(1) : 'N/A'}
                  </div>
                </div>
              </div>
              
              {selectedFeature.marketingPoints && selectedFeature.marketingPoints.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Marketing Points</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {selectedFeature.marketingPoints.map((point, idx) => (
                      <li key={idx} className="text-sm">{point}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {selectedFeature.isSignature && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <Icons.Award className="h-5 w-5" />
                    <span className="font-medium">Signature Feature</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    This is one of our platform's signature features that provides significant
                    differentiation from competitors and delivers exceptional value to clients.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </>
  );
};

export default FeatureTable;
