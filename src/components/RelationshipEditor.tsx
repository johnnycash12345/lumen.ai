import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Edit, Network, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ForceGraph2D from 'react-force-graph-2d';

interface Entity {
  id: string;
  name: string;
  type: 'character' | 'location' | 'event' | 'object';
}

interface Relationship {
  id: string;
  source_id: string;
  target_id: string;
  source_type: string;
  target_type: string;
  relationship_type: string;
  description: string | null;
}

interface GraphNode {
  id: string;
  name: string;
  type: string;
  color: string;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
  color: string;
}

interface RelationshipEditorProps {
  universeId: string;
}

const RELATIONSHIP_TYPES = [
  { value: 'friend', label: 'Amigo', color: '#22c55e' },
  { value: 'enemy', label: 'Inimigo', color: '#ef4444' },
  { value: 'family', label: 'Família', color: '#3b82f6' },
  { value: 'rival', label: 'Rival', color: '#f59e0b' },
  { value: 'mentor', label: 'Mentor', color: '#8b5cf6' },
  { value: 'love', label: 'Romance', color: '#ec4899' },
  { value: 'ally', label: 'Aliado', color: '#10b981' },
  { value: 'neutral', label: 'Neutro', color: '#6b7280' },
];

const ENTITY_COLORS = {
  character: '#6366f1',
  location: '#14b8a6',
  event: '#f59e0b',
  object: '#8b5cf6',
};

