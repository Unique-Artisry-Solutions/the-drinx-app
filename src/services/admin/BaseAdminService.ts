
import { supabase } from '@/integrations/supabase/client';

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

export class BaseAdminService<T extends Record<string, any>> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getAll(params: QueryParams = {}): Promise<PaginatedResponse<T>> {
    const { page = 1, limit = 20, sortBy, sortOrder = 'desc', search, filters } = params;
    const offset = (page - 1) * limit;

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
  }

  async getById(id: string): Promise<T | null> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data as T;
  }

  async create(data: CreateDTO): Promise<T> {
    const { data: result, error } = await supabase
      .from(this.tableName)
      .insert(data)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return result as T;
  }

  async update(id: string, data: UpdateDTO): Promise<T> {
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
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }

  async bulkDelete(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .in('id', ids);

    if (error) {
      throw new Error(error.message);
    }
  }

  async bulkUpdate(data: BulkUpdateDTO): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .update(data.data)
      .in('id', data.ids);

    if (error) {
      throw new Error(error.message);
    }
  }

  async search(params: SearchParams): Promise<T[]> {
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
  }
}
