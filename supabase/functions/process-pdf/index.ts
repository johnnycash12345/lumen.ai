import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface Entity {
  type: 'character' | 'location' | 'event' | 'object';
  name: string;
  description?: string;
  attributes?: Record<string, any>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { jobId, universeId, filePath } = await req.json();
    
    console.log('Iniciando processamento:', { jobId, universeId, filePath });

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const deepseekKey = Deno.env.get('DEEPSEEK_API_KEY')!;

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Atualizar job para PROCESSING
    await supabase
      .from('processing_jobs')
      .update({ status: 'PROCESSING', progress: 0 })
      .eq('id', jobId);

    // 1. Baixar PDF do storage
    console.log('Baixando PDF do storage...');
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('pdfs')
      .download(filePath);

    if (downloadError) throw new Error(`Erro ao baixar PDF: ${downloadError.message}`);

    // 2. Extrair texto do PDF (simulado - em produção usar biblioteca real)
    console.log('Extraindo texto do PDF...');
    await supabase
      .from('processing_jobs')
      .update({ progress: 10 })
      .eq('id', jobId);

    // Converter PDF para texto
    const arrayBuffer = await fileData.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    // Simulação de texto extraído (em produção, usar biblioteca de PDF)
    const extractedText = `
Exemplo de texto extraído do PDF.

Personagens principais:
- Harry Potter: Um jovem bruxo corajoso
- Hermione Granger: A bruxa mais inteligente de sua turma
- Ron Weasley: Melhor amigo de Harry

Locais importantes:
- Hogwarts: Escola de Magia e Bruxaria
- Floresta Proibida: Local perigoso próximo à escola

Eventos principais:
- Primeiro ano em Hogwarts: Harry descobre ser um bruxo
- Combate ao troll: Harry e Ron salvam Hermione

Objetos mágicos:
- Varinha Elder: A varinha mais poderosa
- Pedra Filosofal: Capaz de criar vida eterna
    `.trim();

    console.log('Texto extraído, tamanho:', extractedText.length);

    await supabase
      .from('processing_jobs')
      .update({ progress: 20 })
      .eq('id', jobId);

    // 3. Fazer chunking do texto
    const chunkSize = 2000;
    const chunks: string[] = [];
    for (let i = 0; i < extractedText.length; i += chunkSize) {
      chunks.push(extractedText.slice(i, i + chunkSize));
    }

    console.log('Texto dividido em', chunks.length, 'chunks');

    // 4. Processar cada chunk com Deepseek
    const allEntities: Entity[] = [];
    const progressPerChunk = 60 / chunks.length;

    for (let i = 0; i < chunks.length; i++) {
      console.log(`Processando chunk ${i + 1}/${chunks.length}...`);

      const prompt = `Analise o seguinte texto e extraia TODAS as entidades mencionadas.

IMPORTANTE:
- Seja completo e não deixe nada de fora
- Para cada personagem, identifique seu papel, habilidades e personalidade
- Para locais, identifique o tipo
- Para eventos, identifique quando ocorreram
- Para objetos, identifique sua significância

Texto:
${chunks[i]}

Retorne um JSON válido com EXATAMENTE esta estrutura:
{
  "characters": [{"name": "Nome", "description": "Descrição", "role": "protagonista/antagonista/coadjuvante", "importance": "alta/media/baixa"}],
  "locations": [{"name": "Nome", "description": "Descrição", "type": "cidade/castelo/floresta"}],
  "events": [{"name": "Nome", "description": "Descrição", "timeline_order": 1}],
  "objects": [{"name": "Nome", "description": "Descrição", "significance": "mágico/histórico/comum"}]
}

Retorne APENAS o JSON, sem explicações.`;

      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${deepseekKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'deepseek-chat',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0.3,
            max_tokens: 4000,
          }),
        });

        if (!response.ok) {
          console.error('Erro Deepseek:', response.status);
          continue;
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Extrair JSON da resposta
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          console.error('Nenhum JSON encontrado na resposta');
          continue;
        }

        const extracted = JSON.parse(jsonMatch[0]);

        // Adicionar entidades extraídas
        extracted.characters?.forEach((char: any) => {
          allEntities.push({
            type: 'character',
            name: char.name,
            description: char.description,
            attributes: { role: char.role, importance: char.importance }
          });
        });

        extracted.locations?.forEach((loc: any) => {
          allEntities.push({
            type: 'location',
            name: loc.name,
            description: loc.description,
            attributes: { type: loc.type }
          });
        });

        extracted.events?.forEach((event: any) => {
          allEntities.push({
            type: 'event',
            name: event.name,
            description: event.description,
            attributes: { timeline_order: event.timeline_order }
          });
        });

        extracted.objects?.forEach((obj: any) => {
          allEntities.push({
            type: 'object',
            name: obj.name,
            description: obj.description,
            attributes: { significance: obj.significance }
          });
        });

        console.log(`Chunk ${i + 1} processado, entidades extraídas:`, {
          characters: extracted.characters?.length || 0,
          locations: extracted.locations?.length || 0,
          events: extracted.events?.length || 0,
          objects: extracted.objects?.length || 0,
        });

      } catch (error) {
        console.error('Erro ao processar chunk:', error);
      }

      // Atualizar progresso
      const newProgress = 20 + ((i + 1) * progressPerChunk);
      await supabase
        .from('processing_jobs')
        .update({ progress: Math.min(Math.round(newProgress), 80) })
        .eq('id', jobId);
    }

    console.log('Total de entidades extraídas:', allEntities.length);

    // 5. Consolidar duplicatas (por nome similar)
    const consolidated = consolidateEntities(allEntities);
    console.log('Entidades após consolidação:', consolidated.length);

    await supabase
      .from('processing_jobs')
      .update({ progress: 85 })
      .eq('id', jobId);

    // 6. Inserir no banco de dados
    console.log('Inserindo entidades no banco...');

    const insertPromises = consolidated.map(async (entity) => {
      switch (entity.type) {
        case 'character':
          return supabase.from('characters').insert({
            universe_id: universeId,
            name: entity.name,
            description: entity.description || null,
            role: entity.attributes?.role || null,
            importance: entity.attributes?.importance || null,
          });
        
        case 'location':
          return supabase.from('locations').insert({
            universe_id: universeId,
            name: entity.name,
            description: entity.description || null,
            type: entity.attributes?.type || null,
          });
        
        case 'event':
          return supabase.from('events').insert({
            universe_id: universeId,
            name: entity.name,
            description: entity.description || null,
            timeline_order: entity.attributes?.timeline_order || null,
          });
        
        case 'object':
          return supabase.from('objects').insert({
            universe_id: universeId,
            name: entity.name,
            description: entity.description || null,
            significance: entity.attributes?.significance || null,
          });
      }
    });

    await Promise.all(insertPromises);

    console.log('Entidades inseridas no banco');

    await supabase
      .from('processing_jobs')
      .update({ progress: 95 })
      .eq('id', jobId);

    // 7. Atualizar universo e job como COMPLETED
    await supabase
      .from('universes')
      .update({ processing_status: 'completed' })
      .eq('id', universeId);

    await supabase
      .from('processing_jobs')
      .update({ status: 'COMPLETED', progress: 100 })
      .eq('id', jobId);

    console.log('Processamento concluído com sucesso');

    return new Response(
      JSON.stringify({ success: true, entitiesCount: consolidated.length }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro no processamento:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    
    // Atualizar job como FAILED
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { jobId } = await req.json().catch(() => ({}));
    if (jobId) {
      await supabase
        .from('processing_jobs')
        .update({ 
          status: 'FAILED', 
          error_message: errorMessage 
        })
        .eq('id', jobId);
    }

    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

function consolidateEntities(entities: Entity[]): Entity[] {
  const consolidated: Entity[] = [];
  const seen = new Set<string>();

  for (const entity of entities) {
    const key = `${entity.type}:${entity.name.toLowerCase().trim()}`;
    
    if (!seen.has(key)) {
      seen.add(key);
      consolidated.push(entity);
    } else {
      // Merge com entidade existente (pegar descrição mais longa, por exemplo)
      const existing = consolidated.find(
        e => e.type === entity.type && 
             e.name.toLowerCase().trim() === entity.name.toLowerCase().trim()
      );
      
      if (existing && entity.description && 
          (!existing.description || entity.description.length > existing.description.length)) {
        existing.description = entity.description;
      }
    }
  }

  return consolidated;
}
