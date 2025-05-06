
import React from 'react';
import { useEventWizard } from './EventWizardContext';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, MapPin, Ticket, Clock, Check, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

const PreviewStep: React.FC = () => {
  const { formData } = useEventWizard();
  
  const isFormComplete = () => {
    const requiredFields = [
      formData.name,
      formData.date,
      formData.time,
      formData.venueId
    ];
    
    return requiredFields.every(field => !!field) && (formData.ticketTypes || []).length > 0;
  };

  // Format date if available
  const formattedDate = formData.date 
    ? format(new Date(formData.date), 'EEEE, MMMM d, yyyy')
    : 'Date not specified';

  return (
    <Card className="shadow-md">
      <CardContent className="pt-6">
        <div className="space-y-6">
          {!isFormComplete() && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 mb-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
                <div>
                  <h3 className="font-medium text-yellow-800">Some information is missing</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please go back and complete all required fields before submitting your event.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{formData.name || 'Event Name'}</h2>
            
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>{formattedDate}</span>
              <Clock className="h-4 w-4 ml-4 mr-2" />
              <span>{formData.time || 'Time not specified'}</span>
            </div>
            
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2" />
              <span>{formData.venueId || 'No venue selected'}</span>
            </div>
            
            {formData.imageUrl && (
              <div className="mt-4">
                <img 
                  src={formData.imageUrl} 
                  alt={formData.name} 
                  className="w-full h-64 object-cover rounded-md shadow-sm" 
                />
              </div>
            )}
            
            <div className="pt-2">
              <h3 className="text-lg font-medium">Description</h3>
              <p className="text-gray-700 whitespace-pre-line mt-1">
                {formData.description || 'No description provided'}
              </p>
            </div>
            
            <div className="pt-2">
              <h3 className="text-lg font-medium flex items-center">
                <Ticket className="h-4 w-4 mr-2" />
                Ticket Information
              </h3>
              <div className="mt-2 space-y-3">
                {(formData.ticketTypes || []).map((ticket, index) => (
                  <div key={index} className="p-3 border rounded-md">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{ticket.name}</h4>
                      <span className="text-green-600 font-semibold">
                        ${ticket.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {ticket.description || 'No description'}
                    </p>
                    <div className="text-sm text-gray-500 mt-1">
                      Quantity: {ticket.quantity} tickets
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {formData.promotionalMaterials && formData.promotionalMaterials.length > 0 && (
              <div className="pt-2">
                <h3 className="text-lg font-medium">Promotional Materials</h3>
                <ul className="list-disc list-inside mt-1 text-blue-600">
                  {formData.promotionalMaterials.map((material, index) => (
                    <li key={index} className="truncate">
                      <a href={material} target="_blank" rel="noopener noreferrer">
                        {material}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <div>
                <h3 className="font-medium text-green-800">Ready to publish?</h3>
                <p className="text-sm text-green-700 mt-1">
                  Review all details above before submitting. You can go back to edit any section if needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PreviewStep;
