
import React, { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>(value);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setCurrentColor(value);
  }, [value]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    onChange(newColor);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    
    // Check if it's a valid hex color
    if (/^#([0-9A-F]{3}){1,2}$/i.test(newColor)) {
      onChange(newColor);
    }
  };

  const triggerColorPicker = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={`color-${label}`}>{label}</Label>
        <div className="flex items-center gap-2">
          <div 
            className="w-8 h-8 rounded border cursor-pointer"
            style={{ backgroundColor: currentColor }}
            onClick={triggerColorPicker}
          />
          <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
              <Input 
                id={`color-${label}`}
                className="w-24 font-mono"
                value={currentColor} 
                onChange={handleInputChange}
                onClick={() => setIsOpen(true)}
              />
            </PopoverTrigger>
            <PopoverContent className="p-0 w-fit" align="end">
              <input 
                ref={colorInputRef}
                type="color" 
                value={currentColor}
                onChange={handleColorChange}
                className="w-32 h-32 cursor-pointer"
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
