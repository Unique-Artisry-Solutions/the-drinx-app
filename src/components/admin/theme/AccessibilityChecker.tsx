
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Check, Info } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { checkColorAccessibility } from './utils/colorAccessibility';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const AccessibilityChecker: React.FC = () => {
  const { palette } = useTheme();
  
  // Check main color pairs for accessibility
  const textOnBackground = checkColorAccessibility(palette.text, palette.background);
  const textOnCard = checkColorAccessibility(palette.text, palette.cardBackground);
  const mutedTextOnBackground = checkColorAccessibility(palette.mutedText, palette.background);
  const primaryOnBackground = checkColorAccessibility(palette.primary, palette.background);
  
  // Helper function to render compliance badge
  const renderComplianceBadge = (level: 'AAA' | 'AA' | 'Fail') => {
    switch (level) {
      case 'AAA':
        return (
          <Badge className="bg-green-500 hover:bg-green-600 flex items-center gap-1">
            <Check size={12} /> AAA
          </Badge>
        );
      case 'AA':
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600 flex items-center gap-1">
            <Check size={12} /> AA
          </Badge>
        );
      case 'Fail':
        return (
          <Badge className="bg-red-500 hover:bg-red-600 flex items-center gap-1">
            <AlertTriangle size={12} /> Fail
          </Badge>
        );
    }
  };
  
  // Helper to format ratio to 2 decimal places
  const formatRatio = (ratio: number) => ratio.toFixed(2);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          Accessibility Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {(textOnBackground.normalText.level === 'Fail' || textOnCard.normalText.level === 'Fail') && (
          <Alert variant="destructive" className="mb-4">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Accessibility Issues Detected</AlertTitle>
            <AlertDescription>
              Some color combinations don't meet WCAG accessibility standards. Consider adjusting your color choices.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3 sm:col-span-1 font-medium">Color Combination</div>
            <div className="hidden sm:block font-medium">Normal Text</div>
            <div className="hidden sm:block font-medium">Large Text</div>
          </div>
          
          <div className="space-y-2">
            <div className="grid grid-cols-3 gap-2 items-center border-b pb-2">
              <div className="col-span-3 sm:col-span-1 flex items-center">
                <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: palette.text }}></div>
                <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: palette.background }}></div>
                <span>Text on Background</span>
              </div>
              <div className="col-span-3 sm:col-span-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-xs sm:hidden">Normal Text:</span>
                {renderComplianceBadge(textOnBackground.normalText.level)}
                <span className="text-sm text-muted-foreground">
                  {formatRatio(textOnBackground.normalText.ratio)}:1
                </span>
              </div>
              <div className="col-span-3 sm:col-span-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-xs sm:hidden">Large Text:</span>
                {renderComplianceBadge(textOnBackground.largeText.level)}
                <span className="text-sm text-muted-foreground">
                  {formatRatio(textOnBackground.largeText.ratio)}:1
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 items-center border-b pb-2">
              <div className="col-span-3 sm:col-span-1 flex items-center">
                <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: palette.text }}></div>
                <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: palette.cardBackground }}></div>
                <span>Text on Card</span>
              </div>
              <div className="col-span-3 sm:col-span-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-xs sm:hidden">Normal Text:</span>
                {renderComplianceBadge(textOnCard.normalText.level)}
                <span className="text-sm text-muted-foreground">
                  {formatRatio(textOnCard.normalText.ratio)}:1
                </span>
              </div>
              <div className="col-span-3 sm:col-span-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-xs sm:hidden">Large Text:</span>
                {renderComplianceBadge(textOnCard.largeText.level)}
                <span className="text-sm text-muted-foreground">
                  {formatRatio(textOnCard.largeText.ratio)}:1
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 items-center border-b pb-2">
              <div className="col-span-3 sm:col-span-1 flex items-center">
                <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: palette.mutedText }}></div>
                <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: palette.background }}></div>
                <span>Muted Text</span>
              </div>
              <div className="col-span-3 sm:col-span-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-xs sm:hidden">Normal Text:</span>
                {renderComplianceBadge(mutedTextOnBackground.normalText.level)}
                <span className="text-sm text-muted-foreground">
                  {formatRatio(mutedTextOnBackground.normalText.ratio)}:1
                </span>
              </div>
              <div className="col-span-3 sm:col-span-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-xs sm:hidden">Large Text:</span>
                {renderComplianceBadge(mutedTextOnBackground.largeText.level)}
                <span className="text-sm text-muted-foreground">
                  {formatRatio(mutedTextOnBackground.largeText.ratio)}:1
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="col-span-3 sm:col-span-1 flex items-center">
                <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: palette.primary }}></div>
                <div className="w-4 h-4 mr-2 rounded-sm" style={{ backgroundColor: palette.background }}></div>
                <span>Primary on Background</span>
              </div>
              <div className="col-span-3 sm:col-span-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-xs sm:hidden">Normal Text:</span>
                {renderComplianceBadge(primaryOnBackground.normalText.level)}
                <span className="text-sm text-muted-foreground">
                  {formatRatio(primaryOnBackground.normalText.ratio)}:1
                </span>
              </div>
              <div className="col-span-3 sm:col-span-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="text-xs sm:hidden">Large Text:</span>
                {renderComplianceBadge(primaryOnBackground.largeText.level)}
                <span className="text-sm text-muted-foreground">
                  {formatRatio(primaryOnBackground.largeText.ratio)}:1
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t text-sm text-muted-foreground">
          <div className="flex items-start gap-1">
            <Info className="h-4 w-4 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">WCAG Compliance Levels</p>
              <p><strong>AAA (Enhanced):</strong> Highest level of accessibility (7:1 contrast ratio for normal text)</p>
              <p><strong>AA (Standard):</strong> Minimum recommended level (4.5:1 contrast ratio for normal text)</p>
              <p><strong>Fail:</strong> Does not meet accessibility standards</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccessibilityChecker;
