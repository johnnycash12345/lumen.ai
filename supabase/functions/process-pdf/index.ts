import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdf_path, universe_id } = await req.json();
    console.log('Processing PDF:', pdf_path, 'for universe:', universe_id);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update universe status
    await supabaseClient
      .from('universes')
      .update({ processing_status: 'processing' })
      .eq('id', universe_id);

    // Download PDF from storage
    const { data: pdfData, error: downloadError } = await supabaseClient
      .storage
      .from('pdfs')
      .download(pdf_path);

    if (downloadError) {
      throw new Error(`Failed to download PDF: ${downloadError.message}`);
    }

    console.log('PDF downloaded, size:', pdfData.size);

    // Convert PDF to text using pdf-parse
    // Note: For production, you'd want to use a proper PDF parsing library
    // For now, we'll extract text in chunks and send to LLM
    const arrayBuffer = await pdfData.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);
    
    // Convert to base64 for simple text extraction
    const base64Pdf = btoa(String.fromCharCode.apply(null, Array.from(pdfBytes)));
    
    // For MVP, we'll use Lovable AI to extract text and entities
    // In production, use a dedicated PDF parser
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const extractResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert at analyzing fictional universes. Extract ALL entities from the book:
- Characters (name, description, role, importance)
- Locations (name, description, type)
- Events (name, description, chronological order)
- Objects (name, description, significance)
- Relationships between entities

Return a JSON object with these arrays: characters, locations, events, objects, relationships.
Each relationship should have: source_type, source_id (use the name), target_type, target_id, relationship_type, description.`
          },
          {
            role: 'user',
            content: `Analyze this PDF content and extract all entities. The PDF is base64 encoded: ${base64Pdf.substring(0, 50000)}...` 
          }
        ],
      }),
    });

    const extractData = await extractResponse.json();
    const content = extractData.choices?.[0]?.message?.content || '{}';
    
    console.log('Extraction response:', content.substring(0, 500));
    
    let entities;
    try {
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      entities = jsonMatch ? JSON.parse(jsonMatch[0]) : { characters: [], locations: [], events: [], objects: [], relationships: [] };
    } catch {
      entities = { characters: [], locations: [], events: [], objects: [], relationships: [] };
    }

    // Insert entities into database
    const characterIds: Record<string, string> = {};
    const locationIds: Record<string, string> = {};
    const eventIds: Record<string, string> = {};
    const objectIds: Record<string, string> = {};

    // Insert characters
    if (entities.characters?.length > 0) {
      const { data: chars } = await supabaseClient
        .from('characters')
        .insert(entities.characters.map((c: any) => ({
          universe_id,
          name: c.name,
          description: c.description,
          role: c.role,
          importance: c.importance
        })))
        .select();
      
      chars?.forEach((char: any) => {
        characterIds[char.name] = char.id;
      });
    }

    // Insert locations
    if (entities.locations?.length > 0) {
      const { data: locs } = await supabaseClient
        .from('locations')
        .insert(entities.locations.map((l: any) => ({
          universe_id,
          name: l.name,
          description: l.description,
          type: l.type
        })))
        .select();
      
      locs?.forEach((loc: any) => {
        locationIds[loc.name] = loc.id;
      });
    }

    // Insert events
    if (entities.events?.length > 0) {
      const { data: evts } = await supabaseClient
        .from('events')
        .insert(entities.events.map((e: any, idx: number) => ({
          universe_id,
          name: e.name,
          description: e.description,
          timeline_order: idx
        })))
        .select();
      
      evts?.forEach((evt: any) => {
        eventIds[evt.name] = evt.id;
      });
    }

    // Insert objects
    if (entities.objects?.length > 0) {
      const { data: objs } = await supabaseClient
        .from('objects')
        .insert(entities.objects.map((o: any) => ({
          universe_id,
          name: o.name,
          description: o.description,
          significance: o.significance
        })))
        .select();
      
      objs?.forEach((obj: any) => {
        objectIds[obj.name] = obj.id;
      });
    }

    // Insert relationships
    const allIds = { ...characterIds, ...locationIds, ...eventIds, ...objectIds };
    if (entities.relationships?.length > 0) {
      const relationships = entities.relationships
        .map((r: any) => {
          const sourceId = allIds[r.source_id] || r.source_id;
          const targetId = allIds[r.target_id] || r.target_id;
          
          if (!sourceId || !targetId) return null;
          
          return {
            universe_id,
            source_type: r.source_type,
            source_id: sourceId,
            target_type: r.target_type,
            target_id: targetId,
            relationship_type: r.relationship_type,
            description: r.description
          };
        })
        .filter(Boolean);

      if (relationships.length > 0) {
        await supabaseClient
          .from('relationships')
          .insert(relationships);
      }
    }

    // Update universe status
    await supabaseClient
      .from('universes')
      .update({ processing_status: 'completed' })
      .eq('id', universe_id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'PDF processed successfully',
        entities: {
          characters: entities.characters?.length || 0,
          locations: entities.locations?.length || 0,
          events: entities.events?.length || 0,
          objects: entities.objects?.length || 0,
          relationships: entities.relationships?.length || 0
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
