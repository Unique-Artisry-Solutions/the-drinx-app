
import { supabase } from '@/integrations/supabase/client';

export interface TicketSalesData {
  ticket_type_id: string;
  ticket_type_name: string;
  price: number;
  quantity_sold: number;
  revenue: number;
  remaining: number;
}

export interface RevenueMetrics {
  total_revenue: number;
  tickets_sold: number;
  average_ticket_price: number;
  conversion_rate: number;
  daily_sales: Array<{ date: string; revenue: number; tickets: number }>;
  ticket_type_breakdown: TicketSalesData[];
}

export interface SalesAnalytics {
  event_id: string;
  revenue_metrics: RevenueMetrics;
  sales_trends: Array<{ date: string; amount: number }>;
  top_selling_tickets: TicketSalesData[];
}

export async function getEventTicketSales(eventId: string): Promise<TicketSalesData[]> {
  try {
    // Get ticket types with sales data
    const { data: ticketTypes, error: typesError } = await supabase
      .from('event_ticket_types')
      .select('*')
      .eq('event_id', eventId);

    if (typesError) throw typesError;

    // Get attendee counts by ticket type
    const { data: attendees, error: attendeesError } = await supabase
      .from('event_attendees')
      .select('ticket_type_id')
      .eq('event_id', eventId)
      .eq('status', 'registered');

    if (attendeesError) throw attendeesError;

    // Count sales by ticket type
    const salesCounts: Record<string, number> = {};
    (attendees || []).forEach(attendee => {
      if (attendee.ticket_type_id) {
        salesCounts[attendee.ticket_type_id] = (salesCounts[attendee.ticket_type_id] || 0) + 1;
      }
    });

    return (ticketTypes || []).map(ticket => {
      const sold = salesCounts[ticket.id] || 0;
      return {
        ticket_type_id: ticket.id,
        ticket_type_name: ticket.name,
        price: ticket.price,
        quantity_sold: sold,
        revenue: sold * ticket.price,
        remaining: Math.max(0, ticket.quantity - sold)
      };
    });
  } catch (error) {
    console.error('Failed to fetch ticket sales:', error);
    return [];
  }
}

export async function getEventRevenueMetrics(eventId: string): Promise<RevenueMetrics> {
  try {
    const ticketSales = await getEventTicketSales(eventId);
    
    const totalRevenue = ticketSales.reduce((sum, ticket) => sum + ticket.revenue, 0);
    const totalTicketsSold = ticketSales.reduce((sum, ticket) => sum + ticket.quantity_sold, 0);
    const averageTicketPrice = totalTicketsSold > 0 ? totalRevenue / totalTicketsSold : 0;

    // Get daily sales data for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const { data: dailySales, error } = await supabase
      .from('event_attendees')
      .select('purchase_date, ticket_type_id')
      .eq('event_id', eventId)
      .gte('purchase_date', thirtyDaysAgo.toISOString());

    if (error) throw error;

    // Group sales by date
    const salesByDate: Record<string, { revenue: number; tickets: number }> = {};
    
    (dailySales || []).forEach(sale => {
      const date = new Date(sale.purchase_date).toISOString().split('T')[0];
      const ticket = ticketSales.find(t => t.ticket_type_id === sale.ticket_type_id);
      const price = ticket?.price || 0;
      
      if (!salesByDate[date]) {
        salesByDate[date] = { revenue: 0, tickets: 0 };
      }
      
      salesByDate[date].revenue += price;
      salesByDate[date].tickets += 1;
    });

    const dailySalesArray = Object.entries(salesByDate)
      .map(([date, data]) => ({ date, ...data }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return {
      total_revenue: totalRevenue,
      tickets_sold: totalTicketsSold,
      average_ticket_price: averageTicketPrice,
      conversion_rate: 0, // Would need page view data to calculate
      daily_sales: dailySalesArray,
      ticket_type_breakdown: ticketSales
    };
  } catch (error) {
    console.error('Failed to fetch revenue metrics:', error);
    return {
      total_revenue: 0,
      tickets_sold: 0,
      average_ticket_price: 0,
      conversion_rate: 0,
      daily_sales: [],
      ticket_type_breakdown: []
    };
  }
}

export async function getEventSalesAnalytics(eventId: string): Promise<SalesAnalytics> {
  try {
    const revenueMetrics = await getEventRevenueMetrics(eventId);
    
    // Get sales trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const salesTrends = revenueMetrics.daily_sales
      .filter(sale => new Date(sale.date) >= sevenDaysAgo)
      .map(sale => ({ date: sale.date, amount: sale.revenue }));

    // Get top selling tickets
    const topSellingTickets = [...revenueMetrics.ticket_type_breakdown]
      .sort((a, b) => b.quantity_sold - a.quantity_sold)
      .slice(0, 5);

    return {
      event_id: eventId,
      revenue_metrics: revenueMetrics,
      sales_trends: salesTrends,
      top_selling_tickets: topSellingTickets
    };
  } catch (error) {
    console.error('Failed to fetch sales analytics:', error);
    return {
      event_id: eventId,
      revenue_metrics: {
        total_revenue: 0,
        tickets_sold: 0,
        average_ticket_price: 0,
        conversion_rate: 0,
        daily_sales: [],
        ticket_type_breakdown: []
      },
      sales_trends: [],
      top_selling_tickets: []
    };
  }
}

export async function updateTicketInventory(
  ticketTypeId: string,
  quantitySold: number
): Promise<void> {
  try {
    // Get current ticket type data
    const { data: ticketType, error: fetchError } = await supabase
      .from('event_ticket_types')
      .select('quantity')
      .eq('id', ticketTypeId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch ticket type: ${fetchError.message}`);
    }

    if (ticketType) {
      const newQuantity = Math.max(0, ticketType.quantity - quantitySold);
      
      const { error: updateError } = await supabase
        .from('event_ticket_types')
        .update({ quantity: newQuantity })
        .eq('id', ticketTypeId);

      if (updateError) {
        throw new Error(`Failed to update ticket inventory: ${updateError.message}`);
      }
    }
  } catch (error) {
    console.error('Failed to update ticket inventory:', error);
    throw new Error('Failed to update ticket inventory');
  }
}

export function subscribeToTicketSales(
  eventId: string,
  callback: (data: SalesAnalytics) => void
): () => void {
  const channel = supabase
    .channel(`ticket-sales-${eventId}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'event_attendees',
        filter: `event_id=eq.${eventId}`
      },
      async () => {
        // Refresh sales data when new attendees are added
        const data = await getEventSalesAnalytics(eventId);
        callback(data);
      }
    )
    .subscribe();

  // Initial load
  getEventSalesAnalytics(eventId).then(callback);

  // Cleanup function
  return () => {
    supabase.removeChannel(channel);
  };
}
