export const safeJsonParse = (str: string | null | undefined): any => {
  try {
    if (!str) return null;
    return JSON.parse(str);
  } catch (e) {
    console.error("Failed to parse JSON", str, e);
    return null;
  }
};

export const safeJsonStringify = (obj: any): string | null => {
  try {
    if (!obj) return null;
    return JSON.stringify(obj);
  } catch (e) {
    console.error("Failed to stringify JSON", obj, e);
    return null;
  }
};

export const safeJsonToRecord = <T extends Record<string, any>>(
  json: string | null | undefined | Record<string, any>,
  defaultRecord: T
): T => {
  try {
    if (!json) return defaultRecord;

    let parsed: Record<string, any>;

    if (typeof json === 'string') {
      parsed = JSON.parse(json);
    } else if (typeof json === 'object') {
      parsed = json;
    } else {
      return defaultRecord;
    }

    return { ...defaultRecord, ...parsed };
  } catch (e) {
    console.error("Failed to convert JSON to record", json, e);
    return defaultRecord;
  }
};

// Add the adapter function for ReferralSource objects
export const adaptReferralSource = (source: any): { name: string; visits: number; percentage?: number } => {
  if (!source) return { name: 'Unknown', visits: 0 };
  
  return {
    name: source.name || source.source || 'Unknown',
    visits: source.visits || source.count || 0,
    percentage: source.percentage || 0
  };
};

// Add the adapter function for ticket analytics data
export const adaptToTicketAnalyticsData = (source: any): { typeName: string; sold: number; percentage: number } => {
  if (!source) return { typeName: 'Unknown', sold: 0, percentage: 0 };
  
  return {
    typeName: source.name || source.source || source.typeName || 'Unknown',
    sold: source.visits || source.count || source.sold || 0,
    percentage: source.percentage || 0
  };
};
