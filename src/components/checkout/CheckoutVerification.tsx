
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface CheckoutVerificationProps {
  onBack: () => void;
  onComplete: () => void;
}

const CheckoutVerification: React.FC<CheckoutVerificationProps> = ({
  onBack,
  onComplete
}) => {
  const [captchaValue, setCaptchaValue] = React.useState<string | null>(null);

  const handleCaptchaChange = (value: string | null) => {
    setCaptchaValue(value);
  };

  return (
    <div className="space-y-6">
      <h3 className="font-medium">Order Verification</h3>
      <p className="text-sm text-muted-foreground">
        Please review your order details and complete the verification below.
      </p>
      
      <div className="space-y-4">
        <div className="border p-4 rounded-md">
          <div className="text-center">
            <p>Verification Placeholder</p>
            <p className="text-xs text-muted-foreground mt-1">
              (Actual captcha implementation would go here)
            </p>
          </div>
        </div>
        
        {!captchaValue && (
          <div className="text-destructive flex items-center text-sm">
            <AlertCircle className="h-4 w-4 mr-1" />
            Please complete the verification step
          </div>
        )}
      </div>
      
      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={onComplete} disabled={!captchaValue}>
          Complete Order
        </Button>
      </div>
    </div>
  );
};

export default CheckoutVerification;
