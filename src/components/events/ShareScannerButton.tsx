
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { QrCode, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateEventAccessToken, getCurrentEventToken } from '@/services/eventAccessService';

interface ShareScannerButtonProps {
  eventId: string;
  eventName: string;
}

const ShareScannerButton: React.FC<ShareScannerButtonProps> = ({ eventId, eventName }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [scannerUrl, setScannerUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isOpen) {
      loadCurrentToken();
    }
  }, [isOpen, eventId]);
  
  const loadCurrentToken = async () => {
    setIsLoading(true);
    try {
      const token = await getCurrentEventToken(eventId);
      
      if (token) {
        const url = `${window.location.origin}/events/scan/${eventId}/${token}`;
        setScannerUrl(url);
        setHasToken(true);
      } else {
        setHasToken(false);
      }
    } catch (error) {
      console.error('Error loading current token:', error);
      setHasToken(false);
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateNewToken = async () => {
    setIsGenerating(true);
    try {
      const token = await generateEventAccessToken(eventId);
      
      if (token) {
        const url = `${window.location.origin}/events/scan/${eventId}/${token}`;
        setScannerUrl(url);
        setHasToken(true);
        
        toast({
          title: "New Scanner Link Generated",
          description: "The link has been updated. Previous links will no longer work."
        });
      } else {
        toast({
          title: "Failed to Generate Link",
          description: "Could not create a new scanner link.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error generating token:', error);
      toast({
        title: "Error",
        description: "Failed to generate scanner link",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const copyToClipboard = () => {
    if (inputRef.current) {
      inputRef.current.select();
      document.execCommand('copy');
      
      toast({
        title: "Link Copied",
        description: "Scanner link copied to clipboard"
      });
    }
  };
  
  return (
    <>
      <Button 
        variant="outline" 
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <QrCode className="h-4 w-4" />
        Share Scanner
      </Button>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Ticket Scanner</DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Share this link with event staff to allow them to scan tickets without logging in. 
              Links are valid for 30 days and can be regenerated if needed.
            </p>
            
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-pulse">Loading...</div>
              </div>
            ) : hasToken ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-2">
                    <Input 
                      ref={inputRef}
                      value={scannerUrl}
                      readOnly
                      className="font-mono text-xs"
                    />
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="flex flex-col items-center gap-4 py-4">
                <p>No active scanner link found for this event.</p>
              </div>
            )}
            
            <Button
              onClick={generateNewToken}
              disabled={isGenerating}
              variant={hasToken ? "outline" : "default"}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  {hasToken ? "Generate New Link" : "Generate Scanner Link"}
                </>
              )}
            </Button>
            
            {hasToken && (
              <p className="text-xs text-muted-foreground">
                Warning: Generating a new link will invalidate the current link.
              </p>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShareScannerButton;
