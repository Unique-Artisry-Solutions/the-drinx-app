
import { BaseAdminService } from './BaseAdminService';

export interface AdminCocktail {
  id: string;
  name: string;
  description: string;
  price: string;
  ingredients: any;
  image_url?: string;
  establishment_id: string;
  created_at: string;
  updated_at?: string;
  establishment?: {
    name: string;
  };
}

/**
 * @deprecated Use SimplifiedAdminService instead
 * This service will be removed in a future version
 */
export class AdminCocktailsService extends BaseAdminService<AdminCocktail> {
  constructor() {
    super('cocktails');
    console.warn('AdminCocktailsService is deprecated. Use SimplifiedAdminService instead.');
  }

  async getAllWithEstablishments(params: any = {}) {
    return {
      data: [],
      total: 0,
      page: params.page || 1,
      limit: params.limit || 20,
      totalPages: 0
    };
  }

  async getPopularCocktails(limit: number = 10) {
    return [];
  }
}

export const cocktailsService = new AdminCocktailsService();
