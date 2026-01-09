-- Create storage bucket for watermark images
INSERT INTO storage.buckets (id, name, public)
VALUES ('watermarks', 'watermarks', true);

-- Allow admins to upload watermark images
CREATE POLICY "Admins can upload watermarks"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'watermarks' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to update watermark images
CREATE POLICY "Admins can update watermarks"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'watermarks' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow admins to delete watermark images
CREATE POLICY "Admins can delete watermarks"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'watermarks' 
  AND has_role(auth.uid(), 'admin'::app_role)
);

-- Allow anyone to view watermark images (they're public)
CREATE POLICY "Anyone can view watermarks"
ON storage.objects
FOR SELECT
USING (bucket_id = 'watermarks');

-- Create a settings table to store the watermark URL
CREATE TABLE public.wedding_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on settings
ALTER TABLE public.wedding_settings ENABLE ROW LEVEL SECURITY;

-- Admins can manage settings
CREATE POLICY "Admins can manage settings"
ON public.wedding_settings
FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Anyone can view settings
CREATE POLICY "Anyone can view settings"
ON public.wedding_settings
FOR SELECT
USING (true);