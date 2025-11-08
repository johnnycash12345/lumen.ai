import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to retry with exponential backoff
async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 2000
): Promise<T> {
  let lastError: Error;
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, i);
        console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError!;
}

// Update job status
async function updateJobStatus(
  supabase: any,
  universeId: string,
  status: string,
  progress: number,
  errorMessage?: string
) {
  await supabase
    .from('processing_jobs')
    .update({
      status,
      progress,
      error_message: errorMessage ?? null,
      updated_at: new Date().toISOString()
    })
    .eq('universe_id', universeId);
}

// Log processing step
function logStep(phase: string, message: string) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] [${phase}] ${message}`);
}

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

    logStep('START', `Processing PDF for universe: ${universeId}`);
    await updateJobStatus(supabase, universeId, 'PROCESSING', 5);

    // FASE 1: VALIDAÇÃO
    logStep('VALIDATION', 'Validating PDF content...');
    if (pdfText.length < 100) {
      throw new Error('PDF content too short. Minimum 100 characters required.');
    }
    await updateJobStatus(supabase, universeId, 'PROCESSING', 10);

    // FASE 2: CHUNKING COM OVERLAP
    logStep('CHUNKING', 'Splitting text into chunks with overlap...');
    const chunkSize = 1800;
    const overlapSize = 200;
    const chunks: Array<{ id: number; content: string; }> = [];
    
    for (let i = 0; i < pdfText.length; i += (chunkSize - overlapSize)) {
      const end = Math.min(i + chunkSize, pdfText.length);
      chunks.push({
        id: chunks.length,
        content: pdfText.slice(i, end).trim()
      });
      
      if (end >= pdfText.length) break;
    }
    
    logStep('CHUNKING', `Created ${chunks.length} chunks with ${overlapSize} char overlap`);
    await updateJobStatus(supabase, universeId, 'PROCESSING', 20);

    // FASE 3: EXTRAÇÃO COM DEEPSEEK (COM RETRY)
    logStep('EXTRACTION', 'Starting entity extraction with Deepseek...');
    const allCharacters: any[] = [];
    const allLocations: any[] = [];
    const allEvents: any[] = [];
    const allObjects: any[] = [];
    const allRelationships: any[] = [];
    const errors: string[] = [];

    const enhancedPrompt = `Você é um especialista em análise literária. Analise o seguinte trecho e extraia TODAS as entidades mencionadas.

INSTRUÇÕES CRÍTICAS:
- Seja completo. NÃO deixe nada de fora.
- Se um personagem é mencionado, extraia mesmo que brevemente.
- Se um local é mencionado, extraia mesmo que uma única vez.
- Se um evento acontece, extraia mesmo que pequeno.
- Para cada entidade, tente identificar o máximo de informação possível.

Texto:
{TEXT}

RETORNE UM JSON VÁLIDO COM ESTA ESTRUTURA EXATA:
{
  "characters": [
    {
      "name": "string",
      "aliases": ["string"],
      "description": "string",
      "role": "PROTAGONIST|ANTAGONIST|SUPPORTING|MINOR",
      "abilities": ["string"],
      "personality": "string",
      "occupation": "string"
    }
  ],
  "locations": [
    {
      "name": "string",
      "aliases": ["string"],
      "description": "string",
      "type": "CITY|BUILDING|MAGICAL_PLACE|COUNTRY|REGION|LANDMARK|OTHER",
      "country": "string ou null",
      "significance": "string"
    }
  ],
  "events": [
    {
      "name": "string",
      "description": "string",
      "date": "string ou null",
      "location": "string ou null",
      "significance": "MAJOR|MINOR",
      "involved_characters": ["string"]
    }
  ],
  "objects": [
    {
      "name": "string",
      "aliases": ["string"],
      "description": "string",
      "type": "MAGICAL_ITEM|WEAPON|ARTIFACT|TOOL|BOOK|OTHER",
      "owner": "string ou null",
      "powers": "string",
      "significance": "string"
    }
  ],
  "relationships": [
    {
      "character1": "string",
      "character2": "string",
      "type": "FRIEND|ENEMY|FAMILY|ROMANTIC|MENTOR|RIVAL|ALLY",
      "description": "string"
    }
  ]
}

