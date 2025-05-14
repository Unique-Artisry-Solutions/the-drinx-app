
/**
 * Type definition for breadcrumb item
 */
export interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Props for the Breadcrumbs component
 */
export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}
