
import { supabase } from '@/integrations/supabase/client';
import { PricingRule } from '@/types/promotional';
import { 
  convertDatabasePricingRule, 
  filterValidPricingRules 
} from '@/types/promotional/TypeBridge';

export class PricingService {
  static async createRule(data: Omit<PricingRule, 'id' | 'created_at' | 'updated_at'>): Promise<PricingRule> {
    const { data: rule, error } = await supabase
      .from('pricing_rules')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create pricing rule: ${error.message}`);
    
    const convertedRule = convertDatabasePricingRule(rule);
    if (!convertedRule) {
      throw new Error('Failed to convert database rule to valid type');
    }
    
    return convertedRule;
  }

  static async getEventRules(eventId: string): Promise<PricingRule[]> {
    const { data, error } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('event_id', eventId)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (error) throw new Error(`Failed to fetch pricing rules: ${error.message}`);
    
    return filterValidPricingRules(data || []);
  }

  static async getCircuitRules(circuitId: string): Promise<PricingRule[]> {
    const { data, error } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('swig_circuit_id', circuitId)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (error) throw new Error(`Failed to fetch circuit pricing rules: ${error.message}`);
    
    return filterValidPricingRules(data || []);
  }

  static async updateRule(id: string, updates: Partial<PricingRule>): Promise<PricingRule> {
    const { data, error } = await supabase
      .from('pricing_rules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update pricing rule: ${error.message}`);
    
    const convertedRule = convertDatabasePricingRule(data);
    if (!convertedRule) {
      throw new Error('Failed to convert updated rule to valid type');
    }
    
    return convertedRule;
  }

  static async deleteRule(id: string): Promise<void> {
    const { error } = await supabase
      .from('pricing_rules')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete pricing rule: ${error.message}`);
  }

  static calculateAdjustedPrice(basePrice: number, rule: PricingRule): number {
    let adjustedPrice = basePrice;

    switch (rule.price_adjustment_type) {
      case 'percentage':
        adjustedPrice = basePrice * (1 + (rule.adjustment_value / 100));
        break;
      case 'fixed_amount':
        adjustedPrice = basePrice + rule.adjustment_value;
        break;
      case 'tier_based':
        // Implement tier-based logic based on conditions
        adjustedPrice = basePrice + rule.adjustment_value;
        break;
      default:
        adjustedPrice = basePrice;
    }

    // Apply min/max constraints
    if (rule.min_price !== null && adjustedPrice < rule.min_price) {
      adjustedPrice = rule.min_price;
    }
    if (rule.max_price !== null && adjustedPrice > rule.max_price) {
      adjustedPrice = rule.max_price;
    }

    return Math.round(adjustedPrice * 100) / 100; // Round to 2 decimal places
  }

  static async applyBestPricing(basePrice: number, eventId?: string, circuitId?: string): Promise<number> {
    const rules: PricingRule[] = [];
    
    if (eventId) {
      const eventRules = await this.getEventRules(eventId);
      rules.push(...eventRules);
    }
    
    if (circuitId) {
      const circuitRules = await this.getCircuitRules(circuitId);
      rules.push(...circuitRules);
    }

    if (rules.length === 0) {
      return basePrice;
    }

    // Apply rules in priority order and return the best price for the customer
    let bestPrice = basePrice;
    
    for (const rule of rules) {
      const adjustedPrice = this.calculateAdjustedPrice(basePrice, rule);
      if (adjustedPrice < bestPrice) {
        bestPrice = adjustedPrice;
      }
    }

    return bestPrice;
  }
}
