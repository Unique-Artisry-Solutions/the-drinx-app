
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from '@/hooks/use-toast';

const TestControls = () => {
  const { toast } = useToast();
  const [selectedTests, setSelectedTests] = React.useState<string[]>([]);

  const testSuites = [
    { id: 'api', label: 'API Tests' },
    { id: 'ui', label: 'UI Tests' },
    { id: 'integration', label: 'Integration Tests' },
    { id: 'performance', label: 'Performance Tests' },
  ];

  const handleRunTests = () => {
    if (selectedTests.length === 0) {
      toast({
        title: "No tests selected",
        description: "Please select at least one test suite to run",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Running selected tests",
      description: `Executing ${selectedTests.join(', ')} tests`,
    });
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Test Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          {testSuites.map((suite) => (
            <div key={suite.id} className="flex items-center space-x-2">
              <Checkbox
                id={suite.id}
                checked={selectedTests.includes(suite.id)}
                onCheckedChange={(checked) => {
                  setSelectedTests(
                    checked
                      ? [...selectedTests, suite.id]
                      : selectedTests.filter((id) => id !== suite.id)
                  );
                }}
              />
              <label
                htmlFor={suite.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {suite.label}
              </label>
            </div>
          ))}
        </div>
        <Button onClick={handleRunTests} className="w-full">Run Selected Tests</Button>
      </CardContent>
    </Card>
  );
};

export default TestControls;
