
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  icon: LucideIcon;
  label: string;
  path: string;
  dropdown?: {
    items: Array<{
      label: string;
      path: string;
    }>;
  };
}
