
// Centralized exports for all shared interfaces
export * from './BaseInterfaces';
export * from './FormInterfaces';
export * from './AdminInterfaces';
export * from './NavigationInterfaces';

// Re-export commonly used types for convenience
export type {
  BaseComponentProps,
  BaseLoadingState,
  BaseErrorState,
  BaseStateProps,
  BaseListItem,
  BaseCardProps,
  BaseFormFieldProps,
  BaseNavItem,
  BaseModalProps,
  BaseTableColumn,
  BasePaginationProps,
  BaseSearchProps,
  BaseSortProps,
  BaseListManagementProps,
  BaseActionProps,
  BaseApiResponse,
  BaseListResponse,
  BaseUser,
  BaseEvent,
  BaseMetrics
} from './BaseInterfaces';

export type {
  BaseFormProps,
  GenericFormFieldProps,
  BaseFormModalProps,
  BaseFormDialogActions,
  BaseValidationRules,
  BaseFormSection,
  BaseFormConfig
} from './FormInterfaces';

export type {
  BaseAdminEntity,
  BaseAdminTableProps,
  BaseAdminFormProps,
  BaseAdminFilter,
  BaseAdminDashboardCard,
  BaseSystemConfig,
  BaseAdminAnalytics
} from './AdminInterfaces';

export type {
  EnhancedNavItem,
  NavDropdownItem,
  BaseNavigationProps,
  MobileNavigationProps,
  DesktopNavigationProps,
  NavigationSection,
  BreadcrumbProps,
  TabNavigationProps
} from './NavigationInterfaces';
