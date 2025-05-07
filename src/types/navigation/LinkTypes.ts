
import { MouseEvent } from 'react';

/**
 * Interface for link component props
 */
export interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  preventScrollReset?: boolean;
  replace?: boolean;
  [key: string]: any; // Allow for additional props
}
