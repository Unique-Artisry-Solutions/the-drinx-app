
// Legacy base service - marked for deprecation
// Use SimplifiedAdminService for new implementations

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

/**
 * @deprecated Use SimplifiedAdminService instead
 * This class will be removed in a future version
 */
export class BaseAdminService<T = any> {
  protected tableName: string;

  constructor(tableName: string) {
    this.tableName = tableName;
    console.warn('BaseAdminService is deprecated. Use SimplifiedAdminService instead.');
  }

  async getAll(params: QueryParams = {}): Promise<PaginatedResponse<T>> {
    // Simplified mock implementation
    return {
      data: [] as T[],
      total: 0,
      page: params.page || 1,
      limit: params.limit || 20,
      totalPages: 0
    };
  }

  async getById(id: string): Promise<T | null> {
    return null;
  }

  async create(data: CreateDTO): Promise<T | null> {
    return null;
  }

  async update(id: string, data: UpdateDTO): Promise<T | null> {
    return null;
  }

  async delete(id: string): Promise<boolean> {
    return true;
  }

  async bulkDelete(ids: string[]): Promise<boolean> {
    return true;
  }

  async bulkUpdate(data: BulkUpdateDTO): Promise<boolean> {
    return true;
  }

  async search(params: SearchParams): Promise<T[]> {
    return [];
  }
}
