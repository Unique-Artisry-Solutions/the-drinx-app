
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Lightbulb, 
  ArrowRight, 
  CheckCircle, 
  AlertTriangle,
  Code,
  Zap,
  Shield
} from 'lucide-react';
import { migrationStatusChecker } from '@/services/migration/ServiceMigrationUtils';

interface MigrationSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'auth' | 'services' | 'types' | 'components';
  priority: 'low' | 'medium' | 'high';
  effort: 'minimal' | 'moderate' | 'significant';
  benefits: string[];
  implementationSteps: string[];
  riskLevel: 'low' | 'medium' | 'high';
  isImplemented?: boolean;
}

const MigrationSuggestionEngine: React.FC = () => {
  const [suggestions, setSuggestions] = useState<MigrationSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<MigrationSuggestion | null>(null);
  const [implementedCount, setImplementedCount] = useState(0);

  useEffect(() => {
    generateSuggestions();
  }, []);

  const generateSuggestions = () => {
    const migrationOpportunities = migrationStatusChecker.checkMigrationOpportunities();
    
    const generatedSuggestions: MigrationSuggestion[] = [
      {
        id: 'auth-enhancement',
        title: 'Migrate to Enhanced Auth Patterns',
        description: 'Upgrade components to use useCompatibleAuth() for better type safety and error handling',
        category: 'auth',
        priority: 'high',
        effort: 'minimal',
        benefits: migrationOpportunities.auth.benefits,
        implementationSteps: [
          'Import useCompatibleAuth from compatibility wrapper',
          'Replace existing auth hook usage',
          'Test component functionality',
          'Monitor for any issues'
        ],
        riskLevel: 'low',
        isImplemented: false
      },
      {
        id: 'service-registry',
        title: 'Register Services with Isolated Registry',
        description: 'Move services to centralized registry for better monitoring and management',
        category: 'services',
        priority: 'medium',
        effort: 'minimal',
        benefits: migrationOpportunities.services.benefits,
        implementationSteps: [
          'Import isolatedServiceRegistry',
          'Register service with metadata',
          'Add health check interface',
          'Verify registration in dashboard'
        ],
        riskLevel: 'low',
        isImplemented: false
      },
      {
        id: 'type-safety',
        title: 'Enhance Type Safety',
        description: 'Implement safe type converters and validation for runtime safety',
        category: 'types',
        priority: 'medium',
        effort: 'moderate',
        benefits: migrationOpportunities.types.benefits,
        implementationSteps: [
          'Import safeTypeGuards and safeTypeConverters',
          'Replace unsafe type assertions',
          'Add runtime validation',
          'Test edge cases'
        ],
        riskLevel: 'low',
        isImplemented: false
      },
      {
        id: 'component-standardization',
        title: 'Standardize Component Interfaces',
        description: 'Migrate components to use BaseComponentProps for consistency',
        category: 'components',
        priority: 'low',
        effort: 'minimal',
        benefits: ['Consistent prop interfaces', 'Better testability', 'Improved maintainability'],
        implementationSteps: [
          'Extend BaseComponentProps in component interfaces',
          'Add data-testid support',
          'Update component documentation',
          'Verify accessibility compliance'
        ],
        riskLevel: 'low',
        isImplemented: false
      },
      {
        id: 'monitoring-integration',
        title: 'Integrate Component Monitoring',
        description: 'Add performance and health monitoring to critical components',
        category: 'components',
        priority: 'medium',
        effort: 'moderate',
        benefits: ['Real-time performance insights', 'Error tracking', 'Usage analytics'],
        implementationSteps: [
          'Add monitoring hooks to components',
          'Implement error boundaries',
          'Set up metrics collection',
          'Create monitoring dashboards'
        ],
        riskLevel: 'medium',
        isImplemented: false
      }
    ];

    setSuggestions(generatedSuggestions);
    setImplementedCount(generatedSuggestions.filter(s => s.isImplemented).length);
  };

  const handleImplementSuggestion = (suggestionId: string) => {
    setSuggestions(prev => 
      prev.map(s => 
        s.id === suggestionId 
          ? { ...s, isImplemented: true }
          : s
      )
    );
    setImplementedCount(prev => prev + 1);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth': return <Shield className="h-4 w-4" />;
      case 'services': return <Zap className="h-4 w-4" />;
      case 'types': return <Code className="h-4 w-4" />;
      case 'components': return <Lightbulb className="h-4 w-4" />;
      default: return <Lightbulb className="h-4 w-4" />;
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Migration Suggestions</h2>
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {implementedCount}/{suggestions.length} Implemented
          </Badge>
        </div>
      </div>

      <Alert>
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Automated Migration Analysis</AlertTitle>
        <AlertDescription>
          Based on code analysis, here are suggested improvements to enhance your application's 
          architecture, performance, and maintainability. All suggestions are designed to be 
          non-breaking and can be implemented incrementally.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {suggestions.map((suggestion) => (
          <Card key={suggestion.id} className={suggestion.isImplemented ? 'bg-green-50 border-green-200' : ''}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(suggestion.category)}
                  <CardTitle className="text-lg">{suggestion.title}</CardTitle>
                  {suggestion.isImplemented && (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  )}
                </div>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(suggestion.priority)}>
                    {suggestion.priority} priority
                  </Badge>
                  <Badge variant="outline">
                    {suggestion.effort} effort
                  </Badge>
                </div>
              </div>
              <p className="text-muted-foreground">{suggestion.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Benefits:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    {suggestion.benefits.map((benefit, index) => (
                      <li key={index}>{benefit}</li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-sm">
                      Risk Level: <span className={getRiskColor(suggestion.riskLevel)}>
                        {suggestion.riskLevel}
                      </span>
                    </span>
                    <span className="text-sm">
                      Category: {suggestion.category}
                    </span>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedSuggestion(suggestion)}
                    >
                      View Details
                    </Button>
                    {!suggestion.isImplemented && (
                      <Button
                        size="sm"
                        onClick={() => handleImplementSuggestion(suggestion.id)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Mark as Implemented
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedSuggestion && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {getCategoryIcon(selectedSuggestion.category)}
                Implementation Plan: {selectedSuggestion.title}
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedSuggestion(null)}
              >
                ×
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Implementation Steps:</h4>
                <ol className="list-decimal list-inside space-y-2">
                  {selectedSuggestion.implementationSteps.map((step, index) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <ArrowRight className="h-3 w-3" />
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  This suggestion has a <strong>{selectedSuggestion.riskLevel}</strong> risk level 
                  and requires <strong>{selectedSuggestion.effort}</strong> effort to implement.
                  Always test changes in a development environment first.
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MigrationSuggestionEngine;
