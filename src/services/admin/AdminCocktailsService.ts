
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

export class AdminCocktailsService extends BaseAdminService<AdminCocktail> {
  constructor() {
    super('cocktails');
  }

  async getAllWithEstablishments(params: any = {}) {
    // Simplified mock implementation for now
    return {
      data: [],
      total: 0,
      page: params.page || 1,
      limit: params.limit || 20,
      totalPages: 0
    };
  }

  async getPopularCocktails(limit: number = 10) {
    // Mock implementation
    return [];
  }
}

export const cocktailsService = new AdminCocktailsService();
