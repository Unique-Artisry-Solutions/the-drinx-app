
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface BarCrawl {
  id: string;
  name: string;
  start_date: string | null;
  end_date: string | null;
}

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
  const [userBarCrawls, setUserBarCrawls] = useState<BarCrawl[]>([]);
  const [selectedBarCrawl, setSelectedBarCrawl] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUserBarCrawls = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // If no authenticated user, use sample data
        if (!user) {
          console.log('No authenticated user, using sample data');
          // Use sample data instead
          const sampleBarCrawls = [
            { id: 'bc-1', name: 'Downtown Explorer', start_date: null, end_date: null },
            { id: 'bc-2', name: 'Weekend Adventure', start_date: null, end_date: null }
          ];
          setUserBarCrawls(sampleBarCrawls);
          setSelectedBarCrawl(sampleBarCrawls[0].id);
          setLoading(false);
          return;
        }
        
        console.log('Fetching bar crawls for user:', user.id);
        const today = new Date().toISOString().split('T')[0];
        
        // Try fetching from local storage first as fallback
        const localBarCrawls = localStorage.getItem('user_bar_crawls');
        if (localBarCrawls) {
          const parsedCrawls = JSON.parse(localBarCrawls);
          console.log('Found local bar crawls:', parsedCrawls);
          
          // Convert to expected format
          const formattedCrawls = parsedCrawls.map((crawl: any) => ({
            id: crawl.id,
            name: crawl.name,
            start_date: crawl.startDate || null,
            end_date: crawl.endDate || null
          }));
          
          setUserBarCrawls(formattedCrawls);
          if (formattedCrawls.length > 0) {
            setSelectedBarCrawl(formattedCrawls[0].id);
          }
          setLoading(false);
          return;
        }
        
        // If Supabase is available, try fetching from there
        const { data, error } = await supabase
          .from('bar_crawls')
          .select('*')
          .eq('organizer_id', user.id)
          .or(`start_date.gt.${today},start_date.is.null`);

        if (error) {
          console.error('Supabase error fetching bar crawls:', error);
          throw error;
        }
        
        console.log('Received bar crawls from Supabase:', data);
        if (data && data.length > 0) {
          setUserBarCrawls(data);
          setSelectedBarCrawl(data[0].id);
        } else {
          // If no data from Supabase, use sample data
          const sampleBarCrawls = [
            { id: 'bc-1', name: 'Downtown Explorer', start_date: null, end_date: null },
            { id: 'bc-2', name: 'Weekend Adventure', start_date: null, end_date: null }
          ];
          setUserBarCrawls(sampleBarCrawls);
          setSelectedBarCrawl(sampleBarCrawls[0].id);
        }
      } catch (err: any) {
        console.error('Error fetching user bar crawls:', err);
        setError('Failed to load your bar crawls. Using sample data instead.');
        
        // Fallback to sample data on error
        const sampleBarCrawls = [
          { id: 'bc-1', name: 'Downtown Explorer', start_date: null, end_date: null },
          { id: 'bc-2', name: 'Weekend Adventure', start_date: null, end_date: null }
        ];
        setUserBarCrawls(sampleBarCrawls);
        setSelectedBarCrawl(sampleBarCrawls[0].id);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchUserBarCrawls();
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !time || !partySize || !selectedBarCrawl) {
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
      
      const selectedCrawl = userBarCrawls.find(crawl => crawl.id === selectedBarCrawl);
      const crawlName = selectedCrawl ? selectedCrawl.name : 'Selected bar crawl';
      
      toast({
        title: 'Request Sent',
        description: `Your request to include ${establishment.name} in "${crawlName}" has been sent.`,
      });
      
      // Reset form and close
      setDate('');
      setTime('');
      setMessage('');
      setPartySize('');
      setSelectedBarCrawl('');
      onClose();
    }, 1000);
  };

  const hasEligibleBarCrawls = userBarCrawls.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Request Bar Crawl Participation</DialogTitle>
        </DialogHeader>
        
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-3 mb-4">
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-2 text-sm text-gray-500">Loading your bar crawls...</p>
          </div>
        ) : !hasEligibleBarCrawls ? (
          <div className="py-4 text-center">
            <p className="mb-4">You don't have any active bar crawls that haven't started yet.</p>
            <Button asChild>
              <a href="/profile/create-bar-crawl">Create a Bar Crawl</a>
            </Button>
          </div>
        ) : (
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
            
            <div>
              <Label htmlFor="bar-crawl" className="required">Bar Crawl</Label>
              <Select 
                value={selectedBarCrawl} 
                onValueChange={setSelectedBarCrawl}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a bar crawl" />
                </SelectTrigger>
                <SelectContent>
                  {userBarCrawls.map((crawl) => (
                    <SelectItem key={crawl.id} value={crawl.id}>
                      {crawl.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BarCrawlRequestModal;
