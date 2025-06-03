
import { supabase } from '@/lib/supabase';

export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateDTO<T> extends Omit<T, 'id' | 'created_at' | 'updated_at'> {}
export interface UpdateDTO<T> extends Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>> {}

export interface BulkUpdateDTO<T> {
  id: string;
  data: UpdateDTO<T>;
}

export interface SearchParams {
  query: string;
  fields: string[];
  limit?: number;
}

export interface FilterParams {
  [key: string]: any;
}

export abstract class BaseAdminService<T extends { id: string }> {
  protected tableName: string;
  protected cache = new Map<string, { data: any; expiry: Date }>();
  protected cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor(tableName: string) {
    this.tableName = tableName;
  }

  async getAll(params: QueryParams = {}): Promise<PaginatedResponse<T>> {
    const { page = 1, limit = 20, sortBy, sortOrder = 'desc', filters } = params;
    const offset = (page - 1) * limit;

    let query = supabase
      .from(this.tableName)
      .select('*', { count: 'exact' });

    // Apply filters
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });
    }

    // Apply sorting
    if (sortBy) {
      query = query.order(sortBy, { ascending: sortOrder === 'asc' });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
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
  }

  async getById(id: string): Promise<T> {
    const cacheKey = `${this.tableName}:${id}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && cached.expiry > new Date()) {
      return cached.data;
    }

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    // Cache the result
    this.cache.set(cacheKey, {
      data,
      expiry: new Date(Date.now() + this.cacheTimeout)
    });

    return data;
  }

  async create(createData: CreateDTO<T>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(createData)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    this.invalidateCache();
    return data;
  }

  async update(id: string, updateData: UpdateDTO<T>): Promise<T> {
    const { data, error } = await supabase
      .from(this.tableName)
      .update({ ...updateData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    this.invalidateCache(id);
    return data;
  }

  async delete(id: string): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }

    this.invalidateCache(id);
  }

  async bulkCreate(items: CreateDTO<T>[]): Promise<T[]> {
    const { data, error } = await supabase
      .from(this.tableName)
      .insert(items)
      .select();

    if (error) {
      throw new Error(error.message);
    }

    this.invalidateCache();
    return data;
  }

  async bulkUpdate(updates: BulkUpdateDTO<T>[]): Promise<T[]> {
    const results: T[] = [];

    for (const { id, data: updateData } of updates) {
      const result = await this.update(id, updateData);
      results.push(result);
    }

    return results;
  }

  async bulkDelete(ids: string[]): Promise<void> {
    const { error } = await supabase
      .from(this.tableName)
      .delete()
      .in('id', ids);

    if (error) {
      throw new Error(error.message);
    }

    ids.forEach(id => this.invalidateCache(id));
  }

  async search(searchParams: SearchParams): Promise<PaginatedResponse<T>> {
    const { query, fields, limit = 20 } = searchParams;
    
    let supabaseQuery = supabase
      .from(this.tableName)
      .select('*', { count: 'exact' });

    // Apply text search across specified fields
    if (fields.length > 0) {
      const searchConditions = fields.map(field => `${field}.ilike.%${query}%`).join(',');
      supabaseQuery = supabaseQuery.or(searchConditions);
    }

    supabaseQuery = supabaseQuery.limit(limit);

    const { data, error, count } = await supabaseQuery;

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: data || [],
      total: count || 0,
      page: 1,
      limit,
      totalPages: Math.ceil((count || 0) / limit)
    };
  }

  async export(format: 'csv' | 'json', filters?: FilterParams): Promise<Blob> {
    let query = supabase.from(this.tableName).select('*');

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });
    }

    const { data, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    if (format === 'csv') {
      const csv = this.convertToCSV(data || []);
      return new Blob([csv], { type: 'text/csv' });
    } else {
      return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    }
  }

  subscribe(callback: (data: T[]) => void): () => void {
    const channel = supabase
      .channel(`${this.tableName}-changes`)
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: this.tableName },
        () => {
          // Refresh data when changes occur
          this.getAll().then(response => callback(response.data));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  protected invalidateCache(id?: string): void {
    if (id) {
      this.cache.delete(`${this.tableName}:${id}`);
    } else {
      this.cache.clear();
    }
  }

  private convertToCSV(data: any[]): string {
    if (!data.length) return '';

    const headers = Object.keys(data[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = data.map(row => 
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' && value.includes(',') 
          ? `"${value}"` 
          : value;
      }).join(',')
    );

    return [csvHeaders, ...csvRows].join('\n');
  }
}
