
import { format } from 'date-fns';
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";

// Types
export type ReportType = 'user_points' | 'reward_redemptions' | 'point_transactions' | 'tier_distribution';

export interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

export interface RecentExport {
  id: string;
  type: string;
  date: string;
  fileName: string;
}

export const reportTypes = [
  { value: 'user_points', label: 'User Points' },
  { value: 'reward_redemptions', label: 'Reward Redemptions' },
  { value: 'point_transactions', label: 'Point Transactions' },
  { value: 'tier_distribution', label: 'Tier Distribution' }
];

// Fetch preview data based on report type
export const fetchPreviewData = async (reportType: ReportType): Promise<any[]> => {
  let data = [];
  
  switch (reportType) {
    case 'user_points':
      const { data: userPoints, error: userError } = await supabase
        .from('user_rewards')
        .select('user_id, points, lifetime_points')
        .limit(5);
      
      if (userError) throw userError;
      data = userPoints;
      break;
      
    case 'reward_redemptions':
      const { data: redemptions, error: redemptionError } = await supabase
        .from('reward_redemptions')
        .select('id, user_id, offering_id, points_spent, created_at')
        .limit(5);
      
      if (redemptionError) throw redemptionError;
      data = redemptions;
      break;
      
    case 'point_transactions':
      const { data: transactions, error: transactionError } = await supabase
        .from('reward_transactions')
        .select('id, user_id, points, transaction_type, source, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (transactionError) throw transactionError;
      data = transactions;
      break;
      
    case 'tier_distribution':
      data = [
        { tier: 'Tier 1', user_count: 156, percentage: '62.4%' },
        { tier: 'Tier 2', user_count: 67, percentage: '26.8%' },
        { tier: 'Tier 3', user_count: 27, percentage: '10.8%' }
      ];
      break;
  }
  
  return data;
};

// Export data to CSV
export const exportReportData = async (reportType: ReportType) => {
  try {
    let data;
    let fileName;
    
    switch (reportType) {
      case 'user_points':
        const { data: userPoints, error: userError } = await supabase
          .from('user_rewards')
          .select('*');
        
        if (userError) throw userError;
        data = userPoints;
        fileName = `user_points_export_${format(new Date(), 'yyyyMMdd')}.csv`;
        break;
        
      default:
        // For other report types (would be expanded based on actual requirements)
        throw new Error("Export for this report type is not fully implemented");
    }
    
    if (!data || !data.length) {
      throw new Error("No data available to export");
    }
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => Object.values(row).map(value => String(value || '')).join(','));
    const csvContent = [headers, ...rows].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return {
      fileName,
      type: reportTypes.find(t => t.value === reportType)?.label || reportType
    };
  } catch (error) {
    console.error("Error exporting report:", error);
    throw error;
  }
};
