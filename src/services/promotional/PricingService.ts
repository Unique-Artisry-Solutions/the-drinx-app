
import { supabase } from '@/integrations/supabase/client';
import { PricingRule, DemandMetrics, PriceHistory, PricingAutomation } from '@/types/promotional';

export class PricingService {
  // Pricing Rules
  static async createRule(data: Omit<PricingRule, 'id' | 'created_at' | 'updated_at'>): Promise<PricingRule> {
    const { data: rule, error } = await supabase
      .from('pricing_rules')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create pricing rule: ${error.message}`);
    return rule;
  }

  static async getPromoterRules(promoterId: string): Promise<PricingRule[]> {
    const { data, error } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('promoter_id', promoterId)
      .order('priority', { ascending: false });

    if (error) throw new Error(`Failed to fetch pricing rules: ${error.message}`);
    return data || [];
  }

  static async getEventRules(eventId: string): Promise<PricingRule[]> {
    const { data, error } = await supabase
      .from('pricing_rules')
      .select('*')
      .eq('event_id', eventId)
      .eq('is_active', true)
      .order('priority', { ascending: false });

    if (error) throw new Error(`Failed to fetch event pricing rules: ${error.message}`);
    return data || [];
  }

  static async updateRule(id: string, updates: Partial<PricingRule>): Promise<PricingRule> {
    const { data, error } = await supabase
      .from('pricing_rules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(`Failed to update pricing rule: ${error.message}`);
    return data;
  }

  // Demand Metrics
  static async recordDemandMetrics(data: Omit<DemandMetrics, 'id' | 'created_at' | 'updated_at'>): Promise<DemandMetrics> {
    const { data: metrics, error } = await supabase
      .from('demand_metrics')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to record demand metrics: ${error.message}`);
    return metrics;
  }

  static async getDemandMetrics(eventId?: string, swigCircuitId?: string, days: number = 7): Promise<DemandMetrics[]> {
    let query = supabase
      .from('demand_metrics')
      .select('*')
      .gte('metric_date', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
      .order('metric_date', { ascending: false });

    if (eventId) {
      query = query.eq('event_id', eventId);
    } else if (swigCircuitId) {
      query = query.eq('swig_circuit_id', swigCircuitId);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to fetch demand metrics: ${error.message}`);
    return data || [];
  }

  static async calculateDemandScore(eventId?: string, swigCircuitId?: string): Promise<number> {
    const metrics = await this.getDemandMetrics(eventId, swigCircuitId, 1);
    const todayMetrics = metrics[0];

    if (!todayMetrics) return 0;

    // Calculate demand score based on various factors
    const viewToInquiryRate = todayMetrics.page_views > 0 ? todayMetrics.ticket_inquiries / todayMetrics.page_views : 0;
    const cartConversionRate = todayMetrics.cart_additions > 0 ? (todayMetrics.cart_additions - todayMetrics.cart_abandonments) / todayMetrics.cart_additions : 0;
    const velocityScore = Math.min(todayMetrics.sales_velocity * 10, 100); // Normalize sales velocity

    const demandScore = (viewToInquiryRate * 30) + (cartConversionRate * 40) + (velocityScore * 30);
    
    // Update the demand score in the database
    await supabase
      .from('demand_metrics')
      .update({ demand_score: demandScore })
      .eq('id', todayMetrics.id);

    return Math.min(Math.max(demandScore, 0), 100); // Clamp between 0-100
  }

  // Price History
  static async recordPriceChange(data: Omit<PriceHistory, 'id' | 'created_at'>): Promise<PriceHistory> {
    const { data: priceChange, error } = await supabase
      .from('price_history')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to record price change: ${error.message}`);
    return priceChange;
  }

  static async getPriceHistory(pricingTierId: string): Promise<PriceHistory[]> {
    const { data, error } = await supabase
      .from('price_history')
      .select('*')
      .eq('pricing_tier_id', pricingTierId)
      .order('effective_at', { ascending: false });

    if (error) throw new Error(`Failed to fetch price history: ${error.message}`);
    return data || [];
  }

  // Pricing Automations
  static async createAutomation(data: Omit<PricingAutomation, 'id' | 'created_at' | 'updated_at'>): Promise<PricingAutomation> {
    const { data: automation, error } = await supabase
      .from('pricing_automations')
      .insert(data)
      .select()
      .single();

    if (error) throw new Error(`Failed to create pricing automation: ${error.message}`);
    return automation;
  }

  static async getActiveAutomations(): Promise<PricingAutomation[]> {
    const { data, error } = await supabase
      .from('pricing_automations')
      .select('*, pricing_rules(*)')
      .eq('is_active', true);

    if (error) throw new Error(`Failed to fetch active automations: ${error.message}`);
    return data || [];
  }

  static async triggerAutomation(automationId: string): Promise<void> {
    const { error } = await supabase
      .from('pricing_automations')
      .update({
        last_triggered: new Date().toISOString(),
        trigger_count: supabase.raw('trigger_count + 1')
      })
      .eq('id', automationId);

    if (error) throw new Error(`Failed to trigger automation: ${error.message}`);
  }

  // Price calculation based on rules
  static async calculateOptimalPrice(
    basePrice: number, 
    eventId?: string, 
    swigCircuitId?: string
  ): Promise<{ newPrice: number; appliedRules: PricingRule[] }> {
    const rules = eventId 
      ? await this.getEventRules(eventId)
      : await supabase.from('pricing_rules').select('*').eq('swig_circuit_id', swigCircuitId).eq('is_active', true);

    let newPrice = basePrice;
    const appliedRules: PricingRule[] = [];

    for (const rule of rules.data || []) {
      const shouldApply = await this.evaluateRuleConditions(rule, eventId, swigCircuitId);
      
      if (shouldApply) {
        if (rule.price_adjustment_type === 'percentage') {
          newPrice *= (1 + rule.price_adjustment_value / 100);
        } else {
          newPrice += rule.price_adjustment_value;
        }

        // Apply min/max constraints
        if (rule.min_price && newPrice < rule.min_price) newPrice = rule.min_price;
        if (rule.max_price && newPrice > rule.max_price) newPrice = rule.max_price;

        appliedRules.push(rule);
      }
    }

    return { newPrice: Math.round(newPrice * 100) / 100, appliedRules };
  }

  private static async evaluateRuleConditions(
    rule: PricingRule, 
    eventId?: string, 
    swigCircuitId?: string
  ): Promise<boolean> {
    const now = new Date();
    const conditions = rule.conditions;

    // Time-based conditions
    if (rule.rule_type === 'time_based' || rule.rule_type === 'combined') {
      if (conditions.start_time && now < new Date(conditions.start_time)) return false;
      if (conditions.end_time && now > new Date(conditions.end_time)) return false;
    }

    // Demand-based conditions
    if (rule.rule_type === 'demand_based' || rule.rule_type === 'combined') {
      const demandScore = await this.calculateDemandScore(eventId, swigCircuitId);
      if (conditions.min_demand_score && demandScore < conditions.min_demand_score) return false;
      if (conditions.max_demand_score && demandScore > conditions.max_demand_score) return false;
    }

    // Inventory-based conditions
    if (rule.rule_type === 'inventory_based' || rule.rule_type === 'combined') {
      // This would require integration with ticket inventory system
      // For now, we'll assume it passes
    }

    return true;
  }
}