export const RelationshipEditor = ({ universeId }: RelationshipEditorProps) => {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [graphData, setGraphData] = useState<{ nodes: GraphNode[]; links: GraphLink[] }>({ nodes: [], links: [] });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingRel, setEditingRel] = useState<Relationship | null>(null);
  
  const [newRel, setNewRel] = useState({
    source_id: '',
    target_id: '',
    relationship_type: 'friend',
    description: '',
  });

  const graphRef = useRef<any>();

  useEffect(() => {
    fetchData();
  }, [universeId]);

  useEffect(() => {
    buildGraphData();
  }, [entities, relationships]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Buscar todas as entidades
      const [charsRes, locsRes, eventsRes, objsRes, relsRes] = await Promise.all([
        supabase.from('characters').select('id, name').eq('universe_id', universeId),
        supabase.from('locations').select('id, name').eq('universe_id', universeId),
        supabase.from('events').select('id, name').eq('universe_id', universeId),
        supabase.from('objects').select('id, name').eq('universe_id', universeId),
        supabase.from('relationships').select('*').eq('universe_id', universeId),
      ]);

      const allEntities: Entity[] = [
        ...(charsRes.data?.map(c => ({ ...c, type: 'character' as const })) || []),
        ...(locsRes.data?.map(l => ({ ...l, type: 'location' as const })) || []),
        ...(eventsRes.data?.map(e => ({ ...e, type: 'event' as const })) || []),
        ...(objsRes.data?.map(o => ({ ...o, type: 'object' as const })) || []),
      ];

      setEntities(allEntities);
      setRelationships(relsRes.data || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast.error('Erro ao carregar relacionamentos');
    } finally {
      setLoading(false);
    }
  };

  const buildGraphData = () => {
    const nodes: GraphNode[] = entities.map(entity => ({
      id: entity.id,
      name: entity.name,
      type: entity.type,
      color: ENTITY_COLORS[entity.type],
    }));

    const links: GraphLink[] = relationships.map(rel => {
      const relType = RELATIONSHIP_TYPES.find(t => t.value === rel.relationship_type);
      return {
        source: rel.source_id,
        target: rel.target_id,
        label: relType?.label || rel.relationship_type,
        color: relType?.color || '#6b7280',
      };
    });

    setGraphData({ nodes, links });
  };

  const handleCreateOrUpdate = async () => {
    if (!newRel.source_id || !newRel.target_id) {
      toast.error('Selecione origem e destino');
      return;
    }

    if (newRel.source_id === newRel.target_id) {
      toast.error('Origem e destino devem ser diferentes');
      return;
    }

    try {
      const sourceEntity = entities.find(e => e.id === newRel.source_id);
      const targetEntity = entities.find(e => e.id === newRel.target_id);

      if (!sourceEntity || !targetEntity) {
        toast.error('Entidades não encontradas');
        return;
      }

      const relData = {
        universe_id: universeId,
        source_id: newRel.source_id,
        target_id: newRel.target_id,
        source_type: sourceEntity.type,
        target_type: targetEntity.type,
        relationship_type: newRel.relationship_type,
        description: newRel.description.trim() || null,
      };

      if (editingRel) {
        // Atualizar
        const { error } = await supabase
          .from('relationships')
          .update(relData)
          .eq('id', editingRel.id);

        if (error) throw error;
        toast.success('Relacionamento atualizado');
      } else {
        // Criar
        const { error } = await supabase
          .from('relationships')
          .insert(relData);

        if (error) throw error;
        toast.success('Relacionamento criado');
      }

      setIsDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar relacionamento');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('relationships')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Relacionamento removido');
      fetchData();
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao remover relacionamento');
    }
  };

  const handleEdit = (rel: Relationship) => {
    setEditingRel(rel);
    setNewRel({
      source_id: rel.source_id,
      target_id: rel.target_id,
      relationship_type: rel.relationship_type,
      description: rel.description || '',
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setNewRel({
      source_id: '',
      target_id: '',
      relationship_type: 'friend',
      description: '',
    });
    setEditingRel(null);
  };

  const handleDialogClose = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5" />
                Editor de Relacionamentos
              </CardTitle>
              <CardDescription>
                Visualize e edite as conexões entre entidades do universo
              </CardDescription>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Relacionamento
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingRel ? 'Editar Relacionamento' : 'Novo Relacionamento'}
                  </DialogTitle>
                  <DialogDescription>
                    Defina a conexão entre duas entidades
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Origem *</Label>
                    <Select
                      value={newRel.source_id}
                      onValueChange={(value) => setNewRel({ ...newRel, source_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a origem..." />
                      </SelectTrigger>
                      <SelectContent>
                        {entities.map(entity => (
                          <SelectItem key={entity.id} value={entity.id}>
                            <Badge variant="outline" className="mr-2">
                              {entity.type}
                            </Badge>
                            {entity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Destino *</Label>
                    <Select
                      value={newRel.target_id}
                      onValueChange={(value) => setNewRel({ ...newRel, target_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o destino..." />
                      </SelectTrigger>
                      <SelectContent>
                        {entities.map(entity => (
                          <SelectItem key={entity.id} value={entity.id}>
                            <Badge variant="outline" className="mr-2">
                              {entity.type}
                            </Badge>
                            {entity.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Tipo de Relacionamento *</Label>
                    <Select
                      value={newRel.relationship_type}
                      onValueChange={(value) => setNewRel({ ...newRel, relationship_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {RELATIONSHIP_TYPES.map(type => (
                          <SelectItem key={type.value} value={type.value}>
                            <span className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: type.color }}
                              />
                              {type.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Descrição (opcional)</Label>
                    <Input
                      value={newRel.description}
                      onChange={(e) => setNewRel({ ...newRel, description: e.target.value })}
                      placeholder="Detalhe sobre esse relacionamento..."
                      maxLength={200}
                    />
                  </div>

                  <Button onClick={handleCreateOrUpdate} className="w-full">
                    {editingRel ? 'Atualizar' : 'Criar'} Relacionamento
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>

        <CardContent>
          {/* Legenda */}
          <div className="mb-4 p-4 bg-muted rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Legenda</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {RELATIONSHIP_TYPES.map(type => (
                <div key={type.value} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-xs">{type.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Grafo */}
          <div className="border rounded-lg overflow-hidden bg-background" style={{ height: '600px' }}>
            {graphData.nodes.length > 0 ? (
              <ForceGraph2D
                ref={graphRef}
                graphData={graphData}
                nodeLabel="name"
                nodeColor="color"
                linkColor="color"
                linkLabel="label"
                linkDirectionalArrowLength={6}
                linkDirectionalArrowRelPos={1}
                nodeCanvasObject={(node: any, ctx, globalScale) => {
                  const label = node.name;
                  const fontSize = 12 / globalScale;
                  ctx.font = `${fontSize}px Sans-Serif`;
                  
                  // Desenhar círculo
                  ctx.beginPath();
                  ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
                  ctx.fillStyle = node.color;
                  ctx.fill();
                  
                  // Desenhar label
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = '#fff';
                  ctx.fillText(label, node.x, node.y + 10);
                }}
                onNodeClick={(node: any) => {
                  const entity = entities.find(e => e.id === node.id);
                  if (entity) {
                    toast.info(`${entity.type}: ${entity.name}`);
                  }
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Nenhum relacionamento criado ainda
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Relacionamentos */}
      <Card>
        <CardHeader>
          <CardTitle>Relacionamentos ({relationships.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {relationships.map(rel => {
              const source = entities.find(e => e.id === rel.source_id);
              const target = entities.find(e => e.id === rel.target_id);
              const relType = RELATIONSHIP_TYPES.find(t => t.value === rel.relationship_type);

              return (
                <div
                  key={rel.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: relType?.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">
                        {source?.name} → {target?.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {relType?.label} {rel.description && `• ${rel.description}`}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(rel)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(rel.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              );
            })}

            {relationships.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Nenhum relacionamento criado. Clique em "Novo Relacionamento" para começar.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
