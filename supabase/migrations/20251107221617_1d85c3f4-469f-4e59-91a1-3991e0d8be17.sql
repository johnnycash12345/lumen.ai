-- Drop existing policies that might be causing issues
DROP POLICY IF EXISTS "Admin can view all processing jobs" ON public.processing_jobs;
DROP POLICY IF EXISTS "Admin can insert processing jobs" ON public.processing_jobs;
DROP POLICY IF EXISTS "Admin can update processing jobs" ON public.processing_jobs;

-- Create a security definer function to check roles (avoids recursive RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Recreate processing_jobs policies using the has_role function
CREATE POLICY "Admin can view all processing jobs"
  ON public.processing_jobs
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can insert processing jobs"
  ON public.processing_jobs
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admin can update processing jobs"
  ON public.processing_jobs
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));