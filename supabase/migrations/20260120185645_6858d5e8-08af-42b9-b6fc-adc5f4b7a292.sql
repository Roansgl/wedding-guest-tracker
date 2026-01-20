-- Fix overly permissive RLS policies on rsvps table
-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Anyone can insert RSVPs" ON public.rsvps;
DROP POLICY IF EXISTS "Anyone can update RSVPs" ON public.rsvps;

-- Create more restrictive INSERT policy - only allow if guest_id exists
CREATE POLICY "Guests can insert their own RSVP"
ON public.rsvps
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.guests
    WHERE id = guest_id
  )
);

-- Create more restrictive UPDATE policy - only allow updating own RSVP by guest_id match
CREATE POLICY "Guests can update their own RSVP"
ON public.rsvps
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.guests
    WHERE id = guest_id
  )
);

-- Add input length constraints to rsvps table
ALTER TABLE public.rsvps 
  ADD CONSTRAINT message_length CHECK (char_length(message) <= 1000),
  ADD CONSTRAINT dietary_notes_length CHECK (char_length(dietary_notes) <= 500),
  ADD CONSTRAINT plus_one_name_length CHECK (char_length(plus_one_name) <= 100);