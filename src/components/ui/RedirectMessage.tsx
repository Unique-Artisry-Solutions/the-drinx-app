
import React, { useEffect, useState } from 'react';
import { toast } from '@/hooks/use-toast';
import { AlertTriangle } from 'lucide-react';

const RedirectMessage = () => {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Check if there's a redirect message in localStorage
    const redirectMessage = localStorage.getItem('redirect_message');
    if (redirectMessage) {
      setMessage(redirectMessage);
      
      // Display the toast
      toast({
        title: "Access Restricted",
        description: redirectMessage,
        variant: "destructive",
        icon: <AlertTriangle className="h-4 w-4" />
      });
      
      // Clear the message
      localStorage.removeItem('redirect_message');
    }
  }, []);

  return null; // This component doesn't render anything visible
};

export default RedirectMessage;
