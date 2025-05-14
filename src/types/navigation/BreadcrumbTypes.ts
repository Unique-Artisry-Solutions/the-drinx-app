
/**
 * Interface for breadcrumb navigation items
 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

/**
 * Interface for breadcrumb navigation props
 */
export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}
