ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS engraving_opacity NUMERIC DEFAULT 1.0,
ADD COLUMN IF NOT EXISTS engraving_blend_mode TEXT DEFAULT 'multiply';