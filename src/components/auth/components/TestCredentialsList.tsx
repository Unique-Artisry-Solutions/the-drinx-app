
import React from 'react';
import { Button } from '@/components/ui/button';
import { TestCredentialsData } from '../types/testCredentials';
import { Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TestCredentialsListProps {
  credentials: TestCredentialsData;
}

const TestCredentialsList: React.FC<TestCredentialsListProps> = ({ credentials }) => {
  const { toast } = useToast();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: `${text} copied to clipboard`
    });
  };

  const renderCredentialItem = (label: string, value: string) => (
    <div className="flex justify-between items-center text-xs">
      <span className="text-muted-foreground">{label}:</span>
      <div className="flex items-center gap-1">
        <span className="font-mono">{value}</span>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-5 w-5" 
          onClick={() => copyToClipboard(value)}
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  const renderCredentialGroup = (title: string, cred: any) => (
    <div className="p-2 border rounded-md bg-background">
      <div className="font-medium text-xs mb-1">{title}</div>
      {renderCredentialItem('Email', cred.email)}
      {renderCredentialItem('Password', cred.password)}
    </div>
  );

  return (
    <div className="space-y-2 text-sm">
      {renderCredentialGroup('Individual User', credentials.individual)}
      {renderCredentialGroup('Establishment', credentials.establishment)}
      {renderCredentialGroup('Promoter', credentials.promoter)}
      {renderCredentialGroup('Admin', credentials.admin)}
    </div>
  );
};

export default TestCredentialsList;
