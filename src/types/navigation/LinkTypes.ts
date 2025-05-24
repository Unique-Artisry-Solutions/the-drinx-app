
/**
 * Interface for link components used in navigation
 */
export interface LinkProps {
  href: string;
  children: React.ReactNode;
  activeClassName?: string;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  preventScrollReset?: boolean;
  replace?: boolean;
}
