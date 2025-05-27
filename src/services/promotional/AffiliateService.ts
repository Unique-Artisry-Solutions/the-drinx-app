
import { supabase } from '@/integrations/supabase/client';
import { AffiliateProgram, AffiliatePartner, AffiliateTrackingLink, AffiliateCommission, AffiliatePayout } from '@/types/promotional';

export class AffiliateService {
  // Affiliate Programs
  static async createProgram(data: Omit<AffiliateProgram, 'id' | 'created_at' | 'updated_at'>): Promise<AffiliateProgram> {
    const { data: program, error } = await supabase
      .from('affiliate_programs')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create affiliate program: ${error.message}`);
    return program;
  }

  static async getPromoterPrograms(promoterId: string): Promise<AffiliateProgram[]> {
    const { data, error } = await supabase
      .from('affiliate_programs')
      .select('*')
      .eq('promoter_id', promoterId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch affiliate programs: ${error.message}`);
    return data || [];
  }

  static async updateProgram(id: string, updates: Partial<AffiliateProgram>): Promise<AffiliateProgram> {
    const { data, error } = await supabase
      .from('affiliate_programs')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update affiliate program: ${error.message}`);
    return data;
  }

  // Affiliate Partners
  static async createPartner(data: Omit<AffiliatePartner, 'id' | 'created_at' | 'updated_at'>): Promise<AffiliatePartner> {
    const { data: partner, error } = await supabase
      .from('affiliate_partners')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create affiliate partner: ${error.message}`);
    return partner;
  }

  static async getProgramPartners(programId: string): Promise<AffiliatePartner[]> {
    const { data, error } = await supabase
      .from('affiliate_partners')
      .select('*')
      .eq('affiliate_program_id', programId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch affiliate partners: ${error.message}`);
    return data || [];
  }

  static async approvePartner(partnerId: string): Promise<AffiliatePartner> {
    const { data, error } = await supabase
      .from('affiliate_partners')
      .update({ 
        status: 'approved', 
        approved_at: new Date().toISOString() 
      })
      .eq('id', partnerId)
      .select()
      .single();

    if (error) throw new Error(`Failed to approve affiliate partner: ${error.message}`);
    return data;
  }

  // Tracking Links
  static async createTrackingLink(data: Omit<AffiliateTrackingLink, 'id' | 'created_at' | 'updated_at'>): Promise<AffiliateTrackingLink> {
    const { data: link, error } = await supabase
      .from('affiliate_tracking_links')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create tracking link: ${error.message}`);
    return link;
  }

  static async getPartnerLinks(partnerId: string): Promise<AffiliateTrackingLink[]> {
    const { data, error } = await supabase
      .from('affiliate_tracking_links')
      .select('*')
      .eq('affiliate_partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch tracking links: ${error.message}`);
    return data || [];
  }

  static async trackClick(trackingCode: string): Promise<void> {
    const { error } = await supabase
      .from('affiliate_tracking_links')
      .update({ 
        click_count: supabase.raw('click_count + 1') 
      })
      .eq('tracking_code', trackingCode);

    if (error) throw new Error(`Failed to track click: ${error.message}`);
  }

  // Commissions
  static async createCommission(data: Omit<AffiliateCommission, 'id' | 'created_at' | 'updated_at'>): Promise<AffiliateCommission> {
    const { data: commission, error } = await supabase
      .from('affiliate_commissions')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create commission: ${error.message}`);
    return commission;
  }

  static async getPartnerCommissions(partnerId: string): Promise<AffiliateCommission[]> {
    const { data, error } = await supabase
      .from('affiliate_commissions')
      .select('*')
      .eq('affiliate_partner_id', partnerId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch commissions: ${error.message}`);
    return data || [];
  }

  // Generate unique tracking code
  static generateTrackingCode(): string {
    return `aff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Generate unique affiliate code
  static generateAffiliateCode(): string {
    return `AF${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
  }
}
