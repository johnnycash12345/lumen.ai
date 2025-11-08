import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FileText, Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratePagesProps {
  universeId: string;
  onComplete?: (universeId: string) => void;
}

interface EntityCount {
  characters: number;
  locations: number;
  events: number;
  objects: number;
  total: number;
}

export const GeneratePages = ({ universeId, onComplete }: GeneratePagesProps) => {
  const [generating, setGenerating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentEntity, setCurrentEntity] = useState('');
  const [counts, setCounts] = useState<EntityCount>({
    characters: 0,
    locations: 0,
    events: 0,
    objects: 0,
    total: 0,
  });

  const generatePages = async () => {
    try {
      setGenerating(true);
      setProgress(0);
      setCompleted(false);

      // 1. Buscar todas as entidades
      setCurrentEntity('Carregando entidades...');
      const [charsRes, locsRes, eventsRes, objsRes] = await Promise.all([
        supabase.from('characters').select('id, name').eq('universe_id', universeId),
        supabase.from('locations').select('id, name').eq('universe_id', universeId),
        supabase.from('events').select('id, name').eq('universe_id', universeId),
        supabase.from('objects').select('id, name').eq('universe_id', universeId),
      ]);

      if (charsRes.error) throw charsRes.error;
      if (locsRes.error) throw locsRes.error;
      if (eventsRes.error) throw eventsRes.error;
      if (objsRes.error) throw objsRes.error;

      const chars = charsRes.data || [];
      const locs = locsRes.data || [];
      const events = eventsRes.data || [];
      const objs = objsRes.data || [];

      const totalEntities = chars.length + locs.length + events.length + objs.length;

      if (totalEntities === 0) {
        toast.error('Nenhuma entidade encontrada para gerar páginas');
        setGenerating(false);
        return;
      }

      setCounts({
        characters: chars.length,
        locations: locs.length,
        events: events.length,
        objects: objs.length,
        total: totalEntities,
      });

      let processed = 0;

      // 2. Gerar páginas para cada tipo de entidade
      const pagesToCreate = [];

      // Personagens
      for (const char of chars) {
        setCurrentEntity(`Gerando página: ${char.name}`);
        const slug = char.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        pagesToCreate.push({
          universe_id: universeId,
          entity_id: char.id,
          type: 'character',
          slug: `character-${slug}`,
          status: 'PUBLISHED',
        });

        processed++;
        setProgress((processed / totalEntities) * 100);
        
        // Pequeno delay para visualização do progresso
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Locais
      for (const loc of locs) {
        setCurrentEntity(`Gerando página: ${loc.name}`);
        const slug = loc.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        pagesToCreate.push({
          universe_id: universeId,
          entity_id: loc.id,
          type: 'location',
          slug: `location-${slug}`,
          status: 'PUBLISHED',
        });

        processed++;
        setProgress((processed / totalEntities) * 100);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Eventos
      for (const event of events) {
        setCurrentEntity(`Gerando página: ${event.name}`);
        const slug = event.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        pagesToCreate.push({
          universe_id: universeId,
          entity_id: event.id,
          type: 'event',
          slug: `event-${slug}`,
          status: 'PUBLISHED',
        });

        processed++;
        setProgress((processed / totalEntities) * 100);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // Objetos
      for (const obj of objs) {
        setCurrentEntity(`Gerando página: ${obj.name}`);
        const slug = obj.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        
        pagesToCreate.push({
          universe_id: universeId,
          entity_id: obj.id,
          type: 'object',
          slug: `object-${slug}`,
          status: 'PUBLISHED',
        });

        processed++;
        setProgress((processed / totalEntities) * 100);
        await new Promise(resolve => setTimeout(resolve, 50));
      }

      // 3. Inserir todas as páginas no banco
      setCurrentEntity('Salvando páginas no banco de dados...');
      
      // Deletar páginas antigas primeiro
      await supabase.from('pages').delete().eq('universe_id', universeId);

      // Inserir novas páginas
      const { error: insertError } = await supabase
        .from('pages')
        .insert(pagesToCreate);

      if (insertError) throw insertError;

      // 4. Completar
      setProgress(100);
      setCurrentEntity('Concluído!');
      setCompleted(true);
      toast.success(`${totalEntities} páginas geradas com sucesso!`);

    } catch (error) {
      console.error('Erro ao gerar páginas:', error);
      toast.error('Erro ao gerar páginas');
    } finally {
      setGenerating(false);
    }
  };

  const handleViewUniverse = () => {
    if (onComplete) {
      onComplete(universeId);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Geração de Páginas
        </CardTitle>
        <CardDescription>
          Crie páginas automaticamente para todas as entidades do universo
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {!generating && !completed && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-semibold mb-2">O que será gerado?</h4>
              <p className="text-sm text-muted-foreground">
                Uma página individual será criada para cada personagem, local, evento e objeto do seu universo.
                Isso permitirá navegação detalhada e exploração completa do universo.
              </p>
            </div>

            <Button
              onClick={generatePages}
              className="w-full"
              size="lg"
            >
              <Sparkles className="h-5 w-5 mr-2" />
              Gerar Páginas Automaticamente
            </Button>
          </div>
        )}

        {generating && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-semibold">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <div className="flex items-center gap-3">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <div className="flex-1">
                  <div className="font-medium">
                    Gerando {counts.total} páginas...
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {currentEntity}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{counts.characters}</div>
                <div className="text-xs text-muted-foreground">Personagens</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{counts.locations}</div>
                <div className="text-xs text-muted-foreground">Locais</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{counts.events}</div>
                <div className="text-xs text-muted-foreground">Eventos</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary">{counts.objects}</div>
                <div className="text-xs text-muted-foreground">Objetos</div>
              </div>
            </div>
          </div>
        )}

        {completed && (
          <div className="space-y-4">
            <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
              <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Páginas Geradas com Sucesso!
              </h3>
              <p className="text-sm text-green-700">
                {counts.total} páginas foram criadas e estão prontas para exploração
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Badge variant="outline" className="justify-center py-3">
                <FileText className="h-4 w-4 mr-2" />
                {counts.characters} Personagens
              </Badge>
              <Badge variant="outline" className="justify-center py-3">
                <FileText className="h-4 w-4 mr-2" />
                {counts.locations} Locais
              </Badge>
              <Badge variant="outline" className="justify-center py-3">
                <FileText className="h-4 w-4 mr-2" />
                {counts.events} Eventos
              </Badge>
              <Badge variant="outline" className="justify-center py-3">
                <FileText className="h-4 w-4 mr-2" />
                {counts.objects} Objetos
              </Badge>
            </div>

            <Button
              onClick={handleViewUniverse}
              size="lg"
              className="w-full"
            >
              <CheckCircle2 className="h-5 w-5 mr-2" />
              Ver Universo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
