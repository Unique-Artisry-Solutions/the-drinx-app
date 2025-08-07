import React, { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  AlertTriangle, 
  CreditCard, 
  RefreshCw, 
  ChevronDown,
  Shield,
  Phone,
  Info
} from 'lucide-react';
import { PaymentError, PaymentRecoveryAction, PaymentErrorType } from '@/types/PaymentErrors';
import { cn } from '@/lib/utils';

interface PaymentErrorDisplayProps {
  error: PaymentError;
  onRetry?: () => void;
  onUpdateCard?: () => void;
  onContactSupport?: () => void;
  className?: string;
  showDetails?: boolean;
}

const PaymentErrorDisplay: React.FC<PaymentErrorDisplayProps> = ({
  error,
  onRetry,
  onUpdateCard,
  onContactSupport,
  className = '',
  showDetails = false
}) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(showDetails);

  const getErrorIcon = () => {
    switch (error.type) {
      case PaymentErrorType.CARD:
        return <CreditCard className="h-5 w-5" />;
      case PaymentErrorType.AUTHENTICATION:
        return <Shield className="h-5 w-5" />;
      case PaymentErrorType.NETWORK:
        return <RefreshCw className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getErrorVariant = () => {
    switch (error.type) {
      case PaymentErrorType.VALIDATION:
        return 'default';
      case PaymentErrorType.CARD:
      case PaymentErrorType.AUTHENTICATION:
        return 'destructive';
      case PaymentErrorType.NETWORK:
        return 'default';
      default:
        return 'destructive';
    }
  };

  const renderRecoveryAction = () => {
    switch (error.recoveryAction) {
      case PaymentRecoveryAction.RETRY:
        return onRetry ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRetry}
            className="mt-3"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        ) : null;

      case PaymentRecoveryAction.UPDATE_CARD:
        return onUpdateCard ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onUpdateCard}
            className="mt-3"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Update Payment Method
          </Button>
        ) : null;

      case PaymentRecoveryAction.CONTACT_SUPPORT:
        return onContactSupport ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onContactSupport}
            className="mt-3"
          >
            <Phone className="h-4 w-4 mr-2" />
            Contact Support
          </Button>
        ) : null;

      case PaymentRecoveryAction.TRY_DIFFERENT_METHOD:
        return onUpdateCard ? (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onUpdateCard}
            className="mt-3"
          >
            <CreditCard className="h-4 w-4 mr-2" />
            Try Different Payment Method
          </Button>
        ) : null;

      case PaymentRecoveryAction.LOGIN_REQUIRED:
        return (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => window.location.href = '/login'}
            className="mt-3"
          >
            <Shield className="h-4 w-4 mr-2" />
            Log In
          </Button>
        );

      default:
        return null;
    }
  };

  const getSeverityStyles = () => {
    switch (error.type) {
      case PaymentErrorType.VALIDATION:
        return 'border-warning bg-warning/5';
      case PaymentErrorType.NETWORK:
        return 'border-info bg-info/5';
      default:
        return 'border-destructive bg-destructive/5';
    }
  };

  return (
    <Card className={cn('border-l-4', getSeverityStyles(), className)}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5">
            {getErrorIcon()}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="font-medium text-foreground">
              Payment Error
            </div>
            
            <div className="text-sm text-muted-foreground">
              {error.message}
            </div>

            {error.details && (
              <Collapsible open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-auto p-0 text-sm">
                    <Info className="h-3 w-3 mr-1" />
                    View Details
                    <ChevronDown className={cn(
                      "h-3 w-3 ml-1 transition-transform",
                      isDetailsOpen && "rotate-180"
                    )} />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded border">
                    {error.details}
                    {error.context && (
                      <div className="mt-2 pt-2 border-t border-border">
                        <div className="font-mono text-xs">
                          Error Code: {error.code}
                        </div>
                        {error.context.timestamp && (
                          <div className="font-mono text-xs">
                            Time: {new Date(error.context.timestamp).toLocaleString()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            )}

            {renderRecoveryAction()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentErrorDisplay;