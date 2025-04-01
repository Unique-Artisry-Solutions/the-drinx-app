
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, X, PlusCircle } from 'lucide-react';
import { Establishment } from '@/types/ProfileTypes';

interface EstablishmentsTabProps {
  currentEstablishments: Establishment[];
  availableEstablishments: Establishment[];
  addEstablishment: (establishment: Establishment) => void;
  removeEstablishment: (establishmentId: string) => void;
}

const EstablishmentsTab: React.FC<EstablishmentsTabProps> = ({
  currentEstablishments,
  availableEstablishments,
  addEstablishment,
  removeEstablishment
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Current Establishments</CardTitle>
        </CardHeader>
        <CardContent>
          {currentEstablishments.length > 0 ? (
            <div className="space-y-4">
              {currentEstablishments.map((est, index) => (
                <div key={est.id} className="flex items-center border rounded-md p-3">
                  <div className="h-8 w-8 rounded-full bg-material-primary text-white flex items-center justify-center mr-3">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{est.name}</h3>
                    <div className="flex items-center text-sm text-material-on-surface-variant">
                      <MapPin size={14} className="mr-1" />
                      {est.address}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeEstablishment(est.id)}
                  >
                    <X size={16} className="text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">No establishments added yet</p>
              <p className="text-sm text-gray-400">
                Add establishments from the list on the right
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Add Establishments</CardTitle>
        </CardHeader>
        <CardContent>
          {availableEstablishments.length > 0 ? (
            <div className="space-y-4">
              {availableEstablishments.map((est) => (
                <div key={est.id} className="flex items-center border rounded-md p-3">
                  <div className="flex-1">
                    <h3 className="font-medium">{est.name}</h3>
                    <div className="flex items-center text-sm text-material-on-surface-variant">
                      <MapPin size={14} className="mr-1" />
                      {est.address}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => addEstablishment(est)}
                  >
                    <PlusCircle size={16} className="text-green-500" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No more establishments available</p>
            </div>
          )}
          
          <div className="mt-6">
            <Button variant="outline" className="w-full" asChild>
              <Link to="/map">
                Find More on Map
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EstablishmentsTab;
