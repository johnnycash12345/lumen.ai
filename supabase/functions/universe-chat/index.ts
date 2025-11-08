import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
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
    const { question, context } = await req.json();
    
    const DEEPSEEK_API_KEY = Deno.env.get('DEEPSEEK_API_KEY');
    if (!DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY não configurado');
    }

    console.log('Processando pergunta:', question);
    console.log('Contexto:', context);

    // Criar prompt enriquecido com contexto
    const systemPrompt = `Você é um especialista em narrativas e universos ficcionais. 
Responda perguntas sobre o universo de forma clara, detalhada e enciclopédica.
Use o contexto fornecido para dar respostas precisas e ricas em detalhes.

Contexto do universo:
${context}

Formato de resposta:
- Use markdown para formatação
- Seja informativo e preciso
- Cite personagens, locais e eventos relevantes
- Mantenha um tom enciclopédico mas acessível`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: question }
        ],
        temperature: 0.3,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro Deepseek:', response.status, errorText);
      throw new Error(`Erro na API Deepseek: ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;

    console.log('Resposta gerada com sucesso');

    return new Response(
      JSON.stringify({ answer }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro no chat:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao processar pergunta';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
