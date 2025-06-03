
export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateDTO {
  [key: string]: any;
}

export interface UpdateDTO {
  [key: string]: any;
}

export interface BulkUpdateDTO {
  ids: string[];
  data: UpdateDTO;
}

export interface SearchParams {
  query: string;
  fields?: string[];
}

export interface FilterParams {
  [key: string]: any;
}

// Simplified base class to avoid type recursion
export class BaseAdminService<T = Record<string, any>> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getAll(params: QueryParams = {}): Promise<PaginatedResponse<T>> {
    const { page = 1, limit = 20, sortBy, sortOrder = 'desc', search, filters } = params;
    const offset = (page - 1) * limit;

    try {
      // Use dynamic import to avoid typing issues
      const { supabase } = await import('@/integrations/supabase/client');
      
      let query = supabase
        .from(this.tableName)
        .select('*', { count: 'exact' });

      if (search) {
        // Simple search implementation - can be overridden in child classes
        query = query.ilike('name', `%${search}%`);
      }

      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            query = query.eq(key, value);
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
        data: (data || []) as T[],
        total: count || 0,
        page,
        limit,
        totalPages: Math.ceil((count || 0) / limit)
      };
    } catch (error) {
      console.error('Error in getAll:', error);
      return {
        data: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    }
  }

  async getById(id: string): Promise<T | null> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data, error } = await supabase
        .from(this.tableName)
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as T;
    } catch (error) {
      console.error('Error in getById:', error);
      return null;
    }
  }

  async create(data: CreateDTO): Promise<T | null> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data: result, error } = await supabase
        .from(this.tableName)
        .insert(data)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return result as T;
    } catch (error) {
      console.error('Error in create:', error);
      return null;
    }
  }

  async update(id: string, data: UpdateDTO): Promise<T | null> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { data: result, error } = await supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return result as T;
    } catch (error) {
      console.error('Error in update:', error);
      return null;
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Error in delete:', error);
      return false;
    }
  }

  async bulkDelete(ids: string[]): Promise<boolean> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .in('id', ids);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Error in bulkDelete:', error);
      return false;
    }
  }

  async bulkUpdate(data: BulkUpdateDTO): Promise<boolean> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      
      const { error } = await supabase
        .from(this.tableName)
        .update(data.data)
        .in('id', data.ids);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Error in bulkUpdate:', error);
      return false;
    }
  }

  async search(params: SearchParams): Promise<T[]> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { query, fields = ['name'] } = params;
      
      let supabaseQuery = supabase.from(this.tableName).select('*');
      
      // Simple OR search across specified fields
      const orConditions = fields.map(field => `${field}.ilike.%${query}%`).join(',');
      supabaseQuery = supabaseQuery.or(orConditions);

      const { data, error } = await supabaseQuery;

      if (error) {
        throw new Error(error.message);
      }

      return (data || []) as T[];
    } catch (error) {
      console.error('Error in search:', error);
      return [];
    }
  }
}
