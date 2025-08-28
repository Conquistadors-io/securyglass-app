-- Fix linter warning: set stable search_path on function
ALTER FUNCTION public.update_updated_at_column() SET search_path = public;