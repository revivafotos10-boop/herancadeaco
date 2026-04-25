-- Create the function if it doesn't exist (it usually should, but to be safe)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create a table for home banners
CREATE TABLE IF NOT EXISTS public.home_banners (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT,
    image_url TEXT NOT NULL,
    button_url TEXT,
    active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.home_banners ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (viewing banners)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Home banners are viewable by everyone') THEN
        CREATE POLICY "Home banners are viewable by everyone" 
        ON public.home_banners 
        FOR SELECT 
        USING (active = true);
    END IF;
END $$;

-- Create policies for admin access (full control)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins can manage home banners') THEN
        CREATE POLICY "Admins can manage home banners" 
        ON public.home_banners 
        FOR ALL 
        USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Create trigger for automatic timestamp updates
DROP TRIGGER IF EXISTS update_home_banners_updated_at ON public.home_banners;
CREATE TRIGGER update_home_banners_updated_at
BEFORE UPDATE ON public.home_banners
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial banner from current hero to avoid blank state
INSERT INTO public.home_banners (title, image_url, sort_order)
VALUES ('Banner Principal', 'https://dqfbzfebreviezupegcx.supabase.co/storage/v1/object/public/banners//image.png', 0)
ON CONFLICT DO NOTHING;