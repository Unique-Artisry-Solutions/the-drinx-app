
import React, { useState } from 'react';
import { useEventWizard } from './EventWizardContext';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Upload, X, Image, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const MediaStep: React.FC = () => {
  const { formData, updateFormData } = useEventWizard();
  const [previewImage, setPreviewImage] = useState<string | null>(formData.imageUrl || null);
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewImage(imageUrl);
        updateFormData({ imageUrl });
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const addPromotionalMaterial = () => {
    updateFormData({
      promotionalMaterials: [...formData.promotionalMaterials, '']
    });
  };
  
  const updatePromotionalMaterial = (index: number, url: string) => {
    const updatedMaterials = [...formData.promotionalMaterials];
    updatedMaterials[index] = url;
    updateFormData({ promotionalMaterials: updatedMaterials });
  };
  
  const removePromotionalMaterial = (index: number) => {
    const updatedMaterials = formData.promotionalMaterials.filter((_, i) => i !== index);
    updateFormData({ promotionalMaterials: updatedMaterials });
  };

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div>
            <Label className="text-lg font-medium">Event Cover Image</Label>
            <p className="text-sm text-gray-500 mb-3">This will be the main image for your event</p>
            
            <div className="mt-2">
              {previewImage ? (
                <div className="relative">
                  <img 
                    src={previewImage} 
                    alt="Event preview" 
                    className="w-full h-64 object-cover rounded-md shadow-sm" 
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white"
                    onClick={() => {
                      setPreviewImage(null);
                      updateFormData({ imageUrl: '' });
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center">
                  <Image className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <span className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 inline-flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Image
                      </span>
                      <Input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="mt-2 text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Promotional Materials</Label>
              <Button 
                variant="outline" 
                size="sm"
                onClick={addPromotionalMaterial}
                className="text-purple-600 border-purple-600 hover:bg-purple-50"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.promotionalMaterials.map((material, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={material}
                    onChange={(e) => updatePromotionalMaterial(index, e.target.value)}
                    placeholder="Enter URL for promotional material"
                    className={cn(
                      "flex-1",
                      !material && "border-red-300"
                    )}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removePromotionalMaterial(index)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              {formData.promotionalMaterials.length === 0 && (
                <p className="text-center py-2 text-gray-500">
                  No promotional materials added. Click the button above to add links to your promotional materials.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaStep;
