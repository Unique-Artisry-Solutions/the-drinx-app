
import { BaseAdminService } from './BaseAdminService';

export interface AdminEstablishment {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website_url?: string;
  image_url?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at: string;
  cocktailCount?: number;
}

/**
 * @deprecated Use SimplifiedAdminService instead
 * This service will be removed in a future version
 */
export class AdminEstablishmentsService extends BaseAdminService<AdminEstablishment> {
  constructor() {
    super('establishments');
    console.warn('AdminEstablishmentsService is deprecated. Use SimplifiedAdminService instead.');
  }

  async getEstablishmentStats(id: string) {
    return {
      cocktailCount: 0,
      reviewCount: 0
    };
  }

  async searchByLocation(lat: number, lng: number, radius: number = 10) {
    return [];
  }
}

export const establishmentsService = new AdminEstablishmentsService();
