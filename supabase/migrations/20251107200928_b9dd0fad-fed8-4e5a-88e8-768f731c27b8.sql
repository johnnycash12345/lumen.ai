-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create universes table (books/franchises)
CREATE TABLE public.universes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  pdf_path TEXT,
  processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create characters table
CREATE TABLE public.characters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  universe_id UUID NOT NULL REFERENCES public.universes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  role TEXT,
  importance TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create locations table
CREATE TABLE public.locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  universe_id UUID NOT NULL REFERENCES public.universes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  universe_id UUID NOT NULL REFERENCES public.universes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  timeline_order INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create objects table
CREATE TABLE public.objects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  universe_id UUID NOT NULL REFERENCES public.universes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  significance TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create relationships table (many-to-many relationships between all entities)
CREATE TABLE public.relationships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  universe_id UUID NOT NULL REFERENCES public.universes(id) ON DELETE CASCADE,
  source_type TEXT NOT NULL CHECK (source_type IN ('character', 'location', 'event', 'object')),
  source_id UUID NOT NULL,
  target_type TEXT NOT NULL CHECK (target_type IN ('character', 'location', 'event', 'object')),
  target_id UUID NOT NULL,
  relationship_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.universes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.relationships ENABLE ROW LEVEL SECURITY;

-- RLS Policies for universes
CREATE POLICY "Users can view their own universes"
  ON public.universes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own universes"
  ON public.universes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own universes"
  ON public.universes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own universes"
  ON public.universes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for characters
CREATE POLICY "Users can view characters from their universes"
  ON public.characters FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.universes WHERE id = characters.universe_id AND user_id = auth.uid()));

CREATE POLICY "Users can create characters in their universes"
  ON public.characters FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.universes WHERE id = universe_id AND user_id = auth.uid()));

CREATE POLICY "Users can update characters in their universes"
  ON public.characters FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.universes WHERE id = universe_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete characters from their universes"
  ON public.characters FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.universes WHERE id = universe_id AND user_id = auth.uid()));

-- RLS Policies for locations (same pattern)
CREATE POLICY "Users can view locations from their universes"
  ON public.locations FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.universes WHERE id = locations.universe_id AND user_id = auth.uid()));

CREATE POLICY "Users can create locations in their universes"
  ON public.locations FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.universes WHERE id = universe_id AND user_id = auth.uid()));

CREATE POLICY "Users can update locations in their universes"
  ON public.locations FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.universes WHERE id = universe_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete locations from their universes"
  ON public.locations FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.universes WHERE id = universe_id AND user_id = auth.uid()));

-- RLS Policies for events (same pattern)
CREATE POLICY "Users can view events from their universes"
  ON public.events FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.universes WHERE id = events.universe_id AND user_id = auth.uid()));

CREATE POLICY "Users can create events in their universes"
  ON public.events FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.universes WHERE id = universe_id AND user_id = auth.uid()));

CREATE POLICY "Users can update events in their universes"
  ON public.events FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.universes WHERE id = universe_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete events from their universes"
  ON public.events FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.universes WHERE id = universe_id AND user_id = auth.uid()));

-- RLS Policies for objects (same pattern)
CREATE POLICY "Users can view objects from their universes"
  ON public.objects FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.universes WHERE id = objects.universe_id AND user_id = auth.uid()));

CREATE POLICY "Users can create objects in their universes"
  ON public.objects FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.universes WHERE id = universe_id AND user_id = auth.uid()));

CREATE POLICY "Users can update objects in their universes"
  ON public.objects FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.universes WHERE id = universe_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete objects from their universes"
  ON public.objects FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.universes WHERE id = universe_id AND user_id = auth.uid()));

-- RLS Policies for relationships (same pattern)
CREATE POLICY "Users can view relationships from their universes"
  ON public.relationships FOR SELECT
  USING (EXISTS (SELECT 1 FROM public.universes WHERE id = relationships.universe_id AND user_id = auth.uid()));

CREATE POLICY "Users can create relationships in their universes"
  ON public.relationships FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM public.universes WHERE id = universe_id AND user_id = auth.uid()));

CREATE POLICY "Users can update relationships in their universes"
  ON public.relationships FOR UPDATE
  USING (EXISTS (SELECT 1 FROM public.universes WHERE id = universe_id AND user_id = auth.uid()));

CREATE POLICY "Users can delete relationships from their universes"
  ON public.relationships FOR DELETE
  USING (EXISTS (SELECT 1 FROM public.universes WHERE id = universe_id AND user_id = auth.uid()));

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to universes table
CREATE TRIGGER update_universes_updated_at
  BEFORE UPDATE ON public.universes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public)
VALUES ('pdfs', 'pdfs', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own PDFs"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own PDFs"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own PDFs"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);