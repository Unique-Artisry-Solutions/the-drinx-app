
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Key, Copy, Check, AlertTriangle } from 'lucide-react';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface VAPIDKeys {
  publicKey: string;
  privateKey: string;
  mailto: string;
}

const VAPIDKeyManager = () => {
  const [keys, setKeys] = useState<VAPIDKeys>({
    publicKey: '',
    privateKey: '',
    mailto: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const [showInstructions, setShowInstructions] = useState(false);

  const handleInputChange = (field: keyof VAPIDKeys) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeys(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleGenerateKeys = async () => {
    try {
      setIsGenerating(true);
      const { data, error } = await supabase.functions.invoke('generate-vapid-keys');
      
      if (error) throw error;

      setKeys(prev => ({
        ...prev,
        publicKey: data.publicKey,
        privateKey: data.privateKey
      }));

      toast({
        title: "Success",
        description: "VAPID keys generated successfully",
      });
    } catch (error) {
      console.error('Error generating VAPID keys:', error);
      toast({
        title: "Error",
        description: "Failed to generate VAPID keys",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveKeys = async () => {
    if (!keys.publicKey || !keys.privateKey || !keys.mailto) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSaving(true);

      // Call the edge function
      const { data, error } = await supabase.functions.invoke('notifications', {
        body: {
          action: 'saveVapidKeys',
          params: {
            publicKey: keys.publicKey,
            privateKey: keys.privateKey,
            mailto: keys.mailto
          }
        }
      });

      if (error) throw error;

      setShowInstructions(true);
      
      toast({
        title: "Keys Generated Successfully",
        description: "Please add these keys to your Supabase secrets",
      });
    } catch (error) {
      console.error('Error saving VAPID keys:', error);
      toast({
        title: "Error",
        description: "Failed to save VAPID keys",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async (text: string, label: string) => {
    await navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: `${label} has been copied to clipboard`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>VAPID Key Configuration</CardTitle>
        <CardDescription>
          Configure VAPID keys for push notifications. Generate new keys or enter existing ones.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showInstructions && (
          <Alert className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Important: Manual Setup Required</AlertTitle>
            <AlertDescription>
              <p className="mb-2">
                You need to manually add these VAPID keys to your Supabase project secrets:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>VAPID_PUBLIC_KEY</strong>: {keys.publicKey}</li>
                <li><strong>VAPID_PRIVATE_KEY</strong>: {keys.privateKey}</li>
                <li><strong>VAPID_MAILTO</strong>: {keys.mailto}</li>
              </ul>
              <p className="mt-2">
                Add these in your Supabase dashboard under Settings &gt; API &gt; Project Secrets.
              </p>
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Public Key</label>
            <div className="flex gap-2">
              <Input
                value={keys.publicKey}
                onChange={handleInputChange('publicKey')}
                placeholder="Enter VAPID public key"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(keys.publicKey, 'Public Key')}
                disabled={!keys.publicKey}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Private Key</label>
            <div className="flex gap-2">
              <Input
                value={keys.privateKey}
                onChange={handleInputChange('privateKey')}
                placeholder="Enter VAPID private key"
                type="password"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopy(keys.privateKey, 'Private Key')}
                disabled={!keys.privateKey}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Contact Email (mailto)</label>
            <Input
              value={keys.mailto}
              onChange={handleInputChange('mailto')}
              placeholder="Enter contact email for VAPID"
              type="email"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Button 
            onClick={handleGenerateKeys} 
            disabled={isGenerating}
            className="flex gap-2"
          >
            <Key className="h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate New Keys'}
          </Button>
          <Button 
            onClick={handleSaveKeys} 
            disabled={isSaving || !keys.publicKey || !keys.privateKey || !keys.mailto}
            className="flex gap-2"
          >
            <Check className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Generate Keys & Show Instructions'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default VAPIDKeyManager;
