
import { BaseAdminService } from './BaseAdminService';
import { supabase } from '@/integrations/supabase/client';

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
    const { page = 1, limit = 20, sortBy, sortOrder = 'desc', filters } = params;
    const offset = (page - 1) * limit;

    try {
      let query = supabase
        .from('cocktails')
        .select(`
          *,
          establishment:establishments(name)
        `, { count: 'exact' });

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (key === 'establishment_name') {
              // For establishment name filtering, we need to handle it differently
              // This is a simplified approach - in production you'd want proper joins
              query = query.ilike('establishments.name', `%${value}%`);
            } else {
              query = query.eq(key, value);
            }
          }
        });
      }

      if (sortBy) {
        query = query.order(sortBy, { ascending: sortOrder === 'asc' });
      } else {
        query = query.order('created_at', { ascending: false });
      }

      query = query.range(offset, offset + limit - 1);

      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        data: data || [],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Error getting cocktails with establishments:', error);
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }
  }

  async getPopularCocktails(limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('cocktails')
        .select(`
          *,
          establishment:establishments(name)
        `)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Error getting popular cocktails:', error);
      return [];
    }
  }
}

export const cocktailsService = new AdminCocktailsService();
