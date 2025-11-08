import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, MapPin, Calendar, Package, Search, Edit, Loader2 } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  description: string | null;
  role: string | null;
  importance: string | null;
}

interface Location {
  id: string;
  name: string;
  description: string | null;
  type: string | null;
}

interface Event {
  id: string;
  name: string;
  description: string | null;
  timeline_order: number | null;
}

interface ObjectEntity {
  id: string;
  name: string;
  description: string | null;
  significance: string | null;
}

interface ExtractedEntitiesViewProps {
  universeId: string;
  onEdit?: (entityType: string, entityId: string) => void;
}

export const ExtractedEntitiesView = ({ universeId, onEdit }: ExtractedEntitiesViewProps) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [objects, setObjects] = useState<ObjectEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('characters');

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
    } finally {
      setLoading(false);
    }
  };

  const filterByName = <T extends { name: string }>(items: T[]): T[] => {
    if (!searchTerm) return items;
    return items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const EntityCard = ({ 
    icon: Icon, 
    title, 
    description, 
    badges = [],
    entityType,
    entityId 
  }: { 
    icon: any; 
    title: string; 
    description: string | null; 
    badges?: { label: string; variant?: 'default' | 'secondary' | 'outline' }[];
    entityType: string;
    entityId: string;
  }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              {badges.length > 0 && (
                <div className="flex gap-2 mt-2">
                  {badges.map((badge, idx) => (
                    <Badge key={idx} variant={badge.variant || 'secondary'}>
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          {onEdit && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(entityType, entityId)}
            >
              <Edit className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      {description && (
        <CardContent>
          <CardDescription className="line-clamp-3">{description}</CardDescription>
        </CardContent>
      )}
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const totalEntities = characters.length + locations.length + events.length + objects.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Entidades Extraídas</h2>
          <p className="text-muted-foreground">{totalEntities} entidades encontradas</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="characters" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Personagens</span>
            <Badge variant="secondary" className="ml-1">{characters.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="locations" className="gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Locais</span>
            <Badge variant="secondary" className="ml-1">{locations.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Eventos</span>
            <Badge variant="secondary" className="ml-1">{events.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="objects" className="gap-2">
            <Package className="h-4 w-4" />
            <span className="hidden sm:inline">Objetos</span>
            <Badge variant="secondary" className="ml-1">{objects.length}</Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="characters" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterByName(characters).map((char) => (
              <EntityCard
                key={char.id}
                icon={Users}
                title={char.name}
                description={char.description}
                badges={[
                  ...(char.role ? [{ label: char.role, variant: 'default' as const }] : []),
                  ...(char.importance ? [{ label: char.importance, variant: 'outline' as const }] : []),
                ]}
                entityType="character"
                entityId={char.id}
              />
            ))}
            {filterByName(characters).length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Nenhum personagem encontrado
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterByName(locations).map((loc) => (
              <EntityCard
                key={loc.id}
                icon={MapPin}
                title={loc.name}
                description={loc.description}
                badges={loc.type ? [{ label: loc.type, variant: 'secondary' as const }] : []}
                entityType="location"
                entityId={loc.id}
              />
            ))}
            {filterByName(locations).length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Nenhum local encontrado
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterByName(events).map((event) => (
              <EntityCard
                key={event.id}
                icon={Calendar}
                title={event.name}
                description={event.description}
                badges={event.timeline_order ? [{ label: `#${event.timeline_order}`, variant: 'outline' as const }] : []}
                entityType="event"
                entityId={event.id}
              />
            ))}
            {filterByName(events).length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Nenhum evento encontrado
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="objects" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filterByName(objects).map((obj) => (
              <EntityCard
                key={obj.id}
                icon={Package}
                title={obj.name}
                description={obj.description}
                badges={obj.significance ? [{ label: obj.significance, variant: 'secondary' as const }] : []}
                entityType="object"
                entityId={obj.id}
              />
            ))}
            {filterByName(objects).length === 0 && (
              <div className="col-span-full text-center py-12 text-muted-foreground">
                Nenhum objeto encontrado
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
