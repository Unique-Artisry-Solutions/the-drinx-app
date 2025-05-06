
-- Create a generic increment function that can be used across tables
CREATE OR REPLACE FUNCTION increment_count(row_id UUID, table_name TEXT, column_name TEXT DEFAULT 'usage_count')
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count INTEGER;
  new_count INTEGER;
  query TEXT;
BEGIN
  -- Sanitize table name to prevent SQL injection
  IF table_name NOT IN ('event_discount_codes', 'promotion_redemptions', 'event_attendees') THEN
    RAISE EXCEPTION 'Invalid table name: %', table_name;
  END IF;
  
  -- Sanitize column name to prevent SQL injection
  IF column_name NOT IN ('usage_count', 'count', 'redemption_count') THEN
    RAISE EXCEPTION 'Invalid column name: %', column_name;
  END IF;
  
  -- Build and execute the query to get current count
  query := format('SELECT %I FROM %I WHERE id = $1', column_name, table_name);
  EXECUTE query INTO current_count USING row_id;
  
  -- If null, start from 0
  current_count := COALESCE(current_count, 0);
  new_count := current_count + 1;
  
  -- Build and execute update query
  query := format('UPDATE %I SET %I = $1 WHERE id = $2', table_name, column_name);
  EXECUTE query USING new_count, row_id;
  
  RETURN new_count;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_count TO authenticated;
GRANT EXECUTE ON FUNCTION increment_count TO service_role;
