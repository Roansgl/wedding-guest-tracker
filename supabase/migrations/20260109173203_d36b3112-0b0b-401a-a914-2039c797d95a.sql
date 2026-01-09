-- Create enum for RSVP status
CREATE TYPE public.rsvp_status AS ENUM ('pending', 'attending', 'not_attending', 'maybe');

-- Create enum for meal preference
CREATE TYPE public.meal_preference AS ENUM ('standard', 'vegetarian', 'vegan', 'gluten_free', 'other');

-- Create guests table
CREATE TABLE public.guests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  invite_code TEXT NOT NULL UNIQUE DEFAULT substring(md5(random()::text) from 1 for 8),
  plus_one_allowed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create RSVPs table
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  guest_id UUID NOT NULL REFERENCES public.guests(id) ON DELETE CASCADE,
  status public.rsvp_status NOT NULL DEFAULT 'pending',
  meal_preference public.meal_preference,
  dietary_notes TEXT,
  plus_one_name TEXT,
  plus_one_meal_preference public.meal_preference,
  message TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(guest_id)
);

-- Enable Row Level Security
ALTER TABLE public.guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

-- Public can view guests by invite code (for RSVP page)
CREATE POLICY "Anyone can view guests by invite code"
ON public.guests
FOR SELECT
USING (true);

-- Public can view and update RSVPs (guests submit RSVPs)
CREATE POLICY "Anyone can view RSVPs"
ON public.rsvps
FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert RSVPs"
ON public.rsvps
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Anyone can update RSVPs"
ON public.rsvps
FOR UPDATE
USING (true);

-- Admin role for managing guests
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Function to check admin role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN
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

-- Admins can manage guests
CREATE POLICY "Admins can insert guests"
ON public.guests
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update guests"
ON public.guests
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete guests"
ON public.guests
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- Admins can manage RSVPs
CREATE POLICY "Admins can delete RSVPs"
ON public.rsvps
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- User roles policies
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
USING (auth.uid() = user_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_guests_updated_at
BEFORE UPDATE ON public.guests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rsvps_updated_at
BEFORE UPDATE ON public.rsvps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();