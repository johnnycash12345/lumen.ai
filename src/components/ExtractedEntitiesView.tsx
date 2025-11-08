import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, MapPin, Calendar, Package, Search, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface Character {
  id: string;
  name: string;
  description?: string;
  role?: string;
  importance?: string;
}

interface Location {
  id: string;
  name: string;
  description?: string;
  type?: string;
}

interface Event {
  id: string;
  name: string;
  description?: string;
  timeline_order?: number;
}

interface ObjectItem {
  id: string;
  name: string;
  description?: string;
  significance?: string;
}

interface ExtractedEntitiesViewProps {
  universeId: string;
  onEdit?: (entityType: string, entityId: string) => void;
}

export function ExtractedEntitiesView({ universeId, onEdit }: ExtractedEntitiesViewProps) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [objects, setObjects] = useState<ObjectItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('characters');

  useEffect(() => {
    fetchEntities();
  }, [universeId]);

  const fetchEntities = async () => {
    setIsLoading(true);
    try {
      const [
        { data: charactersData, error: charError },
        { data: locationsData, error: locError },
        { data: eventsData, error: eventError },
        { data: objectsData, error: objError },
      ] = await Promise.all([
        supabase.from('characters').select('*').eq('universe_id', universeId),
        supabase.from('locations').select('*').eq('universe_id', universeId),
        supabase.from('events').select('*').eq('universe_id', universeId),
        supabase.from('objects').select('*').eq('universe_id', universeId),
      ]);

      if (charError) throw charError;
      if (locError) throw locError;
      if (eventError) throw eventError;
      if (objError) throw objError;

      setCharacters(charactersData || []);
      setLocations(locationsData || []);
      setEvents(eventsData || []);
      setObjects(objectsData || []);
    } catch (error: any) {
      console.error('Erro ao buscar entidades:', error);
      toast.error('Erro ao carregar entidades');
    } finally {
      setIsLoading(false);
    }
  };

  const filterItems = <T extends { name: string }>(items: T[]): T[] => {
    if (!searchTerm) return items;
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const EntityCard = ({
    icon: Icon,
    title,
    description,
    badge,
    entityType,
    entityId,
  }: {
    icon: any;
    title: string;
    description?: string;
    badge?: string;
    entityType: string;
    entityId: string;
  }) => (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-foreground truncate">{title}</h3>
            {badge && (
              <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground whitespace-nowrap">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}
          {onEdit && (
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-8"
              onClick={() => onEdit(entityType, entityId)}
            >
              <Edit className="w-3 h-3 mr-1" />
              Editar
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-muted-foreground">Carregando entidades...</div>
      </div>
    );
  }

  const filteredCharacters = filterItems(characters);
  const filteredLocations = filterItems(locations);
  const filteredEvents = filterItems(events);
  const filteredObjects = filterItems(objects);

  return (
    <div className="space-y-6">
      {/* Barra de busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar por nome..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Abas */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="characters" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">Personagens</span>
            <span className="sm:hidden">Pers.</span>
            <span className="ml-1 text-xs">({characters.length})</span>
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="hidden sm:inline">Locais</span>
            <span className="sm:hidden">Loc.</span>
            <span className="ml-1 text-xs">({locations.length})</span>
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span className="hidden sm:inline">Eventos</span>
            <span className="sm:hidden">Evt.</span>
            <span className="ml-1 text-xs">({events.length})</span>
          </TabsTrigger>
          <TabsTrigger value="objects" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Objetos</span>
            <span className="sm:hidden">Obj.</span>
            <span className="ml-1 text-xs">({objects.length})</span>
          </TabsTrigger>
        </TabsList>

        {/* Personagens */}
        <TabsContent value="characters" className="space-y-3 mt-6">
          {filteredCharacters.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? 'Nenhum personagem encontrado' : 'Nenhum personagem extraído'}
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredCharacters.map((character) => (
                <EntityCard
                  key={character.id}
                  icon={User}
                  title={character.name}
                  description={character.description}
                  badge={character.role || character.importance}
                  entityType="character"
                  entityId={character.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Locais */}
        <TabsContent value="locations" className="space-y-3 mt-6">
          {filteredLocations.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? 'Nenhum local encontrado' : 'Nenhum local extraído'}
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredLocations.map((location) => (
                <EntityCard
                  key={location.id}
                  icon={MapPin}
                  title={location.name}
                  description={location.description}
                  badge={location.type}
                  entityType="location"
                  entityId={location.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Eventos */}
        <TabsContent value="events" className="space-y-3 mt-6">
          {filteredEvents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? 'Nenhum evento encontrado' : 'Nenhum evento extraído'}
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredEvents.map((event) => (
                <EntityCard
                  key={event.id}
                  icon={Calendar}
                  title={event.name}
                  description={event.description}
                  badge={event.timeline_order ? `Ordem: ${event.timeline_order}` : undefined}
                  entityType="event"
                  entityId={event.id}
                />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Objetos */}
        <TabsContent value="objects" className="space-y-3 mt-6">
          {filteredObjects.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {searchTerm ? 'Nenhum objeto encontrado' : 'Nenhum objeto extraído'}
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredObjects.map((object) => (
                <EntityCard
                  key={object.id}
                  icon={Package}
                  title={object.name}
                  description={object.description}
                  badge={object.significance}
                  entityType="object"
                  entityId={object.id}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
