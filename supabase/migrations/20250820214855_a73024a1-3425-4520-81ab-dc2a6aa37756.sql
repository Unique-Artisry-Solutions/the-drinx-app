-- Create a database function to get admin users with roles and establishments
CREATE OR REPLACE FUNCTION get_admin_users_with_roles(
  search_term text DEFAULT NULL,
  limit_val integer DEFAULT 50,
  offset_val integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  display_name text,
  username text,
  user_type text,
  phone text,
  bio text,
  created_at timestamp with time zone,
  active_roles text[],
  establishment_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.display_name,
    p.username,
    p.user_type,
    p.phone,
    p.bio,
    p.created_at,
    COALESCE(array_agg(DISTINCT ur.role::text) FILTER (WHERE ur.role IS NOT NULL AND ur.is_active = true), '{}') as active_roles,
    e.name as establishment_name
  FROM profiles p
  LEFT JOIN user_roles ur ON ur.user_id = p.id AND ur.is_active = true
  LEFT JOIN establishments e ON e.owner_id = p.id
  WHERE 
    (search_term IS NULL OR 
     p.display_name ILIKE '%' || search_term || '%' OR 
     p.username ILIKE '%' || search_term || '%' OR
     p.user_type ILIKE '%' || search_term || '%')
  GROUP BY p.id, p.display_name, p.username, p.user_type, p.phone, p.bio, p.created_at, e.name
  ORDER BY p.created_at DESC
  LIMIT limit_val
  OFFSET offset_val;
END;
$$;