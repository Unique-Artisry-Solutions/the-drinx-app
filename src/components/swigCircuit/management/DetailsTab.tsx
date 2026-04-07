
import React, { useState } from 'react';
import { format, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ImagePlus } from 'lucide-react';
import { SwigCircuit } from '@/types/ProfileTypes';

interface DetailsTabProps {
  swigCircuit: SwigCircuit;
  name: string;
  setName: (name: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  description: string;
  setDescription: (description: string) => void;
  saveSwigCircuitChanges: () => void;
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  swigCircuit,
  name,
  setName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  description,
  setDescription,
  saveSwigCircuitChanges
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bar Crawl Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Bar Crawl Name</Label>
                <Input 
                  id="name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    id="startDate" 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      // Update end date based on new start date
                      if (e.target.value) {
                        const start = new Date(e.target.value);
                        const end = addDays(start, 7);
                        setEndDate(format(end, 'yyyy-MM-dd'));
                      }
                    }} 
                  />
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input 
                    id="endDate" 
                    type="date" 
                    value={endDate}
                    readOnly
                    className="bg-gray-50"
                    title="End date is automatically set to 7 days after the start date"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum 7 days
                  </p>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  rows={4}
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <Label>Bar Crawl Image</Label>
              <div className="border rounded-md overflow-hidden">
                <div className="aspect-video relative">
                  <img 
                    src={swigCircuit.imageUrl || 'https://placehold.co/600x300'} 
                    alt={swigCircuit.name} 
                    className="w-full h-full object-cover"
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    className="absolute top-2 right-2 bg-white/80" 
                  >
                    <ImagePlus size={16} className="mr-2" />
                    Change
                  </Button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-medium mb-2">Bar Crawl Stats</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="font-medium">{swigCircuit.status.charAt(0).toUpperCase() + swigCircuit.status.slice(1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Establishments:</span>
                    <span className="font-medium">{swigCircuit.establishments.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Organizer:</span>
                    <span className="font-medium">{swigCircuit.organizer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Created:</span>
                    <span className="font-medium">{swigCircuit.created_at ? format(new Date(swigCircuit.created_at), 'MMM d, yyyy') : 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={saveSwigCircuitChanges}>
              Save Changes
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsTab;
