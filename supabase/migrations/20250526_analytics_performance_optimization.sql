
-- Create indexes for analytics performance optimization
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_user_timestamp 
ON analytics_events (user_id, timestamp DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_analytics_events_type_timestamp 
ON analytics_events (event_type, timestamp DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reward_transactions_user_created 
ON reward_transactions (user_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_reward_transactions_establishment_created 
ON reward_transactions (establishment_id, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_event_attendees_event_status 
ON event_attendees (event_id, status);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_promoter_campaign_analytics_promoter_date 
ON promoter_campaign_analytics (promoter_id, date DESC);

-- Create materialized view for real-time analytics
CREATE MATERIALIZED VIEW IF NOT EXISTS real_time_analytics_summary AS
SELECT 
  DATE_TRUNC('hour', timestamp) as hour,
  COUNT(DISTINCT user_id) as active_users,
  COUNT(*) as page_views,
  COUNT(CASE WHEN event_type = 'conversion' THEN 1 END) as conversions,
  SUM(CASE WHEN event_data->>'revenue' IS NOT NULL THEN (event_data->>'revenue')::numeric ELSE 0 END) as revenue,
  COUNT(CASE WHEN event_type = 'event_track' THEN 1 END) as event_count,
  ROUND(AVG(CASE WHEN event_data->>'engagement_score' IS NOT NULL THEN (event_data->>'engagement_score')::numeric ELSE 0 END), 2) as user_engagement
FROM analytics_events 
WHERE timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY DATE_TRUNC('hour', timestamp)
ORDER BY hour DESC;

-- Create unique index on materialized view
CREATE UNIQUE INDEX IF NOT EXISTS idx_real_time_analytics_summary_hour 
ON real_time_analytics_summary (hour);

-- Create materialized view for trend analysis
CREATE MATERIALIZED VIEW IF NOT EXISTS trend_analysis_summary AS
SELECT 
  DATE_TRUNC('day', timestamp) as date,
  event_type as metric_type,
  COUNT(*) as value,
  COUNT(DISTINCT user_id) as unique_users,
  CASE 
    WHEN LAG(COUNT(*)) OVER (PARTITION BY event_type ORDER BY DATE_TRUNC('day', timestamp)) IS NULL THEN 'stable'
    WHEN COUNT(*) > LAG(COUNT(*)) OVER (PARTITION BY event_type ORDER BY DATE_TRUNC('day', timestamp)) * 1.1 THEN 'up'
    WHEN COUNT(*) < LAG(COUNT(*)) OVER (PARTITION BY event_type ORDER BY DATE_TRUNC('day', timestamp)) * 0.9 THEN 'down'
    ELSE 'stable'
  END as trend,
  CASE 
    WHEN LAG(COUNT(*)) OVER (PARTITION BY event_type ORDER BY DATE_TRUNC('day', timestamp)) IS NULL THEN 0
    ELSE ROUND(((COUNT(*) - LAG(COUNT(*)) OVER (PARTITION BY event_type ORDER BY DATE_TRUNC('day', timestamp))) * 100.0 / 
                 NULLIF(LAG(COUNT(*)) OVER (PARTITION BY event_type ORDER BY DATE_TRUNC('day', timestamp)), 0)), 2)
  END as change_percentage
FROM analytics_events 
WHERE timestamp >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', timestamp), event_type
ORDER BY date DESC, event_type;

-- Create unique index on trend analysis view
CREATE UNIQUE INDEX IF NOT EXISTS idx_trend_analysis_summary_date_type 
ON trend_analysis_summary (date, metric_type);

-- Function to refresh materialized views
CREATE OR REPLACE FUNCTION refresh_analytics_materialized_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY real_time_analytics_summary;
  REFRESH MATERIALIZED VIEW CONCURRENTLY trend_analysis_summary;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION refresh_analytics_materialized_views() TO authenticated;
GRANT EXECUTE ON FUNCTION refresh_analytics_materialized_views() TO service_role;

-- Create function to get cached real-time metrics
CREATE OR REPLACE FUNCTION get_cached_real_time_metrics()
RETURNS TABLE(
  active_users bigint,
  page_views bigint,
  conversions bigint,
  revenue numeric,
  event_count bigint,
  user_engagement numeric
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(rtas.active_users), 0) as active_users,
    COALESCE(SUM(rtas.page_views), 0) as page_views,
    COALESCE(SUM(rtas.conversions), 0) as conversions,
    COALESCE(SUM(rtas.revenue), 0) as revenue,
    COALESCE(SUM(rtas.event_count), 0) as event_count,
    COALESCE(AVG(rtas.user_engagement), 0) as user_engagement
  FROM real_time_analytics_summary rtas
  WHERE rtas.hour >= NOW() - INTERVAL '1 hour';
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION get_cached_real_time_metrics() TO authenticated;
GRANT EXECUTE ON FUNCTION get_cached_real_time_metrics() TO service_role;
