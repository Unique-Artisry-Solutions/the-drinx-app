
import React, { useState, useEffect } from 'react';
import { format, addDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, ImagePlus } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface BasicsTabProps {
  name: string;
  setName: (name: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  description: string;
  setDescription: (description: string) => void;
  imageFile: File | null;
  setImageFile: (file: File | null) => void;
  previewUrl: string;
  setPreviewUrl: (url: string) => void;
  onContinue: () => void;
}

const BasicsTab: React.FC<BasicsTabProps> = ({
  name,
  setName,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  description,
  setDescription,
  imageFile,
  setImageFile,
  previewUrl,
  setPreviewUrl,
  onContinue
}) => {
  
  useEffect(() => {
    if (startDate) {
      const start = new Date(startDate);
      const end = addDays(start, 7);
      setEndDate(format(end, 'yyyy-MM-dd'));
    }
  }, [startDate, setEndDate]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calendar className="h-5 w-5 mr-2 text-spiritless-pink" />
          Basic Swig Circuit Details
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crawlName">Swig Circuit Name</Label>
            <Input 
              id="crawlName" 
              placeholder="Weekend Mocktail Tour" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="imageUpload">Swig Circuit Image</Label>
            <div className="relative border rounded-md overflow-hidden">
              {previewUrl ? (
                <div className="aspect-video relative">
                  <img 
                    src={previewUrl} 
                    alt="Swig Circuit preview" 
                    className="w-full h-full object-cover" 
                  />
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="absolute top-2 right-2 bg-white/80"
                    onClick={() => {
                      setPreviewUrl('');
                      setImageFile(null);
                    }}
                  >
                    Change
                  </Button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center p-6 cursor-pointer bg-gray-50 dark:bg-gray-800 aspect-video">
                  <ImagePlus className="h-10 w-10 text-gray-400 dark:text-gray-500 mb-2" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Click to upload an image</span>
                  <input 
                    type="file" 
                    id="imageUpload" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input 
                id="startDate" 
                type="date" 
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (7 days maximum)</Label>
              <Input 
                id="endDate" 
                type="date" 
                value={endDate}
                readOnly 
                className="bg-muted cursor-not-allowed"
                title="End date is automatically set to 7 days after the start date"
              />
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Maximum duration is 7 days
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              placeholder="Describe your Swig Circuit experience" 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              onClick={onContinue}
              disabled={!name || !startDate}
              className="bg-spiritless-pink hover:bg-spiritless-pink/90"
            >
              Continue to Theme Selection
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicsTab;
