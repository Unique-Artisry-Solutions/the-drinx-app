
// Streamlined admin services - simplified approach
export { SimplifiedAdminService } from './SimplifiedAdminService';
export type { SimpleQueryParams, SimpleResponse } from './SimplifiedAdminService';

// Compatibility layer for backward compatibility
export {
  BaseAdminService,
  AdminUsersService,
  AdminEstablishmentsService,
  AdminCocktailsService,
  usersService,
  establishmentsService,
  cocktailsService,
  type AdminUser,
  type AdminEstablishment,
  type AdminCocktail,
  type QueryParams,
  type PaginatedResponse
} from './AdminServiceAdapter';
