
/**
 * Generic repository interface for database operations
 */
export interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findOne(filter: Record<string, any>): Promise<T | null>;
  findMany(filter?: Record<string, any>): Promise<T[]>;
  create(data: Partial<T>): Promise<T>;
  update(id: string, data: Partial<T>): Promise<T | null>;
  delete(id: string): Promise<boolean>;
}

/**
 * Base entity interface with common properties
 */
export interface BaseEntity {
  id: string;
  created_at?: string;
}

/**
 * Repository factory interface
 */
export interface RepositoryFactory {
  getRepository<T extends BaseEntity>(name: string): Repository<T>;
}
