
// Original components
export { default as AdminLayout } from './AdminLayout';
export { default as AdminSidebar } from './AdminSidebar';
export { default as AdminPageLayout } from './AdminPageLayout';
export { default as AdminPageHeader } from './AdminPageHeader';
export { default as AdminPageContent } from './AdminPageContent';
export { default as AdminPageActions } from './AdminPageActions';

// Streamlined components
export { default as StreamlinedAdminLayout } from './StreamlinedAdminLayout';
export { default as AdminPageWrapper } from './AdminPageWrapper';
export { AdminLayoutProvider, useAdminLayout } from './AdminLayoutProvider';

// Types
export type { AdminPageConfig, AdminPageAction } from './AdminPageWrapper';

// Utilities
export { createPageConfig, COMMON_PAGE_CONFIGS, getPageConfigByPath } from './utils';
