
import { BaseAdminService } from './BaseAdminService';
import { supabase } from '@/integrations/supabase/client';

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

export class AdminEstablishmentsService extends BaseAdminService<AdminEstablishment> {
  constructor() {
    super('establishments');
  }

  async getEstablishmentStats(id: string) {
    // Get cocktail count
    const { count: cocktailCount } = await supabase
      .from('cocktails')
      .select('*', { count: 'exact', head: true })
      .eq('establishment_id', id);

    // For reviews, we'll return 0 for now since we don't have a reviews table in the schema
    const reviewCount = 0;

    return {
      cocktailCount: cocktailCount || 0,
      reviewCount: reviewCount || 0
    };
  }

  async searchByLocation(lat: number, lng: number, radius: number = 10) {
    // This would require PostGIS extension for proper geo queries
    // For now, we'll do a simple bounding box search
    const latDelta = radius / 111; // Rough conversion: 1 degree ≈ 111 km
    const lngDelta = radius / (111 * Math.cos(lat * Math.PI / 180));

    const { data, error } = await supabase
      .from('establishments')
      .select('*')
      .gte('latitude', lat - latDelta)
      .lte('latitude', lat + latDelta)
      .gte('longitude', lng - lngDelta)
      .lte('longitude', lng + lngDelta);

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }
}

export const establishmentsService = new AdminEstablishmentsService();
