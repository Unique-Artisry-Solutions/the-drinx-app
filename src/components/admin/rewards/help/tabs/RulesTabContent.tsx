
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Settings, Target, Award } from 'lucide-react';

export function RulesTabContent() {
  const ruleTypes = [
    {
      icon: Zap,
      type: 'Trigger Rules',
      description: 'Automatic actions based on customer behavior',
      examples: ['Welcome bonus on signup', 'Birthday rewards', 'Visit milestone bonuses'],
      complexity: 'Medium'
    },
    {
      icon: Target,
      type: 'Conditional Rules',
      description: 'Logic-based rules with multiple conditions',
      examples: ['Tier-based multipliers', 'Spending thresholds', 'Time-based promotions'],
      complexity: 'Advanced'
    },
    {
      icon: Award,
      type: 'Redemption Rules',
      description: 'Rules governing how rewards can be redeemed',
      examples: ['Minimum point requirements', 'Item availability', 'Expiration dates'],
      complexity: 'Easy'
    },
    {
      icon: Settings,
      type: 'System Rules',
      description: 'Global rules affecting the entire program',
      examples: ['Daily point limits', 'Fraud prevention', 'Point expiry policies'],
      complexity: 'Advanced'
    }
  ];

  const bestPractices = [
    'Start with simple rules and gradually add complexity',
    'Test rules thoroughly before activation',
    'Monitor rule performance and adjust as needed',
    'Document rule logic for future reference',
    'Use rule priorities to manage conflicts',
    'Regular review and cleanup of unused rules'
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Reward Rules System</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            Create sophisticated reward logic using our flexible rules engine. Combine conditions, 
            actions, and triggers to automate your customer engagement strategy.
          </p>

          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-4">Rule Categories</h3>
              <div className="space-y-4">
                {ruleTypes.map((rule) => (
                  <Card key={rule.type}>
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <rule.icon className="h-5 w-5 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{rule.type}</h4>
                            <Badge 
                              variant={rule.complexity === 'Easy' ? 'default' : 
                                      rule.complexity === 'Medium' ? 'secondary' : 'outline'}
                            >
                              {rule.complexity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {rule.description}
                          </p>
                          <div>
                            <span className="text-xs font-medium text-muted-foreground">Examples:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {rule.examples.map((example) => (
                                <Badge key={example} variant="outline" className="text-xs">
                                  {example}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Best Practices</h3>
              <div className="space-y-2">
                {bestPractices.map((practice, index) => (
                  <div key={index} className="flex items-start gap-2 text-sm">
                    <Badge variant="outline" className="mt-0.5 text-xs">
                      {index + 1}
                    </Badge>
                    <span className="text-muted-foreground">{practice}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
