import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Keyboard, HelpCircle } from 'lucide-react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  description: string;
  category?: string;
}

interface KeyboardShortcutHelpProps {
  shortcuts: KeyboardShortcut[];
  trigger?: React.ReactNode;
}

export const KeyboardShortcutHelp: React.FC<KeyboardShortcutHelpProps> = ({
  shortcuts,
  trigger
}) => {
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    const category = shortcut.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(shortcut);
    return acc;
  }, {} as Record<string, KeyboardShortcut[]>);

  const formatShortcut = (shortcut: KeyboardShortcut) => {
    const keys = [];
    if (shortcut.ctrl) keys.push('Ctrl');
    if (shortcut.shift) keys.push('Shift');
    if (shortcut.alt) keys.push('Alt');
    keys.push(shortcut.key);
    return keys;
  };

  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="gap-2">
      <Keyboard className="h-4 w-4" />
      Shortcuts
    </Button>
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts to navigate and manage notifications efficiently.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {Object.entries(groupedShortcuts).map(([category, categoryShortcuts]) => (
            <div key={category}>
              <h4 className="font-medium text-sm text-muted-foreground mb-2">
                {category}
              </h4>
              <div className="space-y-2">
                {categoryShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{shortcut.description}</span>
                    <div className="flex items-center gap-1">
                      {formatShortcut(shortcut).map((key, keyIndex) => (
                        <React.Fragment key={keyIndex}>
                          <Badge variant="outline" className="text-xs px-2 py-1">
                            {key === ' ' ? 'Space' : key}
                          </Badge>
                          {keyIndex < formatShortcut(shortcut).length - 1 && (
                            <span className="text-xs text-muted-foreground">+</span>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              {Object.keys(groupedShortcuts).indexOf(category) < Object.keys(groupedShortcuts).length - 1 && (
                <Separator className="mt-3" />
              )}
            </div>
          ))}
        </div>

        <div className="text-xs text-muted-foreground mt-4 p-3 bg-muted/50 rounded">
          <div className="flex items-center gap-1 mb-1">
            <HelpCircle className="h-3 w-3" />
            <span className="font-medium">Tip:</span>
          </div>
          Shortcuts work when not typing in input fields. Press Escape to clear selections.
        </div>
      </DialogContent>
    </Dialog>
  );
};