
import React from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";

export function RulesTabContent() {
  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Rules Management Guide</h3>
        <p>This section allows you to create and manage rules for how users earn and redeem points.</p>
        
        <div className="space-y-2">
          <h4 className="font-medium">Creating a New Rule</h4>
          <ol className="list-decimal list-inside space-y-1 pl-4">
            <li>Click the "Add New Rule" button</li>
            <li>Fill in the required fields:
              <ul className="list-disc list-inside ml-6 mt-1">
                <li><strong>Rule Name:</strong> A descriptive name for the rule</li>
                <li><strong>Description:</strong> Details explaining the rule's purpose</li>
                <li><strong>Event Type:</strong> The trigger action (e.g., check_in, purchase)</li>
                <li><strong>Points:</strong> Number of points to award</li>
              </ul>
            </li>
            <li>Set the rule as active or inactive</li>
            <li>Click "Save" to create the rule</li>
          </ol>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Managing Existing Rules</h4>
          <p>For each rule in the list, you can:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Edit:</strong> Modify any aspect of the rule</li>
            <li><strong>Activate/Deactivate:</strong> Toggle whether the rule is currently in effect</li>
            <li><strong>Delete:</strong> Permanently remove a rule</li>
          </ul>
          
          <div className="bg-muted/30 rounded-md p-3 mt-2">
            <p className="text-sm"><strong>Caution:</strong> Deleting a rule cannot be undone. Consider deactivating rules instead if you may need them again.</p>
          </div>
        </div>
        
        <div className="space-y-2">
          <h4 className="font-medium">Rule Types and Best Practices</h4>
          <p>Common rule types include:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li><strong>Regular activity rules:</strong> For check-ins, purchases, etc.</li>
            <li><strong>Special event rules:</strong> For limited-time promotions</li>
            <li><strong>Milestone rules:</strong> For achievements or loyalty milestones</li>
          </ul>
          
          <p className="mt-2">For effective rule management:</p>
          <ul className="list-disc list-inside space-y-1 pl-4">
            <li>Use clear, descriptive names for rules</li>
            <li>Regularly review and update rules based on program performance</li>
            <li>Test new rules thoroughly before activating them</li>
          </ul>
        </div>
      </div>
    </ScrollArea>
  );
}
