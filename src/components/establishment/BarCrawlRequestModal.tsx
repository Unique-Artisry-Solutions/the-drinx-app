
import React, { useState } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface BarCrawlRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  establishment: any;
}

const BarCrawlRequestModal: React.FC<BarCrawlRequestModalProps> = ({
  isOpen,
  onClose,
  establishment
}) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [partySize, setPartySize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !partySize) {
      toast({
        title: 'Missing information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast({
        title: 'Request Sent',
        description: `Your bar crawl request has been sent to ${establishment.name}`,
      });
      
      // Reset form and close
      setDate('');
      setTime('');
      setMessage('');
      setPartySize('');
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Bar Crawl Participation</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="establishment">Establishment</Label>
            <Input
              id="establishment"
              value={establishment.name}
              disabled
              className="bg-gray-50"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="date" className="required">Date</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="time" className="required">Preferred Time</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="party-size" className="required">Expected Group Size</Label>
            <div className="relative">
              <Users className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                id="party-size"
                type="number"
                min="1"
                placeholder="Number of people"
                value={partySize}
                onChange={(e) => setPartySize(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="message">Additional Message</Label>
            <Textarea
              id="message"
              placeholder="Any special requests or information for the establishment..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
            />
          </div>
          
          <DialogFooter className="flex sm:justify-between gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BarCrawlRequestModal;
