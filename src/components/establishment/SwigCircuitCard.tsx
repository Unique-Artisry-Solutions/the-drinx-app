
import React, { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, MapPinIcon, UsersIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { SwigCircuitRequest } from '@/hooks/useSwigCircuitRequests';

interface SwigCircuitCardProps {
  crawl: SwigCircuitRequest;
  handleEndParticipation?: (id: string) => void;
  handleAcceptRequest?: (id: string) => void;
}

const SwigCircuitCard: React.FC<SwigCircuitCardProps> = ({
  crawl,
  handleEndParticipation,
  handleAcceptRequest
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const isPending = crawl.status === 'pending';
  
  return <Card className="hover:shadow transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start my-0 py-[8px]">
          <div>
            <h3 className="font-medium">{crawl.name}</h3>
            <p className="text-sm text-material-on-surface-variant">Organized by {crawl.organizer}</p>
          </div>
          
          <Badge variant={isPending ? "destructive" : "outline"} className={isPending ? "" : "bg-green-50 text-green-600 border-green-200"}>
            {isPending ? 'Pending' : 'Accepted'}
          </Badge>
        </div>
        
        <div className="flex flex-wrap gap-4 mt-4">
          <div className="flex items-center text-sm">
            <CalendarIcon className="h-4 w-4 mr-1 text-material-on-surface-variant" />
            <span>
              {crawl.startDate === crawl.endDate ? crawl.date : `${crawl.startDate} - ${crawl.endDate}`}
            </span>
          </div>
          
          <div className="flex items-center text-sm">
            <UsersIcon className="h-4 w-4 mr-1 text-material-on-surface-variant" />
            <span>{crawl.participants} participants</span>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)} className="mt-3 p-0 text-primary font-normal">
          {showDetails ? "Hide details" : "Show details"}
          {showDetails ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
        </Button>
        
        {showDetails && <div className="mt-4 pt-4 border-t space-y-3">
            {crawl.description && <div>
                <h4 className="text-sm font-medium">Description</h4>
                <p className="text-sm text-material-on-surface-variant">{crawl.description}</p>
              </div>}
            
            {crawl.otherEstablishments.length > 0 && <div>
                <h4 className="text-sm font-medium">Other Establishments</h4>
                <div className="flex flex-wrap gap-2 mt-1">
                  {crawl.otherEstablishments.map((e, i) => <Badge key={i} variant="outline" className="bg-material-surface-container-low">
                      {e}
                    </Badge>)}
                </div>
              </div>}
          </div>}
      </CardContent>
      
      <CardFooter className="flex justify-end gap-2 p-4 pt-0">
        {isPending && handleAcceptRequest ? <Button variant="outline" onClick={() => handleAcceptRequest(crawl.id)}>
            Accept Request
          </Button> : handleEndParticipation ? <Button variant="outline" onClick={() => handleEndParticipation(crawl.id)}>
            End Participation
          </Button> : null}
      </CardFooter>
    </Card>;
};

export default SwigCircuitCard;
