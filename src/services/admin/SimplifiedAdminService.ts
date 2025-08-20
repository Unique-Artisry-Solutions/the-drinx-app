
// Primary admin service - simplified implementation without complex inheritance

import { supabase } from '@/integrations/supabase/client';

// Type definitions for admin entities
export interface AdminUser {
  id: string;
  display_name?: string;
  username?: string;
  user_type?: string;
  phone?: string;
  bio?: string;
  created_at?: string;
  active_roles?: string[];
  establishment_name?: string;
}

export interface AdminEstablishment {
  id: string;
  name: string;
  description?: string;
  address: string;
  cocktailCount?: number;
  created_at?: string;
}

export interface AdminCocktail {
  id: string;
  name: string;
  description?: string;
  establishment?: AdminEstablishment | { name: string };
  price?: string | number;
  created_at?: string;
}

export interface SimpleQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface SimpleResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Streamlined CRUD operations for all admin entities
export class SimplifiedAdminService {
  // Users operations
  static async getUsers(params: SimpleQueryParams = {}): Promise<SimpleResponse<AdminUser>> {
    const { page = 1, limit = 20, search = '' } = params;
    
    console.log('🔍 SimplifiedAdminService.getUsers called with params:', params);
    
    // Retry logic with exponential backoff
    const maxRetries = 3;
    let lastError: any = null;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`📡 Attempt ${attempt}/${maxRetries} - Fetching users from Supabase...`);
        
        // Check authentication first
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) {
          console.error('❌ Authentication error:', authError);
          throw new Error(`Authentication failed: ${authError.message}`);
        }
        
        if (!user) {
          console.error('❌ No authenticated user found');
          throw new Error('User not authenticated');
        }
        
        console.log('✅ User authenticated:', user.id);

        const offset = (page - 1) * limit;

        let query = supabase
          .from('profiles')
          .select(`
            id, 
            display_name, 
            username, 
            user_type, 
            phone, 
            bio, 
            created_at,
            user_roles(role),
            establishments(name)
          `);

        // Add search filter if provided
        if (search) {
          console.log('🔍 Adding search filter:', search);
          query = query.or(`display_name.ilike.%${search}%,username.ilike.%${search}%`);
        }

        console.log('📊 Getting total count...');
        // Get total count with timeout
        const countPromise = supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        const countResult = await Promise.race([
          countPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Count query timeout')), 10000)
          )
        ]) as any;

        if (countResult.error) {
          console.error('❌ Error getting count:', countResult.error);
          throw new Error(`Count query failed: ${countResult.error.message}`);
        }

        console.log('📊 Total count retrieved:', countResult.count);

        console.log('📋 Getting paginated data...');
        // Get paginated data with timeout
        const dataPromise = query
          .range(offset, offset + limit - 1)
          .order('created_at', { ascending: false });

        const dataResult = await Promise.race([
          dataPromise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Data query timeout')), 15000)
          )
        ]) as any;

        if (dataResult.error) {
          console.error('❌ Error getting data:', dataResult.error);
          throw new Error(`Data query failed: ${dataResult.error.message}`);
        }

        console.log('✅ Data retrieved successfully:', dataResult.data?.length || 0, 'users');

        // Transform the data to include active roles and establishment name
        const transformedData = (dataResult.data || []).map((user: any) => {
          // Extract active roles from the user_roles array
          const activeRoles = user.user_roles?.filter((ur: any) => ur.role)?.map((ur: any) => ur.role) || [];
          
          // Get establishment name (first one if multiple)
          const establishmentName = user.establishments?.[0]?.name || null;
          
          return {
            ...user,
            active_roles: activeRoles,
            establishment_name: establishmentName,
            // Remove the nested objects to keep the interface clean
            user_roles: undefined,
            establishments: undefined
          };
        });

        const result = {
          data: transformedData,
          total: countResult.count || 0,
          page,
          limit
        };

        console.log('🎉 SimplifiedAdminService.getUsers completed successfully:', result);
        return result;

      } catch (error: any) {
        console.error(`❌ Attempt ${attempt} failed:`, error);
        lastError = error;
        
        // Don't retry on authentication errors
        if (error.message?.includes('Authentication') || error.message?.includes('not authenticated')) {
          throw error;
        }
        
        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          break;
        }
        
        // Exponential backoff: wait 1s, 2s, 4s
        const delay = Math.pow(2, attempt - 1) * 1000;
        console.log(`⏰ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    console.error('💥 All retry attempts failed, throwing last error:', lastError);
    throw lastError || new Error('Failed to fetch users after multiple attempts');
  }

  static async getUserById(id: string): Promise<AdminUser | null> {
    return null;
  }

  static async createUser(data: any): Promise<AdminUser | null> {
    return null;
  }

  static async updateUser(id: string, data: any): Promise<AdminUser | null> {
    return null;
  }

  static async deleteUser(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting user:', error);
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Error in deleteUser:', error);
      return false;
    }
  }

  // Establishments operations
  static async getEstablishments(params: SimpleQueryParams = {}): Promise<SimpleResponse<AdminEstablishment>> {
    return {
      data: [],
      total: 0,
      page: params.page || 1,
      limit: params.limit || 20
    };
  }

  static async getEstablishmentById(id: string): Promise<AdminEstablishment | null> {
    return null;
  }

  static async createEstablishment(data: any): Promise<AdminEstablishment | null> {
    return null;
  }

  static async updateEstablishment(id: string, data: any): Promise<AdminEstablishment | null> {
    return null;
  }

  static async deleteEstablishment(id: string): Promise<boolean> {
    return true;
  }

  // Cocktails operations
  static async getCocktails(params: SimpleQueryParams = {}): Promise<SimpleResponse<AdminCocktail>> {
    return {
      data: [],
      total: 0,
      page: params.page || 1,
      limit: params.limit || 20
    };
  }

  static async getCocktailById(id: string): Promise<AdminCocktail | null> {
    return null;
  }

  static async createCocktail(data: any): Promise<AdminCocktail | null> {
    return null;
  }

  static async updateCocktail(id: string, data: any): Promise<AdminCocktail | null> {
    return null;
  }

  static async deleteCocktail(id: string): Promise<boolean> {
    return true;
  }

  // Bulk operations
  static async bulkDelete(ids: string[], type: 'users' | 'establishments' | 'cocktails'): Promise<boolean> {
    try {
      switch (type) {
        case 'users':
          const { error: userError } = await supabase
            .from('profiles')
            .delete()
            .in('id', ids);
          if (userError) throw new Error(userError.message);
          break;
        case 'establishments':
          const { error: establishmentError } = await supabase
            .from('establishments')
            .delete()
            .in('id', ids);
          if (establishmentError) throw new Error(establishmentError.message);
          break;
        case 'cocktails':
          const { error: cocktailError } = await supabase
            .from('cocktails')
            .delete()
            .in('id', ids);
          if (cocktailError) throw new Error(cocktailError.message);
          break;
        default:
          throw new Error('Invalid type for bulk delete');
      }

      return true;
    } catch (error) {
      console.error('Error in bulkDelete:', error);
      return false;
    }
  }

  static async search(query: string, type: 'users' | 'establishments' | 'cocktails'): Promise<any[]> {
    return [];
  }
}
