-- Create a SQL execution function that can bypass RLS
-- Run this in the Supabase SQL Editor

-- This function allows executing arbitrary SQL with elevated privileges
CREATE OR REPLACE FUNCTION public.execute_sql(sql_query TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- This runs with the privileges of the function owner
AS $$
DECLARE
  result JSONB;
BEGIN
  EXECUTE sql_query INTO result;
  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.execute_sql(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.execute_sql(TEXT) TO anon;

-- Note: This function is potentially dangerous as it allows executing
-- arbitrary SQL commands. In a production environment, you would want
-- to restrict what SQL can be executed or use a different approach. 