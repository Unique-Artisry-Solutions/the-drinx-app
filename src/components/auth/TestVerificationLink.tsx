
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const TestVerificationLink: React.FC = () => {
  const [manualLink, setManualLink] = useState('');
  
  const handleTestLink = () => {
    if (manualLink) {
      // Navigate to the provided link
      window.location.href = manualLink;
    }
  };
  
  // Generate a test link with the right parameters
  const generateTestLink = () => {
    const baseUrl = window.location.origin;
    setManualLink(`${baseUrl}/?email_confirmed=true`);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Test Email Verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Use this utility to test email verification links. You can either paste a verification link you received
          or click "Generate Test Link" to create a sample link.
        </p>
        
        <div className="space-y-2">
          <Input
            value={manualLink}
            onChange={(e) => setManualLink(e.target.value)}
            placeholder="Paste verification link here"
            className="w-full"
          />
        </div>
        
        <div className="flex gap-2">
          <Button onClick={generateTestLink} variant="outline">
            Generate Test Link
          </Button>
          <Button onClick={handleTestLink} disabled={!manualLink}>
            Test Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestVerificationLink;
