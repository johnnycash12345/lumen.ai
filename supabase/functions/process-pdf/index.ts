import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { universeId, pdfText } = await req.json();
    
    if (!universeId || !pdfText) {
      throw new Error('universeId and pdfText are required');
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const deepseekApiKey = Deno.env.get('DEEPSEEK_API_KEY');
    if (!deepseekApiKey) {
      throw new Error('DEEPSEEK_API_KEY not configured');
    }

    console.log(`Processing PDF for universe: ${universeId}`);

    // Split text into chunks of ~2000 characters
    const chunkSize = 2000;
    const chunks: string[] = [];
    for (let i = 0; i < pdfText.length; i += chunkSize) {
      chunks.push(pdfText.slice(i, i + chunkSize));
    }

    console.log(`Split into ${chunks.length} chunks`);

    // Process each chunk with Deepseek
    const allCharacters: any[] = [];
    const allLocations: any[] = [];
    const allEvents: any[] = [];
    const allObjects: any[] = [];

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(`Processing chunk ${i + 1}/${chunks.length}`);

      const prompt = `Você é um especialista em análise literária. Analise o seguinte trecho e extraja TODAS as entidades mencionadas.

IMPORTANTE:
- Seja completo e não deixe nada de fora
- Para cada personagem, identifique seu papel (protagonista, antagonista, coadjuvante)
- Identifique habilidades, personalidade e ocupação quando mencionadas
- Para locais, identifique o tipo (cidade, edifício, lugar mágico, etc)
- Para eventos, identifique a data se mencionada
- Para relacionamentos, seja específico (amigo, inimigo, família, rival, etc)

Texto:
${chunk}

Retorne um JSON válido com EXATAMENTE esta estrutura:
{
  "characters": [{"name": "string", "aliases": ["string"], "description": "string", "role": "string", "abilities": ["string"], "personality": "string", "occupation": "string"}],
  "locations": [{"name": "string", "aliases": ["string"], "description": "string", "location_type": "string", "country": "string", "significance": "string"}],
  "events": [{"name": "string", "description": "string", "event_date": "string", "location": "string", "significance": "string", "involved_characters": ["string"]}],
  "objects": [{"name": "string", "aliases": ["string"], "description": "string", "object_type": "string", "owner": "string", "powers": "string"}]
}

Retorne APENAS o JSON, sem explicações adicionais.`;

      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${deepseekApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            { role: 'system', content: 'Você é um especialista em análise literária.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 4000,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error('Deepseek API error:', error);
        continue;
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      
      try {
        const parsed = JSON.parse(content);
        if (parsed.characters) allCharacters.push(...parsed.characters);
        if (parsed.locations) allLocations.push(...parsed.locations);
        if (parsed.events) allEvents.push(...parsed.events);
        if (parsed.objects) allObjects.push(...parsed.objects);
      } catch (e) {
        console.error('Failed to parse JSON from Deepseek:', e);
      }

      // Update progress
      const progress = Math.round(((i + 1) / chunks.length) * 100);
      await supabase
        .from('processing_jobs')
        .update({ progress })
        .eq('universe_id', universeId);
    }

    console.log(`Extracted: ${allCharacters.length} characters, ${allLocations.length} locations, ${allEvents.length} events, ${allObjects.length} objects`);

    // Remove duplicates
    const uniqueCharacters = Array.from(
      new Map(allCharacters.map(c => [c.name, c])).values()
    );
    const uniqueLocations = Array.from(
      new Map(allLocations.map(l => [l.name, l])).values()
    );
    const uniqueEvents = Array.from(
      new Map(allEvents.map(e => [e.name, e])).values()
    );
    const uniqueObjects = Array.from(
      new Map(allObjects.map(o => [o.name, o])).values()
    );

    // Insert into database
    if (uniqueCharacters.length > 0) {
      await supabase.from('characters').insert(
        uniqueCharacters.map(c => ({ ...c, universe_id: universeId }))
      );
    }

    if (uniqueLocations.length > 0) {
      await supabase.from('locations').insert(
        uniqueLocations.map(l => ({ ...l, universe_id: universeId }))
      );
    }

    if (uniqueEvents.length > 0) {
      await supabase.from('events').insert(
        uniqueEvents.map(e => ({ ...e, universe_id: universeId }))
      );
    }

    if (uniqueObjects.length > 0) {
      await supabase.from('objects').insert(
        uniqueObjects.map(o => ({ ...o, universe_id: universeId }))
      );
    }

    // Update universe status
    await supabase
      .from('universes')
      .update({ processing_status: 'completed' })
      .eq('id', universeId);

    // Update job status
    await supabase
      .from('processing_jobs')
      .update({ status: 'COMPLETED', progress: 100 })
      .eq('universe_id', universeId);

    console.log('Processing complete!');

    return new Response(
      JSON.stringify({
        success: true,
        stats: {
          characters: uniqueCharacters.length,
          locations: uniqueLocations.length,
          events: uniqueEvents.length,
          objects: uniqueObjects.length,
        },
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('Error processing PDF:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
