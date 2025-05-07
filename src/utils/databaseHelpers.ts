/**
 * Database helper functions for common operations
 */

/**
 * Recommended SQL functions to create in your Supabase database for the analytics features to work:
 * 
 * 1. get_incremented_value - Increments a value in a specific column:
 * 
 * CREATE OR REPLACE FUNCTION get_incremented_value(row_id uuid, column_name text, increment_by numeric DEFAULT 1)
 * RETURNS numeric
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * DECLARE
 *   current_value numeric;
 *   new_value numeric;
 *   table_name text;
 *   query text;
 * BEGIN
 *   -- Extract table name from column_name if it contains ->
 *   IF column_name LIKE '%->%' THEN
 *     table_name := split_part(column_name, '->', 1);
 *     column_name := split_part(column_name, '->', 2);
 *     -- Handle JSONB increment
 *     EXECUTE format('SELECT COALESCE((%s->%L)::numeric, 0) FROM event_marketing_campaigns WHERE id = %L', 
 *                    table_name, column_name, row_id) INTO current_value;
 *   ELSE
 *     -- Handle regular column increment
 *     EXECUTE format('SELECT COALESCE(%I, 0) FROM event_analytics WHERE id = %L', 
 *                    column_name, row_id) INTO current_value;
 *   END IF;
 *   
 *   new_value := COALESCE(current_value, 0) + increment_by;
 *   RETURN new_value;
 * END;
 * $$;
 *
 * 2. update_source_count - Updates a count in a JSONB referral_sources object:
 *
 * CREATE OR REPLACE FUNCTION update_source_count(record_id uuid, source_name text)
 * RETURNS jsonb
 * LANGUAGE plpgsql
 * SECURITY DEFINER
 * AS $$
 * DECLARE
 *   current_sources jsonb;
 *   current_count integer;
 * BEGIN
 *   -- Get current referral sources
 *   SELECT referral_sources 
 *   INTO current_sources 
 *   FROM event_analytics 
 *   WHERE id = record_id;
 *   
 *   -- Get current count for this source or default to 0
 *   current_count := COALESCE((current_sources->>source_name)::integer, 0);
 *   
 *   -- Increment the count
 *   IF current_sources IS NULL THEN
 *     current_sources := jsonb_build_object(source_name, 1);
 *   ELSE
 *     current_sources := jsonb_set(
 *       current_sources,
 *       array[source_name],
 *       to_jsonb(current_count + 1)
 *     );
 *   END IF;
 *   
 *   RETURN current_sources;
 * END;
 * $$;
 */

/**
 * Formats a date for display
 */
export const formatDate = (date: string | Date): string => {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric'
  });
};
