
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { Flag } from 'lucide-react';
import { flagContent } from '@/utils/photoModerationUtils';
import { useAuth } from '@/contexts/auth';

interface ReportButtonProps {
  contentType: string;
  contentId: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ReportButton: React.FC<ReportButtonProps> = ({ 
  contentType, 
  contentId,
  variant = 'ghost',
  size = 'sm'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('inappropriate');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleReport = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to report content.",
        variant: "destructive",
      });
      setIsOpen(false);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await flagContent(contentType, contentId, reason, details);
      
      toast({
        title: "Content reported",
        description: "Thank you for helping keep our community safe. Our moderators will review this content.",
      });
      
      setIsOpen(false);
      setReason('inappropriate');
      setDetails('');
    } catch (error) {
      console.error('Error reporting content:', error);
      toast({
        title: "Report failed",
        description: "There was a problem submitting your report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        variant={variant}
        size={size}
        className="gap-1"
      >
        <Flag className="h-3.5 w-3.5" />
        <span>Report</span>
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report Content</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>What's the issue?</Label>
              <RadioGroup value={reason} onValueChange={setReason} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inappropriate" id="inappropriate" />
                  <Label htmlFor="inappropriate" className="font-normal">Inappropriate content</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="spam" id="spam" />
                  <Label htmlFor="spam" className="font-normal">Spam</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="offensive" id="offensive" />
                  <Label htmlFor="offensive" className="font-normal">Offensive or abusive</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="other" id="other" />
                  <Label htmlFor="other" className="font-normal">Other</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="details">Additional details (optional)</Label>
              <Textarea 
                id="details" 
                placeholder="Please provide any additional information about this report"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReport} disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReportButton;
