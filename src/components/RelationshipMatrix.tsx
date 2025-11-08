import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Grid3x3, Loader2, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface Character {
  id: string;
  name: string;
}

interface Relationship {
  id: string;
  source_id: string;
  target_id: string;
  relationship_type: string;
  description: string | null;
}

interface RelationshipMatrixProps {
  universeId: string;
}

const RELATIONSHIP_TYPES = [
  { value: 'friend', label: 'Amigo', color: 'bg-green-500' },
  { value: 'enemy', label: 'Inimigo', color: 'bg-red-500' },
  { value: 'family', label: 'Família', color: 'bg-blue-500' },
  { value: 'rival', label: 'Rival', color: 'bg-orange-500' },
  { value: 'mentor', label: 'Mentor', color: 'bg-purple-500' },
  { value: 'love', label: 'Romance', color: 'bg-pink-500' },
  { value: 'ally', label: 'Aliado', color: 'bg-emerald-500' },
  { value: 'neutral', label: 'Neutro', color: 'bg-gray-500' },
];

export const RelationshipMatrix = ({ universeId }: RelationshipMatrixProps) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, [universeId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [charsRes, relsRes] = await Promise.all([
        supabase
          .from('characters')
          .select('id, name')
          .eq('universe_id', universeId)
          .order('name')
          .limit(20), // Limitar para não sobrecarregar a matriz
        supabase
          .from('relationships')
          .select('*')
          .eq('universe_id', universeId)
          .eq('source_type', 'character')
          .eq('target_type', 'character'),
      ]);

      if (charsRes.error) throw charsRes.error;
      if (relsRes.error) throw relsRes.error;

      setCharacters(charsRes.data || []);
      setRelationships(relsRes.data || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast.error('Erro ao carregar relacionamentos');
    } finally {
      setLoading(false);
    }
  };

  const getRelationship = (sourceId: string, targetId: string): Relationship | null => {
    return relationships.find(
      rel =>
        (rel.source_id === sourceId && rel.target_id === targetId) ||
        (rel.source_id === targetId && rel.target_id === sourceId)
    ) || null;
  };

  const getRelationshipColor = (rel: Relationship | null): string => {
    if (!rel) return 'bg-muted';
    const type = RELATIONSHIP_TYPES.find(t => t.value === rel.relationship_type);
    return type?.color || 'bg-muted';
  };

  const getRelationshipLabel = (rel: Relationship | null): string => {
    if (!rel) return 'Sem relação';
    const type = RELATIONSHIP_TYPES.find(t => t.value === rel.relationship_type);
    return type?.label || rel.relationship_type;
  };

  const calculateStats = () => {
    const stats: Record<string, number> = {};
    
    relationships.forEach(rel => {
      stats[rel.relationship_type] = (stats[rel.relationship_type] || 0) + 1;
    });

    const total = relationships.length;
    const mostCommon = Object.entries(stats)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return { stats, total, mostCommon };
  };

  const { stats, total, mostCommon } = calculateStats();

  const filteredCharacters = characters;

  const filteredRelationships = filter === 'all' 
    ? relationships 
    : relationships.filter(rel => rel.relationship_type === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (characters.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          Nenhum personagem encontrado para criar a matriz
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Estatísticas de Relacionamentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">{total}</div>
              <div className="text-sm text-muted-foreground">Total</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <div className="text-3xl font-bold text-primary">{characters.length}</div>
              <div className="text-sm text-muted-foreground">Personagens</div>
            </div>
            <div className="col-span-2 p-4 bg-muted rounded-lg">
              <div className="text-sm font-semibold mb-2">Mais Comuns</div>
              <div className="space-y-1">
                {mostCommon.map(([type, count]) => {
                  const relType = RELATIONSHIP_TYPES.find(t => t.value === type);
                  return (
                    <div key={type} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${relType?.color}`} />
                        {relType?.label}
                      </span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filtros e Legenda */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Grid3x3 className="h-5 w-5" />
              Matriz de Relacionamentos
            </CardTitle>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filtrar tipo..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                {RELATIONSHIP_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${type.color}`} />
                      {type.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CardDescription>
            Visualização em matriz dos relacionamentos entre personagens
          </CardDescription>
        </CardHeader>

        <CardContent>
          {/* Legenda */}
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Legenda</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {RELATIONSHIP_TYPES.map(type => (
                <div key={type.value} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${type.color}`} />
                  <span className="text-xs">{type.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Matriz */}
          <ScrollArea className="w-full">
            <div className="min-w-[600px]">
              <TooltipProvider>
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 border bg-muted/50 sticky left-0 z-10"></th>
                      {filteredCharacters.map(char => (
                        <th
                          key={char.id}
                          className="p-2 border bg-muted/50 text-xs font-medium text-center"
                          style={{ minWidth: '80px' }}
                        >
                          <div className="truncate" title={char.name}>
                            {char.name.length > 10 ? char.name.substring(0, 10) + '...' : char.name}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCharacters.map(sourceChar => (
                      <tr key={sourceChar.id}>
                        <td className="p-2 border bg-muted/50 font-medium text-xs sticky left-0 z-10">
                          <div className="truncate" title={sourceChar.name}>
                            {sourceChar.name.length > 10 
                              ? sourceChar.name.substring(0, 10) + '...' 
                              : sourceChar.name}
                          </div>
                        </td>
                        {filteredCharacters.map(targetChar => {
                          // Não mostrar relacionamento consigo mesmo
                          if (sourceChar.id === targetChar.id) {
                            return (
                              <td key={targetChar.id} className="p-2 border bg-muted/20">
                                <div className="w-full h-8 bg-muted rounded" />
                              </td>
                            );
                          }

                          const rel = getRelationship(sourceChar.id, targetChar.id);
                          const shouldShow = filter === 'all' || rel?.relationship_type === filter;

                          if (!shouldShow && rel) {
                            return (
                              <td key={targetChar.id} className="p-2 border">
                                <div className="w-full h-8 bg-muted/50 rounded opacity-30" />
                              </td>
                            );
                          }

                          return (
                            <td key={targetChar.id} className="p-2 border">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <div
                                    className={`w-full h-8 rounded cursor-pointer transition-all hover:scale-105 ${getRelationshipColor(rel)}`}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <div className="text-sm">
                                    <div className="font-semibold">
                                      {sourceChar.name} ↔ {targetChar.name}
                                    </div>
                                    <div className="text-xs text-muted-foreground">
                                      {getRelationshipLabel(rel)}
                                    </div>
                                    {rel?.description && (
                                      <div className="text-xs mt-1 max-w-xs">
                                        {rel.description}
                                      </div>
                                    )}
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TooltipProvider>
            </div>
          </ScrollArea>

          <div className="mt-4 text-xs text-muted-foreground text-center">
            Passe o mouse sobre as células para ver detalhes dos relacionamentos
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
