import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Clipboard, Check, Copy, RefreshCw, ArrowRight, Percent } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { DiscountCode } from '@/types/PromoterTypes';

interface PromoCodeGeneratorProps {
  eventId?: string;
  onSave?: (code: DiscountCode) => void;
}

const discountTypes = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'fixed_amount', label: 'Fixed Amount' },
  { value: 'free_item', label: 'Free Item' },
  { value: 'bogo', label: 'Buy One Get One' }
];

const codeStyles = [
  { value: 'alphanumeric', label: 'Alphanumeric' },
  { value: 'numeric', label: 'Numeric' },
  { value: 'alphabetic', label: 'Alphabetic' }
];

const PromoCodeGenerator: React.FC<PromoCodeGeneratorProps> = ({ eventId, onSave }) => {
  const [codeLength, setCodeLength] = useState(8);
  const [codeStyle, setCodeStyle] = useState('alphanumeric');
  const [prefix, setPrefix] = useState('');
  const [suffix, setSuffix] = useState('');
  const [discountCode, setDiscountCode] = useState<DiscountCode>({
    code: '',
    discountType: 'percentage',
    discountAmount: 10,
    usageLimit: 100
  });
  const [justCopied, setJustCopied] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // useEffect to generate a new code when the component mounts
  useEffect(() => {
    generateDiscountCode();
  }, [codeLength, codeStyle, prefix, suffix]);

  // Function to handle copying code to clipboard
  const handleCopyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setJustCopied(code);
    toast({
      title: "Copied to clipboard",
      description: "Discount code copied to clipboard."
    });

    // Reset the "just copied" state after 2 seconds
    setTimeout(() => {
      if (justCopied === code) {
        setJustCopied(null);
      }
    }, 2000);
  };

  // Function to generate a random code
  const generateRandomCode = (length: number, style: string) => {
    let characters = '';
    if (style === 'alphanumeric') {
      characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    } else if (style === 'numeric') {
      characters = '0123456789';
    } else if (style === 'alphabetic') {
      characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    }

    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Function to generate a discount code
  const generateDiscountCode = () => {
    const randomCode = generateRandomCode(codeLength, codeStyle);
    const newCode = `${prefix}${randomCode}${suffix}`;
    setDiscountCode(prev => ({ ...prev, code: newCode }));
  };

  // Function to save a discount code
  const handleSaveDiscountCode = async () => {
    try {
      if (!eventId) {
        toast({
          title: "No event selected",
          description: "Please select an event to create a discount code for.",
          variant: "destructive"
        });
        return;
      }

      if (!discountCode.code || !discountCode.discountType || discountCode.discountAmount === 0) {
        toast({
          title: "Incomplete discount code",
          description: "Please ensure the code, type, and amount are set.",
          variant: "destructive"
        });
        return;
      }

      if (discountCode.usageLimit === 0 && discountCode.discountType !== 'free_item') {
        toast({
          title: "Invalid usage limit",
          description: "Usage limit must be greater than 0.",
          variant: "destructive"
        });
        return;
      }

      setSaving(true);

      // Simulate saving to a database
      await new Promise(resolve => setTimeout(resolve, 1000));

      toast({
        title: "Success",
        description: "Discount code saved successfully.",
      });

      // Call the onSave prop if it exists
      onSave && onSave(discountCode);

    } catch (error) {
      console.error("Error saving discount code:", error);
      toast({
        title: "Error",
        description: "Failed to save discount code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Discount Code Generator</CardTitle>
        <CardDescription>Customize and generate unique discount codes for your events.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="customize" className="space-y-4">
          <TabsList>
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="customize" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="code">Code</Label>
                <div className="flex items-center">
                  <Input id="code" value={discountCode.code} readOnly className="mr-2" />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={generateDiscountCode}
                    disabled={saving}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => handleCopyToClipboard(discountCode.code)}
                    disabled={saving}
                  >
                    {justCopied === discountCode.code ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <div>
                <Label htmlFor="discountType">Discount Type</Label>
                <Select
                  value={discountCode.discountType}
                  onValueChange={(value) => setDiscountCode(prev => ({ ...prev, discountType: value }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {discountTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="discountAmount">Discount Amount</Label>
                <div className="flex items-center">
                  <Input
                    id="discountAmount"
                    type="number"
                    value={discountCode.discountAmount}
                    onChange={(e) => setDiscountCode(prev => ({ ...prev, discountAmount: Number(e.target.value) }))}
                    className="mr-2"
                  />
                  {discountCode.discountType === 'percentage' && <Percent className="h-4 w-4 text-gray-500" />}
                </div>
              </div>
              <div>
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={discountCode.usageLimit}
                  onChange={(e) => setDiscountCode(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="settings" className="space-y-4">
            <div>
              <Label>Code Length</Label>
              <Slider
                defaultValue={[codeLength]}
                max={16}
                min={4}
                step={1}
                onValueChange={(value) => setCodeLength(value[0])}
              />
              <div className="text-sm text-muted-foreground">
                {codeLength} characters
              </div>
            </div>
            <div>
              <Label htmlFor="codeStyle">Code Style</Label>
              <Select
                value={codeStyle}
                onValueChange={setCodeStyle}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {codeStyles.map((style) => (
                    <SelectItem key={style.value} value={style.value}>
                      {style.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="prefix">Prefix</Label>
                <Input
                  id="prefix"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="suffix">Suffix</Label>
                <Input
                  id="suffix"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveDiscountCode} disabled={saving}>
          {saving ? (
            <>
              Saving...
            </>
          ) : (
            <>
              Save Discount Code
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PromoCodeGenerator;
