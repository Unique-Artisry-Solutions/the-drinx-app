
import React, { useState } from 'react';
import { useEventWizard } from './EventWizardContext';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Trash, Plus, Tag, Clock, BadgePercent } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { formatCurrency } from '@/utils/formatters';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PricingTier {
  name: string;
  startDate?: string;
  endDate?: string;
  priceAdjustment: number;
  adjustmentType: 'percentage' | 'fixed';
}

const TicketingStep: React.FC = () => {
  const {
    formData,
    updateFormData
  } = useEventWizard();
  
  const [showAdvancedPricing, setShowAdvancedPricing] = useState(false);
  const [enableDiscounts, setEnableDiscounts] = useState(false);
  const [showInventorySettings, setShowInventorySettings] = useState(false);
  
  // State for advanced pricing tiers
  const [pricingTiers, setPricingTiers] = useState<PricingTier[]>([
    {
      name: "Early Bird",
      endDate: "",
      priceAdjustment: 20,
      adjustmentType: "percentage"
    }
  ]);
  
  const handleTicketChange = (index: number, field: string, value: string | number | boolean) => {
    const updatedTickets = [...(formData.ticketTypes || [])];
    
    // Handle inventory management fields specially
    if (field === 'enableLimitedInventory') {
      updatedTickets[index] = {
        ...updatedTickets[index],
        hasLimitedInventory: value as boolean,
      };
    } else if (field === 'enableDynamicPricing') {
      updatedTickets[index] = {
        ...updatedTickets[index],
        hasDynamicPricing: value as boolean,
      };
    } else {
      updatedTickets[index] = {
        ...updatedTickets[index],
        [field]: field === 'price' || field === 'quantity' ? Number(value) : value
      };
    }
    
    updateFormData({
      ticketTypes: updatedTickets
    });
  };
  
  const addTicketType = () => {
    const newTicket = {
      name: `Ticket Type ${(formData.ticketTypes || []).length + 1}`,
      price: 0,
      description: '',
      quantity: 50,
      hasLimitedInventory: false,
      hasDynamicPricing: false
    };
    updateFormData({
      ticketTypes: [...(formData.ticketTypes || []), newTicket]
    });
  };
  
  const removeTicketType = (index: number) => {
    const updatedTickets = (formData.ticketTypes || []).filter((_, i) => i !== index);
    updateFormData({
      ticketTypes: updatedTickets
    });
  };
  
  const handlePricingTierChange = (index: number, field: string, value: string | number) => {
    const updatedTiers = [...pricingTiers];
    updatedTiers[index] = {
      ...updatedTiers[index],
      [field]: field === 'priceAdjustment' ? Number(value) : value
    };
    setPricingTiers(updatedTiers);
  };
  
  const addPricingTier = () => {
    setPricingTiers([
      ...pricingTiers, 
      {
        name: `Tier ${pricingTiers.length + 1}`,
        priceAdjustment: 10,
        adjustmentType: 'percentage'
      }
    ]);
  };
  
  const removePricingTier = (index: number) => {
    setPricingTiers(pricingTiers.filter((_, i) => i !== index));
  };
  
  // Calculate the adjusted price based on pricing tier
  const calculateAdjustedPrice = (basePrice: number, tier: PricingTier): number => {
    if (tier.adjustmentType === 'percentage') {
      return basePrice * (1 - (tier.priceAdjustment / 100));
    } else {
      return Math.max(0, basePrice - tier.priceAdjustment);
    }
  };
  
  return (
    <Card className="shadow-md">
      <CardContent className="pt-6 my-px">
        <div className="space-y-6">
          <div className="flex items-center justify-between my-[20px]">
            <h3 className="text-lg font-medium">Ticket Types</h3>
            <Button onClick={addTicketType} variant="outline" size="sm" className="text-purple-600 border-purple-600 hover:bg-purple-50">
              <Plus className="h-4 w-4 mr-2" />
              Add Ticket Type
            </Button>
          </div>

          {/* Advanced Settings Controls */}
          <div className="flex flex-wrap gap-4 pb-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="advanced-pricing"
                checked={showAdvancedPricing}
                onCheckedChange={setShowAdvancedPricing}
              />
              <Label htmlFor="advanced-pricing">Advanced Pricing Options</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="enable-discounts" 
                checked={enableDiscounts}
                onCheckedChange={setEnableDiscounts}
              />
              <Label htmlFor="enable-discounts">Enable Discount Codes</Label>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="inventory-settings"
                checked={showInventorySettings}
                onCheckedChange={setShowInventorySettings} 
              />
              <Label htmlFor="inventory-settings">Inventory Management</Label>
            </div>
          </div>

          {/* Advanced Pricing Section */}
          {showAdvancedPricing && (
            <Card className="bg-gray-50 border-dashed">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium flex items-center">
                    <Tag className="h-4 w-4 mr-2" />
                    Advanced Pricing Tiers
                  </h4>
                  <Button 
                    onClick={addPricingTier} 
                    variant="outline" 
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tier
                  </Button>
                </div>
                
                <div className="text-sm text-gray-500 mb-4">
                  Configure time-based pricing tiers like Early Bird, Standard, and Last-Minute pricing.
                </div>
                
                {pricingTiers.map((tier, tierIndex) => (
                  <div key={tierIndex} className="mb-4 p-3 bg-white rounded-md border">
                    <div className="flex justify-between items-center mb-2">
                      <Label>{tier.name}</Label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePricingTier(tierIndex)}
                        disabled={pricingTiers.length === 1}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <Label className="text-xs" htmlFor={`tier-name-${tierIndex}`}>Tier Name</Label>
                        <Input
                          id={`tier-name-${tierIndex}`}
                          value={tier.name}
                          onChange={(e) => handlePricingTierChange(tierIndex, 'name', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs" htmlFor={`adjustment-type-${tierIndex}`}>Discount Type</Label>
                        <select
                          id={`adjustment-type-${tierIndex}`}
                          value={tier.adjustmentType}
                          onChange={(e) => handlePricingTierChange(tierIndex, 'adjustmentType', e.target.value)}
                          className="w-full h-8 text-sm rounded-md border border-input bg-white px-3"
                        >
                          <option value="percentage">Percentage Off</option>
                          <option value="fixed">Fixed Amount Off</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <Label className="text-xs" htmlFor={`adjustment-${tierIndex}`}>
                          {tier.adjustmentType === 'percentage' ? 'Percentage Off (%)' : 'Amount Off ($)'}
                        </Label>
                        <Input
                          id={`adjustment-${tierIndex}`}
                          type="number"
                          min="0"
                          step={tier.adjustmentType === 'percentage' ? '1' : '0.01'}
                          value={tier.priceAdjustment}
                          onChange={(e) => handlePricingTierChange(tierIndex, 'priceAdjustment', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs" htmlFor={`end-date-${tierIndex}`}>Available Until</Label>
                        <Input
                          id={`end-date-${tierIndex}`}
                          type="date"
                          value={tier.endDate || ''}
                          onChange={(e) => handlePricingTierChange(tierIndex, 'endDate', e.target.value)}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                    
                    {formData.ticketTypes && formData.ticketTypes.length > 0 && (
                      <div className="mt-2 p-2 bg-gray-50 rounded-md text-xs">
                        <div className="font-medium mb-1">Price Preview:</div>
                        {formData.ticketTypes.map((ticket, i) => (
                          <div key={i} className="flex justify-between">
                            <span>{ticket.name}:</span>
                            <span>
                              <span className="line-through text-gray-400 mr-2">
                                {formatCurrency(ticket.price)}
                              </span>
                              {formatCurrency(calculateAdjustedPrice(ticket.price, tier))}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
          
          {/* Discount Codes Section */}
          {enableDiscounts && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-sm flex flex-col">
                <span className="font-medium mb-1">Discount Code Management</span>
                <span className="text-amber-700">
                  After creating your event, you'll be able to generate and manage discount codes 
                  from the event details page.
                </span>
              </AlertDescription>
            </Alert>
          )}

          {(formData.ticketTypes || []).map((ticket, index) => (
            <div key={index} className="p-4 border rounded-md space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">Ticket Type {index + 1}</h4>
                {(formData.ticketTypes || []).length > 1 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => removeTicketType(index)} 
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor={`ticket-name-${index}`}>Name</Label>
                <Input 
                  id={`ticket-name-${index}`} 
                  value={ticket.name} 
                  onChange={e => handleTicketChange(index, 'name', e.target.value)} 
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`ticket-price-${index}`}>Base Price ($)</Label>
                  <Input 
                    id={`ticket-price-${index}`} 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    value={ticket.price} 
                    onChange={e => handleTicketChange(index, 'price', e.target.value)} 
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor={`ticket-quantity-${index}`}>Quantity Available</Label>
                  <Input 
                    id={`ticket-quantity-${index}`} 
                    type="number" 
                    min="1" 
                    value={ticket.quantity} 
                    onChange={e => handleTicketChange(index, 'quantity', e.target.value)} 
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor={`ticket-description-${index}`}>Description</Label>
                <Textarea 
                  id={`ticket-description-${index}`} 
                  value={ticket.description} 
                  onChange={e => handleTicketChange(index, 'description', e.target.value)} 
                  placeholder="What does this ticket include?" 
                  rows={2} 
                />
              </div>
              
              {/* Inventory Management Settings */}
              {showInventorySettings && (
                <Accordion type="single" collapsible className="bg-gray-50 rounded-md">
                  <AccordionItem value="inventory">
                    <AccordionTrigger className="px-4 py-2 text-sm">
                      Inventory Management Options
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-1">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`limited-inventory-${index}`} className="text-sm flex-1">
                            Enable limited inventory
                          </Label>
                          <Switch
                            id={`limited-inventory-${index}`}
                            checked={!!ticket.hasLimitedInventory}
                            onCheckedChange={(checked) => 
                              handleTicketChange(index, 'enableLimitedInventory', checked)
                            }
                          />
                        </div>
                        
                        {ticket.hasLimitedInventory && (
                          <div className="grid gap-2">
                            <Label htmlFor={`inventory-threshold-${index}`} className="text-xs">
                              Low inventory alert threshold
                            </Label>
                            <Input
                              id={`inventory-threshold-${index}`}
                              type="number"
                              min="1"
                              value={ticket.lowInventoryThreshold || 5}
                              onChange={e => handleTicketChange(index, 'lowInventoryThreshold', e.target.value)}
                              className="h-8 text-sm"
                            />
                            <p className="text-xs text-gray-500">
                              You'll be alerted when tickets fall below this number
                            </p>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between mt-2">
                          <Label htmlFor={`dynamic-pricing-${index}`} className="text-sm flex-1">
                            Enable dynamic pricing
                          </Label>
                          <Switch
                            id={`dynamic-pricing-${index}`}
                            checked={!!ticket.hasDynamicPricing}
                            onCheckedChange={(checked) => 
                              handleTicketChange(index, 'enableDynamicPricing', checked)
                            }
                          />
                        </div>
                        
                        {ticket.hasDynamicPricing && (
                          <Alert className="bg-blue-50 border-blue-200 py-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <AlertDescription className="text-xs text-blue-700">
                              Dynamic pricing will automatically adjust based on inventory levels.
                              Configure rules in the event settings after creation.
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              )}
              
              {/* Show Advanced Pricing Preview if enabled */}
              {showAdvancedPricing && pricingTiers.length > 0 && (
                <div className="mt-2 p-3 bg-gray-50 rounded-md border border-dashed">
                  <h5 className="font-medium text-sm flex items-center mb-2">
                    <BadgePercent className="h-4 w-4 mr-1" />
                    Pricing Tiers for {ticket.name}
                  </h5>
                  <div className="grid gap-1">
                    {pricingTiers.map((tier, tierIdx) => (
                      <div key={tierIdx} className="flex justify-between text-sm">
                        <span>{tier.name}:</span>
                        <span className="font-medium">
                          {formatCurrency(calculateAdjustedPrice(ticket.price, tier))}
                        </span>
                      </div>
                    ))}
                    <div className="h-px bg-gray-200 my-1"></div>
                    <div className="flex justify-between text-sm">
                      <span>Base Price:</span>
                      <span>{formatCurrency(ticket.price)}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {(!formData.ticketTypes || formData.ticketTypes.length === 0) && (
            <p className="text-center py-8 text-gray-500">
              No ticket types added. Click the button above to add a ticket type.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TicketingStep;
