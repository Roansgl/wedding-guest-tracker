-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admins can insert guests" ON public.guests;
DROP POLICY IF EXISTS "Admins can update guests" ON public.guests;
DROP POLICY IF EXISTS "Admins can delete guests" ON public.guests;
DROP POLICY IF EXISTS "Anyone can view guests by invite code" ON public.guests;

-- Recreate as permissive policies
CREATE POLICY "Admins can insert guests" 
ON public.guests 
FOR INSERT 
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update guests" 
ON public.guests 
FOR UPDATE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete guests" 
ON public.guests 
FOR DELETE 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can view guests by invite code" 
ON public.guests 
FOR SELECT 
USING (true);