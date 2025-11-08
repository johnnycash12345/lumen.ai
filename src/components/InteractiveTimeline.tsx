import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Calendar, ChevronDown, ChevronUp, Clock, Filter, Loader2, Users } from 'lucide-react';
import { toast } from 'sonner';

interface Event {
  id: string;
  name: string;
  description: string | null;
  timeline_order: number | null;
  universe_id: string;
  created_at: string;
}

interface Character {
  id: string;
  name: string;
}

interface InteractiveTimelineProps {
  universeId: string;
}

export const InteractiveTimeline = ({ universeId }: InteractiveTimelineProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [orderFilter, setOrderFilter] = useState<'all' | 'ordered' | 'unordered'>('all');
  const [selectedCharacter, setSelectedCharacter] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, [universeId]);

  useEffect(() => {
    applyFilters();
  }, [events, searchTerm, orderFilter, selectedCharacter]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Buscar eventos
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .eq('universe_id', universeId)
        .order('timeline_order', { ascending: true, nullsFirst: false });

      if (eventsError) throw eventsError;

      // Buscar personagens para filtro
      const { data: charsData, error: charsError } = await supabase
        .from('characters')
        .select('id, name')
        .eq('universe_id', universeId)
        .order('name');

      if (charsError) throw charsError;

      setEvents(eventsData || []);
      setCharacters(charsData || []);
      setFilteredEvents(eventsData || []);
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      toast.error('Erro ao carregar eventos');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = async () => {
    let filtered = [...events];

    // Filtro de busca por nome
    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por ordem
    if (orderFilter === 'ordered') {
      filtered = filtered.filter(event => event.timeline_order !== null);
    } else if (orderFilter === 'unordered') {
      filtered = filtered.filter(event => event.timeline_order === null);
    }

    // Filtro por personagem (via relacionamentos)
    if (selectedCharacter !== 'all') {
      try {
        const { data: relationships } = await supabase
          .from('relationships')
          .select('target_id, source_id')
          .eq('universe_id', universeId)
          .or(`source_id.eq.${selectedCharacter},target_id.eq.${selectedCharacter}`);

        const relatedEventIds = new Set<string>();
        relationships?.forEach(rel => {
          // Buscar eventos relacionados aos personagens conectados
          const relatedId = rel.source_id === selectedCharacter ? rel.target_id : rel.source_id;
          relatedEventIds.add(relatedId);
        });

        // Filtrar eventos que mencionam o personagem na descrição
        filtered = filtered.filter(event => {
          const characterName = characters.find(c => c.id === selectedCharacter)?.name;
          return (
            event.description?.includes(characterName || '') ||
            relatedEventIds.has(event.id)
          );
        });
      } catch (error) {
        console.error('Erro ao filtrar por personagem:', error);
      }
    }

    setFilteredEvents(filtered);
  };

  const toggleExpand = (eventId: string) => {
    const newExpanded = new Set(expandedEvents);
    if (newExpanded.has(eventId)) {
      newExpanded.delete(eventId);
    } else {
      newExpanded.add(eventId);
    }
    setExpandedEvents(newExpanded);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setOrderFilter('all');
    setSelectedCharacter('all');
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
      {/* Filtros */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Buscar Evento</Label>
              <Input
                placeholder="Nome ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Ordenação</Label>
              <Select value={orderFilter} onValueChange={(value: any) => setOrderFilter(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="ordered">Com Ordem</SelectItem>
                  <SelectItem value="unordered">Sem Ordem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Personagem</Label>
              <Select value={selectedCharacter} onValueChange={setSelectedCharacter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  {characters.map(char => (
                    <SelectItem key={char.id} value={char.id}>
                      {char.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-muted-foreground">
              {filteredEvents.length} {filteredEvents.length === 1 ? 'evento' : 'eventos'} encontrados
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Linha do Tempo
          </CardTitle>
          <CardDescription>
            Explore os eventos cronológicos do universo
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              Nenhum evento encontrado com os filtros aplicados
            </div>
          ) : (
            <div className="relative">
              {/* Linha vertical */}
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border" />

              {/* Eventos */}
              <div className="space-y-6">
                {filteredEvents.map((event, index) => {
                  const isExpanded = expandedEvents.has(event.id);
                  
                  return (
                    <div
                      key={event.id}
                      className="relative pl-20 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Marcador */}
                      <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-primary border-4 border-background shadow-lg" />

                      {/* Card do Evento */}
                      <Collapsible open={isExpanded} onOpenChange={() => toggleExpand(event.id)}>
                        <Card className="hover:shadow-lg transition-shadow">
                          <CollapsibleTrigger asChild>
                            <CardHeader className="cursor-pointer">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <CardTitle className="text-lg">{event.name}</CardTitle>
                                    {event.timeline_order !== null && (
                                      <Badge variant="outline" className="ml-2">
                                        <Clock className="h-3 w-3 mr-1" />
                                        #{event.timeline_order}
                                      </Badge>
                                    )}
                                  </div>
                                  {event.description && !isExpanded && (
                                    <CardDescription className="line-clamp-2">
                                      {event.description}
                                    </CardDescription>
                                  )}
                                </div>
                                <Button variant="ghost" size="icon">
                                  {isExpanded ? (
                                    <ChevronUp className="h-4 w-4" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </CardHeader>
                          </CollapsibleTrigger>

                          <CollapsibleContent>
                            <CardContent className="animate-fade-in">
                              {event.description && (
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="text-sm font-semibold mb-2">Descrição Completa</h4>
                                    <p className="text-sm text-muted-foreground">
                                      {event.description}
                                    </p>
                                  </div>

                                  <div className="flex gap-2 pt-4 border-t">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        // Funcionalidade futura: ver personagens relacionados
                                        toast.info('Ver personagens relacionados');
                                      }}
                                    >
                                      <Users className="h-4 w-4 mr-2" />
                                      Ver Personagens
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => {
                                        // Funcionalidade futura: editar evento
                                        toast.info('Editar evento');
                                      }}
                                    >
                                      Editar Evento
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </CardContent>
                          </CollapsibleContent>
                        </Card>
                      </Collapsible>
                    </div>
                  );
                })}
              </div>

              {/* Fim da Timeline */}
              <div className="relative pl-20 pt-6">
                <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-muted border-4 border-background" />
                <div className="text-sm text-muted-foreground">
                  Fim da Linha do Tempo
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
