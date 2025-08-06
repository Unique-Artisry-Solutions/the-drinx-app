import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Plus, Trash2 } from 'lucide-react';
import { useDebouncedToast } from '@/hooks/useDebouncedToast';

const ServiceFeeTestComponent: React.FC = () => {
  const { 
    items, 
    addItem, 
    removeItem, 
    clearCart, 
    totalPrice, 
    serviceFee, 
    serviceFeePercentage, 
    totalWithFees 
  } = useCart();
  
  const [testItemPrice, setTestItemPrice] = useState('10.00');
  const { showSuccess, showInfo } = useDebouncedToast();

  const addTestItem = () => {
    const price = parseFloat(testItemPrice);
    if (isNaN(price) || price <= 0) {
      return;
    }

    const testItem = {
      id: `test-${Date.now()}`,
      name: `Test Item ($${price})`,
      price: price,
      interval: 'one-time' as const,
      type: 'event_ticket' as const,
      quantity: 1
    };

    addItem(testItem);
    showSuccess('Item Added', `Added test item for $${price}`);
  };

  const runServiceFeeTest = () => {
    // Clear cart and add known test items
    clearCart();
    
    setTimeout(() => {
      const testItems = [
        { id: 'test-1', name: 'Test Event Ticket', price: 25.00, interval: 'one-time' as const, type: 'event_ticket' as const },
        { id: 'test-2', name: 'Test User Plan', price: 9.99, interval: 'monthly' as const, type: 'user' as const }
      ];

      testItems.forEach(item => addItem(item));
      
      showInfo('Test Started', 'Added test items to verify service fee calculation');
    }, 100);
  };

  const expectedServiceFee = (totalPrice * (serviceFeePercentage / 100));
  const calculationMatch = Math.abs(serviceFee - expectedServiceFee) < 0.01;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShoppingCart className="h-5 w-5" />
          Service Fee Testing Component
        </CardTitle>
        <CardDescription>
          Test the end-to-end service fee calculation and validation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Service Fee Configuration */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">Current Configuration</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Service Fee Percentage:</span>
              <Badge variant="secondary" className="ml-2">{serviceFeePercentage}%</Badge>
            </div>
            <div>
              <span className="text-blue-700">Calculation:</span>
              <span className="ml-2 font-mono">{serviceFeePercentage}% of subtotal</span>
            </div>
          </div>
        </div>

        {/* Add Test Item */}
        <div className="space-y-3">
          <h3 className="font-semibold">Add Test Item</h3>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="testPrice">Price ($)</Label>
              <Input
                id="testPrice"
                type="number"
                step="0.01"
                min="0"
                value={testItemPrice}
                onChange={(e) => setTestItemPrice(e.target.value)}
                placeholder="Enter test price"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addTestItem} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Item
              </Button>
            </div>
          </div>
        </div>

        {/* Quick Test Button */}
        <div className="space-y-2">
          <Button onClick={runServiceFeeTest} variant="outline" className="w-full">
            Run Quick Service Fee Test
          </Button>
          <p className="text-xs text-muted-foreground text-center">
            Adds predefined test items to verify calculations
          </p>
        </div>

        {/* Cart Summary */}
        <div className="border rounded-lg p-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Cart Summary</h3>
            {items.length > 0 && (
              <Button 
                onClick={clearCart} 
                variant="outline" 
                size="sm" 
                className="gap-1 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3 w-3" />
                Clear
              </Button>
            )}
          </div>

          {items.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No items in cart</p>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <div className="text-sm text-muted-foreground">
                        {item.type} • {item.interval}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono">${item.price.toFixed(2)}</span>
                      <Button 
                        onClick={() => removeItem(item.id)} 
                        variant="ghost" 
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculation Breakdown */}
              <div className="border-t pt-3 space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span className="font-mono">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service Fee ({serviceFeePercentage}%):</span>
                  <span className="font-mono">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold border-t pt-1">
                  <span>Total:</span>
                  <span className="font-mono">${totalWithFees.toFixed(2)}</span>
                </div>
              </div>

              {/* Validation Check */}
              <div className={`p-2 rounded text-sm ${calculationMatch ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                <div className="font-medium">
                  {calculationMatch ? '✓ Calculation Correct' : '✗ Calculation Error'}
                </div>
                <div className="text-xs mt-1">
                  Expected: ${expectedServiceFee.toFixed(2)} | Actual: ${serviceFee.toFixed(2)}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceFeeTestComponent;