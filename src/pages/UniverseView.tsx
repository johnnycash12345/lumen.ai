import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Users, MapPin, Calendar, Box, Network, MessageSquare, Loader2 } from "lucide-react";
import { ChatInterface } from "@/components/ChatInterface";
import { Toaster } from "@/components/ui/toaster";

interface Universe {
  id: string;
  title: string;
  description: string | null;
  processing_status: string;
}

interface Entity {
  id: string;
  name: string;
  description: string | null;
  [key: string]: any;
}

export const UniverseView = () => {
  const [id, setId] = useState<string | null>(null);
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [characters, setCharacters] = useState<Entity[]>([]);
  const [locations, setLocations] = useState<Entity[]>([]);
  const [events, setEvents] = useState<Entity[]>([]);
  const [objects, setObjects] = useState<Entity[]>([]);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const universeId = params.get('id');
    setId(universeId);
  }, []);

  useEffect(() => {
    if (id) {
      fetchUniverseData();
    }
  }, [id]);

  const fetchUniverseData = async () => {
    try {
      const [universeRes, charactersRes, locationsRes, eventsRes, objectsRes, relationshipsRes] = await Promise.all([
        supabase.from("universes").select("*").eq("id", id).single(),
        supabase.from("characters").select("*").eq("universe_id", id),
        supabase.from("locations").select("*").eq("universe_id", id),
        supabase.from("events").select("*").eq("universe_id", id).order("timeline_order"),
        supabase.from("objects").select("*").eq("universe_id", id),
        supabase.from("relationships").select("*").eq("universe_id", id),
      ]);

      setUniverse(universeRes.data);
      setCharacters(charactersRes.data || []);
      setLocations(locationsRes.data || []);
      setEvents(eventsRes.data || []);
      setObjects(objectsRes.data || []);
      setRelationships(relationshipsRes.data || []);
    } catch (error) {
      console.error("Error fetching universe:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!universe) {
    return <div>Universo não encontrado</div>;
  }

  return (
    <>
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <header className="border-b bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            onClick={() => window.location.href = '/dashboard.html'}
            className="mb-2"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold">{universe.title}</h1>
          {universe.description && (
            <p className="text-muted-foreground mt-2">{universe.description}</p>
          )}
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {universe.processing_status === "processing" ? (
          <Card className="p-8 text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <h3 className="text-xl font-semibold mb-2">Processando Universo</h3>
            <p className="text-muted-foreground">
              Aguarde enquanto extraímos todas as entidades do seu livro...
            </p>
          </Card>
        ) : (
          <Tabs defaultValue="characters" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="characters">
                <Users className="w-4 h-4 mr-2" />
                Personagens ({characters.length})
              </TabsTrigger>
              <TabsTrigger value="locations">
                <MapPin className="w-4 h-4 mr-2" />
                Locais ({locations.length})
              </TabsTrigger>
              <TabsTrigger value="events">
                <Calendar className="w-4 h-4 mr-2" />
                Eventos ({events.length})
              </TabsTrigger>
              <TabsTrigger value="objects">
                <Box className="w-4 h-4 mr-2" />
                Objetos ({objects.length})
              </TabsTrigger>
              <TabsTrigger value="relationships">
                <Network className="w-4 h-4 mr-2" />
                Relações ({relationships.length})
              </TabsTrigger>
              <TabsTrigger value="chat">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat
              </TabsTrigger>
            </TabsList>

            <TabsContent value="characters">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {characters.map((char) => (
                  <Card key={char.id} className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{char.name}</h3>
                    {char.role && (
                      <p className="text-sm text-primary mb-2">{char.role}</p>
                    )}
                    {char.description && (
                      <p className="text-sm text-muted-foreground">{char.description}</p>
                    )}
                  </Card>
                ))}
                {characters.length === 0 && (
                  <p className="text-muted-foreground col-span-3">Nenhum personagem encontrado</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="locations">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {locations.map((loc) => (
                  <Card key={loc.id} className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{loc.name}</h3>
                    {loc.type && (
                      <p className="text-sm text-primary mb-2">{loc.type}</p>
                    )}
                    {loc.description && (
                      <p className="text-sm text-muted-foreground">{loc.description}</p>
                    )}
                  </Card>
                ))}
                {locations.length === 0 && (
                  <p className="text-muted-foreground col-span-3">Nenhum local encontrado</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="events">
              <div className="space-y-4">
                {events.map((evt, idx) => (
                  <Card key={evt.id} className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-sm font-semibold">
                        {idx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{evt.name}</h3>
                        {evt.description && (
                          <p className="text-sm text-muted-foreground">{evt.description}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
                {events.length === 0 && (
                  <p className="text-muted-foreground">Nenhum evento encontrado</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="objects">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {objects.map((obj) => (
                  <Card key={obj.id} className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{obj.name}</h3>
                    {obj.significance && (
                      <p className="text-sm text-primary mb-2">{obj.significance}</p>
                    )}
                    {obj.description && (
                      <p className="text-sm text-muted-foreground">{obj.description}</p>
                    )}
                  </Card>
                ))}
                {objects.length === 0 && (
                  <p className="text-muted-foreground col-span-3">Nenhum objeto encontrado</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="relationships">
              <div className="space-y-4">
                {relationships.map((rel) => (
                  <Card key={rel.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{rel.source_type}</span>
                      <span className="text-lg">→</span>
                      <span className="text-sm font-medium text-primary">{rel.relationship_type}</span>
                      <span className="text-lg">→</span>
                      <span className="text-sm font-medium">{rel.target_type}</span>
                    </div>
                    {rel.description && (
                      <p className="text-sm text-muted-foreground mt-2">{rel.description}</p>
                    )}
                  </Card>
                ))}
                {relationships.length === 0 && (
                  <p className="text-muted-foreground">Nenhuma relação encontrada</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="chat">
              <ChatInterface universeId={id!} universeName={universe.title} />
            </TabsContent>
          </Tabs>
        )}
      </main>
    </div>
    <Toaster />
    </>
  );
};
