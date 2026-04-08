
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Share2, MapPin, Users, Beer, Tag, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import QRCodeLightbox from '@/components/qrcode/QRCodeLightbox';

interface SwigCircuitTabProps {
  swigCircuitList: any[];
  shareSwigCircuit: () => void;
}

const SwigCircuitTab: React.FC<SwigCircuitTabProps> = ({ swigCircuitList, shareSwigCircuit }) => {
  const [currentEstablishment, setCurrentEstablishment] = useState<any>(swigCircuitList[0] || null);
  const [activeUsers, setActiveUsers] = useState<number>(Math.floor(Math.random() * 20) + 5);
  const [isParticipating, setIsParticipating] = useState<boolean>(true);
  const [promoCode, setPromoCode] = useState<string>("SPIRITLESS25");
  const [swigCircuitId, setSwigCircuitId] = useState<string>("bc-123");
  const [qrCodeOpen, setQrCodeOpen] = useState<boolean>(false);

  const toggleParticipation = () => {
    setIsParticipating(!isParticipating);
  };

  // Create a unique QR code value for check-ins
  const generateQRValue = () => {
    return JSON.stringify({
      type: 'check-in',
      swigCircuitId,
      establishmentId: currentEstablishment?.id,
      userId: localStorage.getItem('user_id') || 'anonymous',
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-4">
      {isParticipating && currentEstablishment && (
        <Card className="border-spiritless-pink border-2">
          <CardContent className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">Currently Participating</h3>
                  <p className="text-material-on-surface-variant text-sm">You're checked in to the Swig Circuit</p>
                </div>
                <Button variant="outline" size="sm" onClick={toggleParticipation}>
                  Leave Circuit
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Beer className="h-5 w-5 mr-2 text-material-primary" />
                    <span className="font-medium">Current Stop:</span>
                    <span className="ml-2">{currentEstablishment.name}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-material-primary" />
                    <span className="text-sm">{currentEstablishment.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2 text-material-primary" />
                    <span className="text-sm">{activeUsers} app users here now</span>
                  </div>
                  <div className="flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-material-primary" />
                    <span className="text-sm font-medium">Promo Code:</span>
                    <span className="ml-2 bg-material-primary/10 text-material-primary px-2 py-1 rounded text-sm font-bold">
                      {promoCode}
                    </span>
                  </div>
                </div>
                
                <div className="flex flex-col space-y-3">
                  <Button 
                    onClick={() => setQrCodeOpen(true)} 
                    className="w-full flex items-center justify-center"
                    variant="outline"
                  >
                    <QrCode className="mr-2 h-4 w-4" />
                    Show Check-In QR Code
                  </Button>
                  
                  <QRCodeLightbox 
                    value={generateQRValue()} 
                    title="Check-In QR Code" 
                    subtitle="Scan this code at the establishment to check in" 
                    isOpen={qrCodeOpen}
                    onClose={() => setQrCodeOpen(false)}
                  />

                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link to={`/establishment/${currentEstablishment.id}`} className="flex-1">
                      <Button variant="outline" className="w-full justify-start" size="compact">
                        <MapPin size={16} className="mr-1" />
                        View Location
                      </Button>
                    </Link>
                    <Link to={`/profile/swig-circuits/participants/${swigCircuitId}`} className="flex-1">
                      <Button variant="outline" className="w-full justify-start text-xs" size="compact">
                        <User size={16} className="mr-1" />
                        Locate Participants 
                      </Button>
                    </Link>
                  </div>
                  
                  <Link to={`/swig-circuit-details/${swigCircuitId}`} className="w-full">
                    <Button className="w-full bg-spiritless-pink hover:bg-spiritless-pink/90" size="sm">
                      View Swig Circuit Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium">Your Swig Circuit List</h3>
          {swigCircuitList.length > 0 && (
            <Button size="sm" variant="outline" onClick={shareSwigCircuit}>
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
          )}
        </div>
        
        {swigCircuitList.length === 0 ? (
          <div className="text-center py-6 border border-dashed rounded-lg bg-gray-50">
            <p className="text-material-on-surface-variant">No establishments in your Swig Circuit list yet.</p>
            <Link to="/map">
              <Button variant="link" className="mt-1">
                Explore Map
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {swigCircuitList.map((establishment) => (
              <div 
                key={establishment.id} 
                className={`border rounded-lg p-3 ${currentEstablishment?.id === establishment.id ? 'border-material-primary bg-material-primary/5' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h4 className="font-medium">{establishment.name}</h4>
                      {currentEstablishment?.id === establishment.id && (
                        <Badge className="ml-2 bg-material-primary">Current</Badge>
                      )}
                    </div>
                    <p className="text-sm text-material-on-surface-variant mt-1">
                      {establishment.address}
                    </p>
                  </div>
                  
                  <Link to={`/establishment/${establishment.id}`}>
                    <Button size="sm" variant="outline">View</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SwigCircuitTab;
