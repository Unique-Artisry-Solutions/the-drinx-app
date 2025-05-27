
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ReferralService } from '@/services/promotional';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { 
  Share2, 
  Copy, 
  Facebook, 
  Twitter, 
  MessageCircle,
  Mail,
  QrCode
} from 'lucide-react';

export const SocialShareWidget: React.FC = () => {
  const { user } = useAuth();
  const [referralCode, setReferralCode] = useState<string>('');
  const [referralUrl, setReferralUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    generateReferralCode();
  }, [user?.id]);

  const generateReferralCode = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      
      // Generate a unique referral code
      const code = ReferralService.generateReferralCode();
      setReferralCode(code);
      
      // Create the referral URL
      const baseUrl = window.location.origin;
      const url = `${baseUrl}?ref=${code}`;
      setReferralUrl(url);
      
    } catch (error) {
      console.error('Failed to generate referral code:', error);
      toast.error('Failed to generate referral code');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const shareToSocial = (platform: string) => {
    const message = `Check out this amazing app! Join using my referral code and we both get rewards: ${referralUrl}`;
    
    let url = '';
    
    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        break;
      case 'whatsapp':
        url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        break;
      case 'email':
        url = `mailto:?subject=Join me on this amazing app&body=${encodeURIComponent(message)}`;
        break;
      default:
        return;
    }
    
    window.open(url, '_blank', 'width=600,height=400');
  };

  const shareMessages = [
    "🎉 Join me on this amazing app and let's both earn rewards!",
    "💰 Use my referral code to get bonus points when you sign up!",
    "🚀 Discover amazing events and earn rewards - use my referral link!",
    "✨ Join the fun and earn points from day one with my referral code!"
  ];

  if (isLoading) {
    return <div className="p-4">Generating your referral code...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="h-5 w-5" />
          Share & Earn Rewards
        </CardTitle>
        <p className="text-sm text-gray-600">
          Share your referral code with friends and earn points when they join!
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Referral Code Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Referral Code</label>
          <div className="flex gap-2">
            <Input
              value={referralCode}
              readOnly
              className="font-mono"
            />
            <Button
              variant="outline"
              onClick={() => copyToClipboard(referralCode, 'Referral code')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Referral URL Section */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Referral Link</label>
          <div className="flex gap-2">
            <Input
              value={referralUrl}
              readOnly
              className="text-sm"
            />
            <Button
              variant="outline"
              onClick={() => copyToClipboard(referralUrl, 'Referral link')}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Social Sharing Buttons */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Quick Share</label>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              onClick={() => shareToSocial('facebook')}
              className="flex items-center gap-2"
            >
              <Facebook className="h-4 w-4 text-blue-600" />
              Facebook
            </Button>
            <Button
              variant="outline"
              onClick={() => shareToSocial('twitter')}
              className="flex items-center gap-2"
            >
              <Twitter className="h-4 w-4 text-blue-400" />
              Twitter
            </Button>
            <Button
              variant="outline"
              onClick={() => shareToSocial('whatsapp')}
              className="flex items-center gap-2"
            >
              <MessageCircle className="h-4 w-4 text-green-500" />
              WhatsApp
            </Button>
            <Button
              variant="outline"
              onClick={() => shareToSocial('email')}
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4 text-gray-600" />
              Email
            </Button>
          </div>
        </div>

        {/* Pre-written Messages */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Ready-to-share Messages</label>
          <div className="space-y-2">
            {shareMessages.map((message, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1 text-sm">{message}</div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(`${message} ${referralUrl}`, 'Message')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Generate New Code */}
        <div className="pt-4 border-t">
          <Button
            variant="outline"
            onClick={generateReferralCode}
            disabled={isLoading}
            className="w-full"
          >
            Generate New Referral Code
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
