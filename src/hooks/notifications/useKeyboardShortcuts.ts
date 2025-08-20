import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  action: () => void;
  description: string;
  global?: boolean;
}

interface UseKeyboardShortcutsProps {
  shortcuts: KeyboardShortcut[];
  enabled?: boolean;
}

export const useKeyboardShortcuts = ({ 
  shortcuts, 
  enabled = true 
}: UseKeyboardShortcutsProps) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!enabled) return;

    // Skip if user is typing in an input field
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      return;
    }

    const matchingShortcut = shortcuts.find(shortcut => {
      const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
      const ctrlMatch = !!shortcut.ctrl === event.ctrlKey;
      const shiftMatch = !!shortcut.shift === event.shiftKey;
      const altMatch = !!shortcut.alt === event.altKey;

      return keyMatch && ctrlMatch && shiftMatch && altMatch;
    });

    if (matchingShortcut) {
      event.preventDefault();
      event.stopPropagation();
      matchingShortcut.action();
    }
  }, [shortcuts, enabled]);

  useEffect(() => {
    if (!enabled) return;

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);

  return { shortcuts };
};

// Common notification shortcuts
export const createNotificationShortcuts = ({
  onOpenNotificationCenter,
  onMarkAllAsRead,
  onToggleFilters,
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
  onMarkSelectedAsRead,
  currentNotificationId,
  onNavigateUp,
  onNavigateDown,
  onToggleCurrentNotification,
  onDeleteCurrent,
  onMarkCurrentAsRead,
}: {
  onOpenNotificationCenter?: () => void;
  onMarkAllAsRead?: () => void;
  onToggleFilters?: () => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  onDeleteSelected?: () => void;
  onMarkSelectedAsRead?: () => void;
  currentNotificationId?: string;
  onNavigateUp?: () => void;
  onNavigateDown?: () => void;
  onToggleCurrentNotification?: () => void;
  onDeleteCurrent?: () => void;
  onMarkCurrentAsRead?: () => void;
}): KeyboardShortcut[] => {
  return [
    // Global shortcuts
    {
      key: 'n',
      ctrl: true,
      shift: true,
      action: () => onOpenNotificationCenter?.(),
      description: 'Open notification center',
      global: true
    },
    {
      key: 'm',
      ctrl: true,
      shift: true,
      action: () => onMarkAllAsRead?.(),
      description: 'Mark all notifications as read',
      global: true
    },

    // Filter and selection shortcuts
    {
      key: 'f',
      action: () => onToggleFilters?.(),
      description: 'Toggle filters'
    },
    {
      key: 'a',
      ctrl: true,
      action: () => onSelectAll?.(),
      description: 'Select all notifications'
    },
    {
      key: 'Escape',
      action: () => onClearSelection?.(),
      description: 'Clear selection'
    },

    // Bulk actions
    {
      key: 'Delete',
      action: () => onDeleteSelected?.(),
      description: 'Delete selected notifications'
    },
    {
      key: 'r',
      action: () => onMarkSelectedAsRead?.(),
      description: 'Mark selected as read'
    },

    // Navigation shortcuts
    {
      key: 'ArrowUp',
      action: () => onNavigateUp?.(),
      description: 'Navigate up'
    },
    {
      key: 'ArrowDown', 
      action: () => onNavigateDown?.(),
      description: 'Navigate down'
    },
    {
      key: ' ',
      action: () => onToggleCurrentNotification?.(),
      description: 'Toggle current notification selection'
    },
    {
      key: 'Enter',
      action: () => onMarkCurrentAsRead?.(),
      description: 'Mark current notification as read'
    },
    {
      key: 'd',
      action: () => onDeleteCurrent?.(),
      description: 'Delete current notification'
    },

    // Priority filters (number keys)
    ...[1, 2, 3, 4].map(num => ({
      key: num.toString(),
      action: () => {
        // This would be handled by the component using these shortcuts
        const priority = ['low', 'medium', 'high', 'urgent'][num - 1];
        console.log(`Filter by ${priority} priority`);
      },
      description: `Filter by ${['low', 'medium', 'high', 'urgent'][num - 1]} priority`
    }))
  ];
};