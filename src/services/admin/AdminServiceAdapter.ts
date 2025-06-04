
import { SimplifiedAdminService, type SimpleQueryParams, type SimpleResponse } from './SimplifiedAdminService';

// Type definitions for backward compatibility
export interface AdminUser {
  id: string;
  display_name?: string;
  username?: string;
  bio?: string;
  user_type?: string;
  phone?: string;
  created_at: string;
}

export interface AdminEstablishment {
  id: string;
  name: string;
  description?: string;
  address: string;
  cocktailCount: number;
  cocktail_count?: number;
  created_at: string;
}

export interface AdminCocktail {
  id: string;
  name: string;
  description?: string;
  establishment: any;
  price: number | string;
  created_at: string;
}

// Legacy interface compatibility
export interface QueryParams extends SimpleQueryParams {
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Base service adapter class
export abstract class BaseAdminService<T> {
  abstract getAll(params?: QueryParams): Promise<PaginatedResponse<T>>;
  abstract getById(id: string): Promise<T | null>;
  abstract create(data: any): Promise<T | null>;
  abstract update(id: string, data: any): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
  abstract bulkDelete(ids: string[]): Promise<boolean>;
}

// Users service adapter
class AdminUsersServiceAdapter extends BaseAdminService<AdminUser> {
  async getAll(params: QueryParams = {}): Promise<PaginatedResponse<AdminUser>> {
    const response = await SimplifiedAdminService.getUsers(params);
    return {
      ...response,
      totalPages: Math.ceil(response.total / response.limit)
    };
  }

  async getById(id: string): Promise<AdminUser | null> {
    return SimplifiedAdminService.getUserById(id);
  }

  async create(data: any): Promise<AdminUser | null> {
    return SimplifiedAdminService.createUser(data);
  }

  async update(id: string, data: any): Promise<AdminUser | null> {
    return SimplifiedAdminService.updateUser(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return SimplifiedAdminService.deleteUser(id);
  }

  async bulkDelete(ids: string[]): Promise<boolean> {
    return SimplifiedAdminService.bulkDelete(ids, 'users');
  }
}

// Establishments service adapter
class AdminEstablishmentsServiceAdapter extends BaseAdminService<AdminEstablishment> {
  async getAll(params: QueryParams = {}): Promise<PaginatedResponse<AdminEstablishment>> {
    const response = await SimplifiedAdminService.getEstablishments(params);
    return {
      ...response,
      totalPages: Math.ceil(response.total / response.limit)
    };
  }

  async getById(id: string): Promise<AdminEstablishment | null> {
    return SimplifiedAdminService.getEstablishmentById(id);
  }

  async create(data: any): Promise<AdminEstablishment | null> {
    return SimplifiedAdminService.createEstablishment(data);
  }

  async update(id: string, data: any): Promise<AdminEstablishment | null> {
    return SimplifiedAdminService.updateEstablishment(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return SimplifiedAdminService.deleteEstablishment(id);
  }

  async bulkDelete(ids: string[]): Promise<boolean> {
    return SimplifiedAdminService.bulkDelete(ids, 'establishments');
  }
}

// Cocktails service adapter
class AdminCocktailsServiceAdapter extends BaseAdminService<AdminCocktail> {
  async getAll(params: QueryParams = {}): Promise<PaginatedResponse<AdminCocktail>> {
    const response = await SimplifiedAdminService.getCocktails(params);
    return {
      ...response,
      totalPages: Math.ceil(response.total / response.limit)
    };
  }

  async getById(id: string): Promise<AdminCocktail | null> {
    return SimplifiedAdminService.getCocktailById(id);
  }

  async create(data: any): Promise<AdminCocktail | null> {
    return SimplifiedAdminService.createCocktail(data);
  }

  async update(id: string, data: any): Promise<AdminCocktail | null> {
    return SimplifiedAdminService.updateCocktail(id, data);
  }

  async delete(id: string): Promise<boolean> {
    return SimplifiedAdminService.deleteCocktail(id);
  }

  async bulkDelete(ids: string[]): Promise<boolean> {
    return SimplifiedAdminService.bulkDelete(ids, 'cocktails');
  }
}

// Service instances for backward compatibility
export const usersService = new AdminUsersServiceAdapter();
export const establishmentsService = new AdminEstablishmentsServiceAdapter();
export const cocktailsService = new AdminCocktailsServiceAdapter();

// Export the adapter classes
export { AdminUsersServiceAdapter as AdminUsersService };
export { AdminEstablishmentsServiceAdapter as AdminEstablishmentsService };
export { AdminCocktailsServiceAdapter as AdminCocktailsService };
