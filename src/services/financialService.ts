import { supabase } from '@/integrations/supabase/client';
import { 
  PayoutRequest, 
  FinancialReport, 
  OrganizerTaxInfo,
  FeeCalculation 
} from '@/types/FinancialTypes';
import { toJsonCompatible } from '@/utils/typeGuards';

export async function createPayoutRequest(data: {
  event_id?: string;
  swig_circuit_id?: string;
  amount: number;
  payout_method: Record<string, any>;
  metadata?: Record<string, any>;
}): Promise<PayoutRequest> {
  // First calculate fees and taxes
  const feeCalc = await calculateFeesAndTaxes(data.amount);
  
  const { data: payout, error } = await supabase
    .from('payout_requests')
    .insert({
      organizer_id: (await supabase.auth.getUser()).data.user?.id,
      event_id: data.event_id,
      swig_circuit_id: data.swig_circuit_id,
      amount: data.amount,
      fees_deducted: feeCalc.total_fees,
      tax_withheld: feeCalc.tax_amount,
      net_amount: feeCalc.net_amount,
      payout_method: data.payout_method,
      metadata: data.metadata || {}
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to create payout request: ${error.message}`);
  return payout as PayoutRequest;
}

export async function getPayoutRequests(organizerId?: string): Promise<PayoutRequest[]> {
  let query = supabase
    .from('payout_requests')
    .select('*')
    .order('created_at', { ascending: false });

  if (organizerId) {
    query = query.eq('organizer_id', organizerId);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to fetch payout requests: ${error.message}`);
  return (data || []) as PayoutRequest[];
}

export async function updatePayoutRequestStatus(
  id: string, 
  status: PayoutRequest['status'],
  providerTransactionId?: string,
  failureReason?: string
): Promise<PayoutRequest> {
  const updateData: any = { 
    status,
    processed_at: ['completed', 'failed', 'cancelled'].includes(status) ? new Date().toISOString() : null
  };

  if (providerTransactionId) updateData.provider_transaction_id = providerTransactionId;
  if (failureReason) updateData.failure_reason = failureReason;

  const { data, error } = await supabase
    .from('payout_requests')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw new Error(`Failed to update payout request: ${error.message}`);
  return data as PayoutRequest;
}

export async function calculateFeesAndTaxes(
  amount: number, 
  region: string = 'US', 
  eventType?: string
): Promise<FeeCalculation> {
  const { data, error } = await supabase
    .rpc('calculate_fees_and_taxes', {
      p_amount: amount,
      p_region: region,
      p_event_type: eventType
    });

  if (error) throw new Error(`Failed to calculate fees: ${error.message}`);
  
  return {
    gross_amount: data[0].gross_amount,
    platform_fee: data[0].platform_fee,
    processing_fee: data[0].processing_fee,
    total_fees: data[0].total_fees,
    tax_amount: data[0].tax_amount,
    net_amount: data[0].net_amount
  };
}

export async function generateFinancialReport(
  organizerId: string,
  reportType: FinancialReport['report_type'],
  periodStart: string,
  periodEnd: string
): Promise<FinancialReport> {
  // Get all financial transactions for the period
  const { data: transactions, error: transError } = await supabase
    .from('financial_transactions')
    .select('*')
    .eq('user_id', organizerId)
    .gte('created_at', periodStart)
    .lte('created_at', periodEnd);

  if (transError) throw new Error(`Failed to fetch transactions: ${transError.message}`);

  // Calculate report metrics
  const reportData = {
    transactions: transactions || [],
    revenue_by_day: {},
    top_events: [],
    refund_rate: 0
  };

  const totalRevenue = transactions?.reduce((sum, t) => 
    t.transaction_type === 'ticket_sale' ? sum + t.amount : sum, 0) || 0;
  const totalFees = transactions?.reduce((sum, t) => sum + t.fee_amount, 0) || 0;
  const totalTaxes = transactions?.reduce((sum, t) => sum + t.tax_amount, 0) || 0;
  const ticketSalesCount = transactions?.filter(t => t.transaction_type === 'ticket_sale').length || 0;
  const refundsCount = transactions?.filter(t => t.transaction_type === 'refund').length || 0;

  // Get completed payouts
  const { data: payouts } = await supabase
    .from('payout_requests')
    .select('net_amount')
    .eq('organizer_id', organizerId)
    .eq('status', 'completed')
    .gte('processed_at', periodStart)
    .lte('processed_at', periodEnd);

  const payoutsCompleted = payouts?.reduce((sum, p) => sum + p.net_amount, 0) || 0;

  // Get pending payouts
  const { data: pendingPayouts } = await supabase
    .from('payout_requests')
    .select('net_amount')
    .eq('organizer_id', organizerId)
    .in('status', ['pending', 'processing']);

  const payoutsPending = pendingPayouts?.reduce((sum, p) => sum + p.net_amount, 0) || 0;

  const { data: report, error } = await supabase
    .from('financial_reports')
    .insert({
      organizer_id: organizerId,
      report_type: reportType,
      period_start: periodStart.split('T')[0],
      period_end: periodEnd.split('T')[0],
      total_revenue: totalRevenue,
      total_fees: totalFees,
      total_taxes: totalTaxes,
      net_earnings: totalRevenue - totalFees - totalTaxes,
      ticket_sales_count: ticketSalesCount,
      refunds_count: refundsCount,
      payouts_completed: payoutsCompleted,
      payouts_pending: payoutsPending,
      report_data: reportData
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to generate report: ${error.message}`);
  return report as FinancialReport;
}

export async function getFinancialReports(organizerId: string): Promise<FinancialReport[]> {
  const { data, error } = await supabase
    .from('financial_reports')
    .select('*')
    .eq('organizer_id', organizerId)
    .order('generated_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch financial reports: ${error.message}`);
  return (data || []) as FinancialReport[];
}

export async function getOrganizerTaxInfo(organizerId: string): Promise<OrganizerTaxInfo | null> {
  const { data, error } = await supabase
    .from('organizer_tax_info')
    .select('*')
    .eq('organizer_id', organizerId)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw new Error(`Failed to fetch tax info: ${error.message}`);
  }

  return data as OrganizerTaxInfo | null;
}

export async function updateOrganizerTaxInfo(
  organizerId: string,
  taxInfo: Partial<OrganizerTaxInfo>
): Promise<OrganizerTaxInfo> {
  // Ensure required fields are provided with defaults
  const updateData = {
    organizer_id: organizerId,
    region: taxInfo.region || 'US',
    country_code: taxInfo.country_code || 'US',
    tax_exempt: taxInfo.tax_exempt || false,
    verified: taxInfo.verified || false,
    address: toJsonCompatible(taxInfo.address || {}),
    ...taxInfo
  };

  const { data, error } = await supabase
    .from('organizer_tax_info')
    .upsert(updateData)
    .select()
    .single();

  if (error) throw new Error(`Failed to update tax info: ${error.message}`);
  return data as OrganizerTaxInfo;
}
