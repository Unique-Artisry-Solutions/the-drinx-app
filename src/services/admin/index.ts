
// Streamlined admin services - simplified approach
export { SimplifiedAdminService } from './SimplifiedAdminService';
export type { SimpleQueryParams, SimpleResponse } from './SimplifiedAdminService';

// Legacy exports for backward compatibility - marked as deprecated
/** @deprecated Use SimplifiedAdminService instead */
export { BaseAdminService } from './BaseAdminService';
/** @deprecated Use SimplifiedAdminService instead */
export { AdminEstablishmentsService, establishmentsService } from './AdminEstablishmentsService';
/** @deprecated Use SimplifiedAdminService instead */
export { AdminCocktailsService, cocktailsService } from './AdminCocktailsService';
/** @deprecated Use SimplifiedAdminService instead */
export { AdminUsersService, usersService } from './AdminUsersService';

// Legacy types for backward compatibility - marked as deprecated
/** @deprecated Use SimpleQueryParams instead */
export type {
  QueryParams,
  PaginatedResponse,
  CreateDTO,
  UpdateDTO,
  BulkUpdateDTO,
  SearchParams,
  FilterParams
} from './BaseAdminService';

/** @deprecated Use SimplifiedAdminService instead */
export type { AdminEstablishment } from './AdminEstablishmentsService';
/** @deprecated Use SimplifiedAdminService instead */
export type { AdminCocktail } from './AdminCocktailsService';
/** @deprecated Use SimplifiedAdminService instead */
export type { AdminUser } from './AdminUsersService';
