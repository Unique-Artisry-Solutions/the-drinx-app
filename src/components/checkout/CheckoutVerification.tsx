
import React from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { AlertCircle } from 'lucide-react';

interface CheckoutVerificationProps {
  captchaValue: string | null;
  handleCaptchaChange: (value: string | null) => void;
}

const CheckoutVerification: React.FC<CheckoutVerificationProps> = ({
  captchaValue,
  handleCaptchaChange
}) => {
  return (
    <div className="pt-4">
      <h3 className="font-medium mb-2">Verification</h3>
      <div className="flex justify-center my-4">
        <ReCAPTCHA
          sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" // This is Google's test key
          onChange={handleCaptchaChange}
        />
      </div>
      {!captchaValue && (
        <div className="text-destructive flex items-center text-sm mt-2">
          <AlertCircle className="h-4 w-4 mr-1" />
          Please complete the CAPTCHA verification
        </div>
      )}
    </div>
  );
};

export default CheckoutVerification;
