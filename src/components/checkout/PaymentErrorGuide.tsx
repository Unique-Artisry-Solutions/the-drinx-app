import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CreditCard, 
  Wifi, 
  Shield, 
  Phone, 
  CheckCircle,
  AlertTriangle,
  Info,
  RefreshCw
} from 'lucide-react';
import { PaymentError, PaymentErrorType } from '@/types/PaymentErrors';

interface PaymentErrorGuideProps {
  error?: PaymentError;
  onTryAgain?: () => void;
  onContactSupport?: () => void;
  className?: string;
}

const PaymentErrorGuide: React.FC<PaymentErrorGuideProps> = ({
  error,
  onTryAgain,
  onContactSupport,
  className = ''
}) => {
  const [activeTab, setActiveTab] = useState(
    error?.type || PaymentErrorType.CARD
  );

  const troubleshootingSteps = {
    [PaymentErrorType.CARD]: [
      {
        icon: <CreditCard className="h-5 w-5" />,
        title: "Check Card Details",
        description: "Verify your card number, expiry date, and security code are correct",
        action: "Double-check all entered information"
      },
      {
        icon: <CheckCircle className="h-5 w-5" />,
        title: "Try Another Card",
        description: "Use a different payment method if available",
        action: "Select a different card or payment method"
      },
      {
        icon: <Phone className="h-5 w-5" />,
        title: "Contact Your Bank",
        description: "Your bank may be blocking the transaction",
        action: "Call the number on the back of your card"
      }
    ],
    [PaymentErrorType.NETWORK]: [
      {
        icon: <Wifi className="h-5 w-5" />,
        title: "Check Internet Connection",
        description: "Ensure you have a stable internet connection",
        action: "Try refreshing the page or reconnecting to WiFi"
      },
      {
        icon: <RefreshCw className="h-5 w-5" />,
        title: "Retry Payment",
        description: "Network issues are often temporary",
        action: "Wait a moment and try again"
      }
    ],
    [PaymentErrorType.AUTHENTICATION]: [
      {
        icon: <Shield className="h-5 w-5" />,
        title: "Log In Again",
        description: "Your session may have expired",
        action: "Sign out and log back in"
      },
      {
        icon: <CheckCircle className="h-5 w-5" />,
        title: "Verify Account",
        description: "Make sure your account is in good standing",
        action: "Check your account status"
      }
    ],
    [PaymentErrorType.SYSTEM]: [
      {
        icon: <AlertTriangle className="h-5 w-5" />,
        title: "System Maintenance",
        description: "Our payment system may be temporarily unavailable",
        action: "Please try again in a few minutes"
      },
      {
        icon: <Phone className="h-5 w-5" />,
        title: "Contact Support",
        description: "If the problem persists, we're here to help",
        action: "Reach out to our support team"
      }
    ],
    [PaymentErrorType.VALIDATION]: [
      {
        icon: <Info className="h-5 w-5" />,
        title: "Check Payment Amount",
        description: "Verify the payment amount meets requirements",
        action: "Ensure amount is within allowed limits"
      },
      {
        icon: <CreditCard className="h-5 w-5" />,
        title: "Verify Payment Method",
        description: "Make sure all required fields are filled correctly",
        action: "Review and correct any highlighted fields"
      }
    ]
  };

  const commonSolutions = [
    {
      title: "Clear Browser Cache",
      description: "Sometimes cached data can cause payment issues",
      steps: ["Go to browser settings", "Clear browsing data", "Restart browser", "Try payment again"]
    },
    {
      title: "Disable Ad Blockers",
      description: "Ad blockers can interfere with payment processing",
      steps: ["Temporarily disable ad blockers", "Refresh the page", "Complete your payment", "Re-enable ad blockers"]
    },
    {
      title: "Use Incognito Mode",
      description: "Try making the payment in a private browsing window",
      steps: ["Open incognito/private window", "Navigate to payment page", "Complete payment", "Close incognito window"]
    }
  ];

  const getCurrentSteps = () => {
    if (error?.type && troubleshootingSteps[error.type]) {
      return troubleshootingSteps[error.type];
    }
    return troubleshootingSteps[PaymentErrorType.CARD];
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          <span>Payment Troubleshooting Guide</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as PaymentErrorType)}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value={PaymentErrorType.CARD}>Card Issues</TabsTrigger>
            <TabsTrigger value={PaymentErrorType.NETWORK}>Network</TabsTrigger>
            <TabsTrigger value={PaymentErrorType.AUTHENTICATION}>Account</TabsTrigger>
            <TabsTrigger value={PaymentErrorType.SYSTEM}>System</TabsTrigger>
          </TabsList>

          {Object.entries(troubleshootingSteps).map(([errorType, steps]) => (
            <TabsContent key={errorType} value={errorType} className="space-y-4">
              {error?.type === errorType && (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Current Issue:</strong> {error.message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg">
                    <div className="text-primary mt-1">
                      {step.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      <p className="text-sm font-medium text-primary mt-1">{step.action}</p>
                    </div>
                  </div>
                ))}
              </div>

              {(errorType === PaymentErrorType.NETWORK || error?.retryable) && onTryAgain && (
                <Button onClick={onTryAgain} className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              )}
            </TabsContent>
          ))}

          <TabsContent value="general" className="space-y-4">
            <h3 className="font-medium">Common Solutions</h3>
            <div className="space-y-4">
              {commonSolutions.map((solution, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <h4 className="font-medium">{solution.title}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{solution.description}</p>
                  <ol className="text-sm space-y-1">
                    {solution.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex">
                        <span className="mr-2 text-primary">{stepIndex + 1}.</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {onContactSupport && (
          <div className="mt-6 pt-4 border-t">
            <Button variant="outline" onClick={onContactSupport} className="w-full">
              <Phone className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentErrorGuide;