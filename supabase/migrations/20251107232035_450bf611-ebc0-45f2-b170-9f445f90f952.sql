-- Create pages table for dynamic page generation
CREATE TABLE IF NOT EXISTS public.pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  universe_id UUID NOT NULL REFERENCES public.universes(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('UNIVERSE', 'CHARACTER', 'LOCATION', 'EVENT', 'OBJECT')),
  entity_id UUID NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ERROR', 'NEEDS_REFRESH')),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_pages_slug ON public.pages(slug);
CREATE INDEX idx_pages_universe_id ON public.pages(universe_id);
CREATE INDEX idx_pages_type ON public.pages(type);
CREATE INDEX idx_pages_status ON public.pages(status);

-- Enable RLS
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for pages
CREATE POLICY "Users can view pages from their universes"
ON public.pages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.universes
    WHERE universes.id = pages.universe_id
    AND universes.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create pages in their universes"
ON public.pages
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.universes
    WHERE universes.id = pages.universe_id
    AND universes.user_id = auth.uid()
  )
);

CREATE POLICY "Users can update pages in their universes"
ON public.pages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.universes
    WHERE universes.id = pages.universe_id
    AND universes.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete pages from their universes"
ON public.pages
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.universes
    WHERE universes.id = pages.universe_id
    AND universes.user_id = auth.uid()
  )
);

-- Create page_templates table for template versioning
CREATE TABLE IF NOT EXISTS public.page_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('UNIVERSE', 'CHARACTER', 'LOCATION', 'EVENT', 'OBJECT')),
  template_version TEXT NOT NULL DEFAULT 'v1',
  schema JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(type, template_version)
);

-- Enable RLS for page_templates (read-only for authenticated users)
ALTER TABLE public.page_templates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view page templates"
ON public.page_templates
FOR SELECT
USING (true);

CREATE POLICY "Only admins can manage page templates"
ON public.page_templates
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add trigger to update updated_at
CREATE TRIGGER update_pages_updated_at
BEFORE UPDATE ON public.pages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_page_templates_updated_at
BEFORE UPDATE ON public.page_templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default page templates
INSERT INTO public.page_templates (type, template_version, schema) VALUES
('UNIVERSE', 'v1', '{"fields": ["name", "description", "sourceType", "characters", "locations", "events", "objects"]}'::jsonb),
('CHARACTER', 'v1', '{"fields": ["name", "description", "role", "importance", "relationships", "events"]}'::jsonb),
('LOCATION', 'v1', '{"fields": ["name", "description", "type", "events", "characters"]}'::jsonb),
('EVENT', 'v1', '{"fields": ["name", "description", "timeline_order", "involved_characters", "location"]}'::jsonb),
('OBJECT', 'v1', '{"fields": ["name", "description", "significance", "owner"]}'::jsonb);