IMPORTANTE:
- Retorne APENAS o JSON, sem explicações adicionais
- Se não encontrar uma categoria, retorne array vazio []
- Não invente dados que não estão no texto`;

    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const progress = 20 + Math.round((i / chunks.length) * 50);
      
      logStep('EXTRACTION', `Processing chunk ${i + 1}/${chunks.length}...`);

      try {
        const extractedData = await retryWithBackoff(async () => {
          const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${deepseekApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: 'deepseek-chat',
              messages: [
                { role: 'system', content: 'Você é um especialista em análise literária que retorna apenas JSON válido.' },
                { role: 'user', content: enhancedPrompt.replace('{TEXT}', chunk.content) }
              ],
              temperature: 0.3,
              max_tokens: 4000,
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Deepseek API error (${response.status}): ${errorText}`);
          }

          const data = await response.json();
          const content = data.choices[0].message.content;
          
          // Try to parse JSON
          try {
            return JSON.parse(content);
          } catch (e) {
            // Try to extract JSON from markdown code block
            const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*\})\s*```/);
            if (jsonMatch) {
              return JSON.parse(jsonMatch[1]);
            }
            throw new Error('Failed to parse JSON response from Deepseek');
          }
        });

        // Aggregate results
        if (extractedData.characters) allCharacters.push(...extractedData.characters);
        if (extractedData.locations) allLocations.push(...extractedData.locations);
        if (extractedData.events) allEvents.push(...extractedData.events);
        if (extractedData.objects) allObjects.push(...extractedData.objects);
        if (extractedData.relationships) allRelationships.push(...extractedData.relationships);

        await updateJobStatus(supabase, universeId, 'PROCESSING', progress);
        
      } catch (error: any) {
        logStep('ERROR', `Chunk ${i + 1} failed: ${error.message}`);
        errors.push(`Chunk ${i + 1}: ${error.message}`);
        // Continue processing other chunks
      }
    }

    logStep('EXTRACTION', `Extracted: ${allCharacters.length} characters, ${allLocations.length} locations, ${allEvents.length} events, ${allObjects.length} objects, ${allRelationships.length} relationships`);
    await updateJobStatus(supabase, universeId, 'PROCESSING', 70);

    // FASE 4: CONSOLIDAÇÃO (REMOVER DUPLICATAS)
    logStep('CONSOLIDATION', 'Consolidating and removing duplicates...');
    
    // Consolidate characters
    const characterMap = new Map();
    allCharacters.forEach(char => {
      const key = char.name?.toLowerCase().trim();
      if (!key) return;
      
      if (characterMap.has(key)) {
        const existing = characterMap.get(key);
        // Merge data
        existing.aliases = [...new Set([...existing.aliases || [], ...char.aliases || []])];
        existing.abilities = [...new Set([...existing.abilities || [], ...char.abilities || []])];
        if (char.description && char.description.length > (existing.description?.length || 0)) {
          existing.description = char.description;
        }
      } else {
        characterMap.set(key, { ...char });
      }
    });
    
    const uniqueCharacters = Array.from(characterMap.values());

    // Consolidate locations
    const locationMap = new Map();
    allLocations.forEach(loc => {
      const key = loc.name?.toLowerCase().trim();
      if (!key) return;
      
      if (!locationMap.has(key)) {
        locationMap.set(key, { ...loc });
      }
    });
    
    const uniqueLocations = Array.from(locationMap.values());

    // Consolidate events
    const eventMap = new Map();
    allEvents.forEach(event => {
      const key = event.name?.toLowerCase().trim();
      if (!key) return;
      
      if (!eventMap.has(key)) {
        eventMap.set(key, { ...event });
      }
    });
    
    const uniqueEvents = Array.from(eventMap.values());

    // Consolidate objects
    const objectMap = new Map();
    allObjects.forEach(obj => {
      const key = obj.name?.toLowerCase().trim();
      if (!key) return;
      
      if (!objectMap.has(key)) {
        objectMap.set(key, { ...obj });
      }
    });
    
    const uniqueObjects = Array.from(objectMap.values());

    logStep('CONSOLIDATION', `After deduplication: ${uniqueCharacters.length} characters, ${uniqueLocations.length} locations, ${uniqueEvents.length} events, ${uniqueObjects.length} objects`);
    await updateJobStatus(supabase, universeId, 'PROCESSING', 80);

    // FASE 5: INSERIR NO BANCO DE DADOS
    logStep('DATABASE', 'Inserting entities into database...');
    
    // Insert characters
    if (uniqueCharacters.length > 0) {
      const { error: charError } = await supabase.from('characters').insert(
        uniqueCharacters.map(c => ({
          universe_id: universeId,
          name: c.name,
          description: c.description || null,
          role: c.role || null,
          importance: c.significance || null
        }))
      );
      
      if (charError) {
        logStep('ERROR', `Failed to insert characters: ${charError.message}`);
        errors.push(`Characters insertion: ${charError.message}`);
      }
    }

    // Insert locations
    if (uniqueLocations.length > 0) {
      const { error: locError } = await supabase.from('locations').insert(
        uniqueLocations.map(l => ({
          universe_id: universeId,
          name: l.name,
          description: l.description || null,
          type: l.type || l.location_type || null
        }))
      );
      
      if (locError) {
        logStep('ERROR', `Failed to insert locations: ${locError.message}`);
        errors.push(`Locations insertion: ${locError.message}`);
      }
    }

    // Insert events
    if (uniqueEvents.length > 0) {
      const { error: eventError } = await supabase.from('events').insert(
        uniqueEvents.map((e, index) => ({
          universe_id: universeId,
          name: e.name,
          description: e.description || null,
          timeline_order: index + 1
        }))
      );
      
      if (eventError) {
        logStep('ERROR', `Failed to insert events: ${eventError.message}`);
        errors.push(`Events insertion: ${eventError.message}`);
      }
    }

    // Insert objects
    if (uniqueObjects.length > 0) {
      const { error: objError } = await supabase.from('objects').insert(
        uniqueObjects.map(o => ({
          universe_id: universeId,
          name: o.name,
          description: o.description || null,
          significance: o.significance || null
        }))
      );
      
      if (objError) {
        logStep('ERROR', `Failed to insert objects: ${objError.message}`);
        errors.push(`Objects insertion: ${objError.message}`);
      }
    }

    await updateJobStatus(supabase, universeId, 'PROCESSING', 90);

    // FASE 6: ATUALIZAR STATUS DO UNIVERSO
    logStep('FINALIZATION', 'Updating universe status...');
    await supabase
      .from('universes')
      .update({ processing_status: 'completed' })
      .eq('id', universeId);

    // FASE 7: FINALIZAR JOB
    const finalStatus = errors.length > 0 ? 'COMPLETED_WITH_ERRORS' : 'COMPLETED';
    await updateJobStatus(
      supabase,
      universeId,
      finalStatus,
      100,
      errors.length > 0 ? errors.join('\n') : undefined
    );

    logStep('COMPLETE', `Processing completed! Status: ${finalStatus}`);

    return new Response(
      JSON.stringify({
        success: true,
        status: finalStatus,
        summary: {
          characters: uniqueCharacters.length,
          locations: uniqueLocations.length,
          events: uniqueEvents.length,
          objects: uniqueObjects.length,
          chunks: chunks.length,
          errors: errors.length
        },
        errors: errors.length > 0 ? errors : undefined
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error: any) {
    logStep('ERROR', `Fatal error: ${error.message}`);
    console.error('Processing error:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
