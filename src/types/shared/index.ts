
/**
 * Centralized exports for all shared interfaces with consistent naming conventions
 * 
 * Export Strategy:
 * - Primary exports use new naming conventions (Props, Data, Config)
 * - Legacy exports maintained for backward compatibility with @deprecated tags
 * - Clear namespacing for different interface categories
 */

// ===== BASE INTERFACE EXPORTS =====
export * from './BaseInterfaces';
export * from './FormInterfaces';
export * from './AdminInterfaces';
export * from './NavigationInterfaces';

// ===== COMPONENT PROPS RE-EXPORTS =====
export type {
  BaseComponentProps,
  BaseCardProps,
  BaseFormFieldProps,
  BaseNavItemProps,
  BaseModalProps,
  BaseActionProps
} from './BaseInterfaces';

export type {
  BaseFormProps,
  GenericFormFieldProps,
  BaseFormModalProps,
  BaseFormDialogActionsProps
} from './FormInterfaces';

export type {
  BaseAdminTableProps,
  BaseAdminFormProps,
  BaseAdminDashboardCardProps
} from './AdminInterfaces';

export type {
  BaseNavigationProps,
  MobileNavigationProps,
  DesktopNavigationProps,
  BreadcrumbProps,
  TabNavigationProps
} from './NavigationInterfaces';

// ===== DATA STRUCTURE RE-EXPORTS =====
export type {
  BaseLoadingState,
  BaseErrorState,
  BaseStateProps,
  BaseListItemData,
  BaseUserData,
  BaseEventData,
  BaseApiResponseData,
  BaseListResponseData,
  BaseMetricsData
} from './BaseInterfaces';

export type {
  BaseValidationRulesData,
  BaseFormSectionData
} from './FormInterfaces';

export type {
  BaseAdminEntityData,
  BaseSystemConfigData,
  BaseAdminAnalyticsData
} from './AdminInterfaces';

export type {
  EnhancedNavItemData,
  NavDropdownItemData,
  NavigationSectionData,
  BreadcrumbItemData,
  TabNavigationItemData
} from './NavigationInterfaces';

// ===== CONFIG OBJECT RE-EXPORTS =====
export type {
  BaseTableColumnConfig,
  BasePaginationConfig,
  BaseSearchConfig,
  BaseSortConfig,
  BaseListManagementConfig
} from './BaseInterfaces';

export type {
  BaseFormConfig
} from './FormInterfaces';

export type {
  BaseAdminFilterConfig
} from './AdminInterfaces';

// ===== LEGACY COMPATIBILITY EXPORTS =====
// These maintain backward compatibility while encouraging migration to new naming
export type {
  BaseNavItem,
  BaseListItem,
  BaseUser,
  BaseEvent,
  BaseTableColumn,
  BasePaginationProps,
  BaseSearchProps,
  BaseSortProps,
  BaseListManagementProps,
  BaseApiResponse,
  BaseListResponse,
  BaseMetrics
} from './BaseInterfaces';

export type {
  BaseFormDialogActions,
  BaseValidationRules,
  BaseFormSection
} from './FormInterfaces';

export type {
  BaseAdminEntity,
  BaseAdminFilter,
  BaseAdminDashboardCard,
  BaseSystemConfig,
  BaseAdminAnalytics
} from './AdminInterfaces';

export type {
  EnhancedNavItem,
  NavDropdownItem,
  NavigationSection
} from './NavigationInterfaces';
