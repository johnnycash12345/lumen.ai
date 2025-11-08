import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, MapPin, Calendar, Package, Plus, Save, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Character {
  id: string;
  name: string;
  description: string | null;
  role: string | null;
  importance: string | null;
  universe_id: string;
}

interface Location {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
  universe_id: string;
}

interface Event {
  id: string;
  name: string;
  description: string | null;
  timeline_order: number | null;
  universe_id: string;
}

interface ObjectEntity {
  id: string;
  name: string;
  description: string | null;
  significance: string | null;
  universe_id: string;
}

interface EditEntitiesProps {
  universeId: string;
}

export const EditEntities = ({ universeId }: EditEntitiesProps) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [objects, setObjects] = useState<ObjectEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    fetchEntities();
  }, [universeId]);

  const fetchEntities = async () => {
    try {
      setLoading(true);
      const [charsRes, locsRes, eventsRes, objsRes] = await Promise.all([
        supabase.from('characters').select('*').eq('universe_id', universeId),
        supabase.from('locations').select('*').eq('universe_id', universeId),
        supabase.from('events').select('*').eq('universe_id', universeId).order('timeline_order', { ascending: true, nullsFirst: false }),
        supabase.from('objects').select('*').eq('universe_id', universeId),
      ]);

      if (charsRes.error) throw charsRes.error;
      if (locsRes.error) throw locsRes.error;
      if (eventsRes.error) throw eventsRes.error;
      if (objsRes.error) throw objsRes.error;

      setCharacters(charsRes.data || []);
      setLocations(locsRes.data || []);
      setEvents(eventsRes.data || []);
      setObjects(objsRes.data || []);
    } catch (error) {
      console.error('Erro ao buscar entidades:', error);
      toast.error('Erro ao carregar entidades');
    } finally {
      setLoading(false);
    }
  };

  const saveCharacter = async (char: Character) => {
    if (!char.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    try {
      setSaving(char.id);
      const { error } = await supabase
        .from('characters')
        .update({
          name: char.name.trim(),
          description: char.description?.trim() || null,
          role: char.role?.trim() || null,
          importance: char.importance?.trim() || null,
        })
        .eq('id', char.id);

      if (error) throw error;
      toast.success('Personagem salvo');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar personagem');
    } finally {
      setSaving(null);
    }
  };

  const saveLocation = async (loc: Location) => {
    if (!loc.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    try {
      setSaving(loc.id);
      const { error } = await supabase
        .from('locations')
        .update({
          name: loc.name.trim(),
          description: loc.description?.trim() || null,
          type: loc.type?.trim() || null,
        })
        .eq('id', loc.id);

      if (error) throw error;
      toast.success('Local salvo');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar local');
    } finally {
      setSaving(null);
    }
  };

  const saveEvent = async (event: Event) => {
    if (!event.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    try {
      setSaving(event.id);
      const { error } = await supabase
        .from('events')
        .update({
          name: event.name.trim(),
          description: event.description?.trim() || null,
          timeline_order: event.timeline_order,
        })
        .eq('id', event.id);

      if (error) throw error;
      toast.success('Evento salvo');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar evento');
    } finally {
      setSaving(null);
    }
  };

  const saveObject = async (obj: ObjectEntity) => {
    if (!obj.name.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    try {
      setSaving(obj.id);
      const { error } = await supabase
        .from('objects')
        .update({
          name: obj.name.trim(),
          description: obj.description?.trim() || null,
          significance: obj.significance?.trim() || null,
        })
        .eq('id', obj.id);

      if (error) throw error;
      toast.success('Objeto salvo');
    } catch (error) {
      console.error('Erro ao salvar:', error);
      toast.error('Erro ao salvar objeto');
    } finally {
      setSaving(null);
    }
  };

  const addCharacter = async () => {
    try {
      const { data, error } = await supabase
        .from('characters')
        .insert({
          universe_id: universeId,
          name: 'Novo Personagem',
          description: null,
          role: null,
          importance: null,
        })
        .select()
        .single();

      if (error) throw error;
      setCharacters([...characters, data]);
      toast.success('Personagem adicionado');
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      toast.error('Erro ao adicionar personagem');
    }
  };

  const addLocation = async () => {
    try {
      const { data, error } = await supabase
        .from('locations')
        .insert({
          universe_id: universeId,
          name: 'Novo Local',
          description: null,
          type: null,
        })
        .select()
        .single();

      if (error) throw error;
      setLocations([...locations, data]);
      toast.success('Local adicionado');
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      toast.error('Erro ao adicionar local');
    }
  };

  const addEvent = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          universe_id: universeId,
          name: 'Novo Evento',
          description: null,
          timeline_order: null,
        })
        .select()
        .single();

      if (error) throw error;
      setEvents([...events, data]);
      toast.success('Evento adicionado');
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      toast.error('Erro ao adicionar evento');
    }
  };

  const addObject = async () => {
    try {
      const { data, error } = await supabase
        .from('objects')
        .insert({
          universe_id: universeId,
          name: 'Novo Objeto',
          description: null,
          significance: null,
        })
        .select()
        .single();

      if (error) throw error;
      setObjects([...objects, data]);
      toast.success('Objeto adicionado');
    } catch (error) {
      console.error('Erro ao adicionar:', error);
      toast.error('Erro ao adicionar objeto');
    }
  };

  const deleteCharacter = async (id: string) => {
    try {
      const { error } = await supabase.from('characters').delete().eq('id', id);
      if (error) throw error;
      setCharacters(characters.filter(c => c.id !== id));
      toast.success('Personagem removido');
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao remover personagem');
    }
  };

  const deleteLocation = async (id: string) => {
    try {
      const { error } = await supabase.from('locations').delete().eq('id', id);
      if (error) throw error;
      setLocations(locations.filter(l => l.id !== id));
      toast.success('Local removido');
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao remover local');
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      const { error } = await supabase.from('events').delete().eq('id', id);
      if (error) throw error;
      setEvents(events.filter(e => e.id !== id));
      toast.success('Evento removido');
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao remover evento');
    }
  };

  const deleteObject = async (id: string) => {
    try {
      const { error } = await supabase.from('objects').delete().eq('id', id);
      if (error) throw error;
      setObjects(objects.filter(o => o.id !== id));
      toast.success('Objeto removido');
    } catch (error) {
      console.error('Erro ao deletar:', error);
      toast.error('Erro ao remover objeto');
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
    <Tabs defaultValue="characters" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="characters">
          <Users className="h-4 w-4 mr-2" />
          Personagens
          <Badge variant="secondary" className="ml-2">{characters.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="locations">
          <MapPin className="h-4 w-4 mr-2" />
          Locais
          <Badge variant="secondary" className="ml-2">{locations.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="events">
          <Calendar className="h-4 w-4 mr-2" />
          Eventos
          <Badge variant="secondary" className="ml-2">{events.length}</Badge>
        </TabsTrigger>
        <TabsTrigger value="objects">
          <Package className="h-4 w-4 mr-2" />
          Objetos
          <Badge variant="secondary" className="ml-2">{objects.length}</Badge>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="characters" className="space-y-4 mt-6">
        <Button onClick={addCharacter} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Personagem
        </Button>

        {characters.map((char) => (
          <Card key={char.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Editar Personagem</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteCharacter(char.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  value={char.name}
                  onChange={(e) => {
                    const updated = characters.map(c =>
                      c.id === char.id ? { ...c, name: e.target.value } : c
                    );
                    setCharacters(updated);
                  }}
                  placeholder="Nome do personagem"
                  maxLength={200}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Papel</Label>
                  <Select
                    value={char.role || ''}
                    onValueChange={(value) => {
                      const updated = characters.map(c =>
                        c.id === char.id ? { ...c, role: value } : c
                      );
                      setCharacters(updated);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="protagonista">Protagonista</SelectItem>
                      <SelectItem value="antagonista">Antagonista</SelectItem>
                      <SelectItem value="coadjuvante">Coadjuvante</SelectItem>
                      <SelectItem value="secundario">Secundário</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Importância</Label>
                  <Select
                    value={char.importance || ''}
                    onValueChange={(value) => {
                      const updated = characters.map(c =>
                        c.id === char.id ? { ...c, importance: value } : c
                      );
                      setCharacters(updated);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={char.description || ''}
                  onChange={(e) => {
                    const updated = characters.map(c =>
                      c.id === char.id ? { ...c, description: e.target.value } : c
                    );
                    setCharacters(updated);
                  }}
                  placeholder="Descrição detalhada do personagem..."
                  rows={4}
                  maxLength={2000}
                />
              </div>

              <Button
                onClick={() => saveCharacter(char)}
                disabled={saving === char.id}
                className="w-full"
              >
                {saving === char.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="locations" className="space-y-4 mt-6">
        <Button onClick={addLocation} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Local
        </Button>

        {locations.map((loc) => (
          <Card key={loc.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Editar Local</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteLocation(loc.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  value={loc.name}
                  onChange={(e) => {
                    const updated = locations.map(l =>
                      l.id === loc.id ? { ...l, name: e.target.value } : l
                    );
                    setLocations(updated);
                  }}
                  placeholder="Nome do local"
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label>Tipo</Label>
                <Input
                  value={loc.type || ''}
                  onChange={(e) => {
                    const updated = locations.map(l =>
                      l.id === loc.id ? { ...l, type: e.target.value } : l
                    );
                    setLocations(updated);
                  }}
                  placeholder="Ex: Cidade, Castelo, Floresta..."
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={loc.description || ''}
                  onChange={(e) => {
                    const updated = locations.map(l =>
                      l.id === loc.id ? { ...l, description: e.target.value } : l
                    );
                    setLocations(updated);
                  }}
                  placeholder="Descrição detalhada do local..."
                  rows={4}
                  maxLength={2000}
                />
              </div>

              <Button
                onClick={() => saveLocation(loc)}
                disabled={saving === loc.id}
                className="w-full"
              >
                {saving === loc.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="events" className="space-y-4 mt-6">
        <Button onClick={addEvent} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Evento
        </Button>

        {events.map((event) => (
          <Card key={event.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Editar Evento</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteEvent(event.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Nome *</Label>
                  <Input
                    value={event.name}
                    onChange={(e) => {
                      const updated = events.map(ev =>
                        ev.id === event.id ? { ...ev, name: e.target.value } : ev
                      );
                      setEvents(updated);
                    }}
                    placeholder="Nome do evento"
                    maxLength={200}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Ordem</Label>
                  <Input
                    type="number"
                    value={event.timeline_order || ''}
                    onChange={(e) => {
                      const updated = events.map(ev =>
                        ev.id === event.id ? { ...ev, timeline_order: parseInt(e.target.value) || null } : ev
                      );
                      setEvents(updated);
                    }}
                    placeholder="1, 2, 3..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={event.description || ''}
                  onChange={(e) => {
                    const updated = events.map(ev =>
                      ev.id === event.id ? { ...ev, description: e.target.value } : ev
                    );
                    setEvents(updated);
                  }}
                  placeholder="Descrição detalhada do evento..."
                  rows={4}
                  maxLength={2000}
                />
              </div>

              <Button
                onClick={() => saveEvent(event)}
                disabled={saving === event.id}
                className="w-full"
              >
                {saving === event.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      <TabsContent value="objects" className="space-y-4 mt-6">
        <Button onClick={addObject} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Objeto
        </Button>

        {objects.map((obj) => (
          <Card key={obj.id}>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>Editar Objeto</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteObject(obj.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome *</Label>
                <Input
                  value={obj.name}
                  onChange={(e) => {
                    const updated = objects.map(o =>
                      o.id === obj.id ? { ...o, name: e.target.value } : o
                    );
                    setObjects(updated);
                  }}
                  placeholder="Nome do objeto"
                  maxLength={200}
                />
              </div>

              <div className="space-y-2">
                <Label>Significância</Label>
                <Input
                  value={obj.significance || ''}
                  onChange={(e) => {
                    const updated = objects.map(o =>
                      o.id === obj.id ? { ...o, significance: e.target.value } : o
                    );
                    setObjects(updated);
                  }}
                  placeholder="Ex: Artefato mágico, Herança..."
                  maxLength={100}
                />
              </div>

              <div className="space-y-2">
                <Label>Descrição</Label>
                <Textarea
                  value={obj.description || ''}
                  onChange={(e) => {
                    const updated = objects.map(o =>
                      o.id === obj.id ? { ...o, description: e.target.value } : o
                    );
                    setObjects(updated);
                  }}
                  placeholder="Descrição detalhada do objeto..."
                  rows={4}
                  maxLength={2000}
                />
              </div>

              <Button
                onClick={() => saveObject(obj)}
                disabled={saving === obj.id}
                className="w-full"
              >
                {saving === obj.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Alterações
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  );
};
