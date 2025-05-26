
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Calendar, CreditCard, DollarSign } from 'lucide-react';

interface InstallmentOption {
  id: string;
  periods: number;
  monthlyAmount: number;
  totalAmount: number;
  interestRate: number;
  description: string;
}

interface PaymentInstallmentsProps {
  totalAmount: number;
  minimumInstallmentAmount?: number;
  onInstallmentSelected: (installment: InstallmentOption | null) => void;
  selectedInstallment?: InstallmentOption | null;
}

const PaymentInstallments: React.FC<PaymentInstallmentsProps> = ({
  totalAmount,
  minimumInstallmentAmount = 100,
  onInstallmentSelected,
  selectedInstallment
}) => {
  const [selectedOption, setSelectedOption] = useState<string>(
    selectedInstallment?.id || 'full'
  );

  // Calculate installment options
  const generateInstallmentOptions = (): InstallmentOption[] => {
    const options: InstallmentOption[] = [];
    
    // Only offer installments if amount is above minimum
    if (totalAmount < minimumInstallmentAmount) {
      return options;
    }

    // 3-month installment (2% interest)
    if (totalAmount >= 300) {
      const interestRate = 0.02;
      const totalWithInterest = totalAmount * (1 + interestRate);
      options.push({
        id: '3-month',
        periods: 3,
        monthlyAmount: totalWithInterest / 3,
        totalAmount: totalWithInterest,
        interestRate: interestRate * 100,
        description: '3 monthly payments'
      });
    }

    // 6-month installment (4% interest)
    if (totalAmount >= 600) {
      const interestRate = 0.04;
      const totalWithInterest = totalAmount * (1 + interestRate);
      options.push({
        id: '6-month',
        periods: 6,
        monthlyAmount: totalWithInterest / 6,
        totalAmount: totalWithInterest,
        interestRate: interestRate * 100,
        description: '6 monthly payments'
      });
    }

    // 12-month installment (8% interest)
    if (totalAmount >= 1200) {
      const interestRate = 0.08;
      const totalWithInterest = totalAmount * (1 + interestRate);
      options.push({
        id: '12-month',
        periods: 12,
        monthlyAmount: totalWithInterest / 12,
        totalAmount: totalWithInterest,
        interestRate: interestRate * 100,
        description: '12 monthly payments'
      });
    }

    return options;
  };

  const installmentOptions = generateInstallmentOptions();

  const handleOptionChange = (value: string) => {
    setSelectedOption(value);
    
    if (value === 'full') {
      onInstallmentSelected(null);
    } else {
      const option = installmentOptions.find(opt => opt.id === value);
      onInstallmentSelected(option || null);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  if (installmentOptions.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">
            <CreditCard className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Installment payments not available for this amount</p>
            <p className="text-sm">Minimum ${minimumInstallmentAmount} required</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Payment Options
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedOption} onValueChange={handleOptionChange}>
          {/* Full Payment Option */}
          <div className="flex items-center space-x-2 p-4 border rounded-lg">
            <RadioGroupItem value="full" id="full" />
            <Label htmlFor="full" className="flex-1 cursor-pointer">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">Pay in Full</div>
                  <div className="text-sm text-gray-600">One-time payment</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-lg">{formatCurrency(totalAmount)}</div>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Save on fees
                  </Badge>
                </div>
              </div>
            </Label>
          </div>

          {/* Installment Options */}
          {installmentOptions.map((option) => (
            <div key={option.id} className="flex items-center space-x-2 p-4 border rounded-lg">
              <RadioGroupItem value={option.id} id={option.id} />
              <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium">{option.description}</div>
                    <div className="text-sm text-gray-600">
                      {formatCurrency(option.monthlyAmount)}/month
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(option.totalAmount)}</div>
                    <div className="text-sm text-orange-600">
                      +{formatCurrency(option.totalAmount - totalAmount)} fee ({option.interestRate}%)
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>

        {selectedInstallment && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-2">
              <DollarSign className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <div className="font-medium text-blue-900">Installment Details</div>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>First payment: {formatCurrency(selectedInstallment.monthlyAmount)} (today)</p>
                  <p>Remaining payments: {selectedInstallment.periods - 1} monthly payments of {formatCurrency(selectedInstallment.monthlyAmount)}</p>
                  <p>Total amount: {formatCurrency(selectedInstallment.totalAmount)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 text-xs text-gray-500">
          * Installment payments are processed automatically each month. You can cancel or modify your plan at any time.
        </div>
      </CardContent>
    </Card>
  );
};

export default PaymentInstallments;
