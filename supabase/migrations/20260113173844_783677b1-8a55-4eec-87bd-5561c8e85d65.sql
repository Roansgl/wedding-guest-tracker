-- Add wedding info settings for directions, accommodation, notes, and weather location
-- We'll use the existing wedding_settings table with new keys

-- Insert default values for wedding info settings
INSERT INTO public.wedding_settings (key, value) VALUES
  ('directions_text', NULL),
  ('directions_map_url', NULL),
  ('accommodation_text', NULL),
  ('notes_text', NULL),
  ('weather_location', 'Kirkwood,Eastern Cape,ZA')
ON CONFLICT (key) DO NOTHING;