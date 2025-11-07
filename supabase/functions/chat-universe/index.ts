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
    const { universe_id, message, conversation_history = [] } = await req.json();
    console.log('Chat request for universe:', universe_id);

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_PUBLISHABLE_KEY') ?? ''
    );

    // Fetch universe data
    const { data: universe } = await supabaseClient
      .from('universes')
      .select('*')
      .eq('id', universe_id)
      .single();

    // Fetch all entities
    const { data: characters } = await supabaseClient
      .from('characters')
      .select('*')
      .eq('universe_id', universe_id);

    const { data: locations } = await supabaseClient
      .from('locations')
      .select('*')
      .eq('universe_id', universe_id);

    const { data: events } = await supabaseClient
      .from('events')
      .select('*')
      .eq('universe_id', universe_id)
      .order('timeline_order');

    const { data: objects } = await supabaseClient
      .from('objects')
      .select('*')
      .eq('universe_id', universe_id);

    const { data: relationships } = await supabaseClient
      .from('relationships')
      .select('*')
      .eq('universe_id', universe_id);

    // Build context for LLM
    const context = `
Universe: ${universe?.title}
Description: ${universe?.description || 'N/A'}

Characters: ${characters?.map(c => `${c.name} (${c.role}) - ${c.description}`).join(', ')}

Locations: ${locations?.map(l => `${l.name} (${l.type}) - ${l.description}`).join(', ')}

Events: ${events?.map(e => `${e.name} - ${e.description}`).join(', ')}

Objects: ${objects?.map(o => `${o.name} - ${o.description} (${o.significance})`).join(', ')}

Relationships: ${relationships?.map(r => `${r.source_type} ${r.source_id} ${r.relationship_type} ${r.target_type} ${r.target_id}`).join(', ')}
    `;

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    const chatResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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
            content: `You are an expert on the fictional universe "${universe?.title}". Answer questions about characters, locations, events, objects, and relationships in this universe. Use the following context:\n\n${context}\n\nBe helpful, accurate, and engaging. If you don't have enough information, say so.`
          },
          ...conversation_history,
          {
            role: 'user',
            content: message
          }
        ],
      }),
    });

    const chatData = await chatResponse.json();
    const reply = chatData.choices?.[0]?.message?.content || 'Sorry, I could not process your request.';

    return new Response(
      JSON.stringify({ 
        success: true, 
        reply,
        context_used: {
          characters: characters?.length || 0,
          locations: locations?.length || 0,
          events: events?.length || 0,
          objects: objects?.length || 0,
          relationships: relationships?.length || 0
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
