import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, LogOut, Book, Loader2, Users, MapPin, Calendar, FileText, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { UploadPDFDialog } from "@/components/UploadPDFDialog";
import { StatsCard } from "@/components/admin/StatsCard";

interface Universe {
  id: string;
  title: string;
  description: string | null;
  processing_status: string;
  created_at: string;
}

export const Dashboard = () => {
  const { toast } = useToast();
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [stats, setStats] = useState({
    totalUniverses: 0,
    totalCharacters: 0,
    totalLocations: 0,
    totalEvents: 0,
    totalObjects: 0,
    processingCount: 0,
  });

  useEffect(() => {
    checkAuth();
    fetchUniverses();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      window.location.href = '/auth.html';
    }
  };

  const fetchUniverses = async () => {
    try {
      const { data, error } = await supabase
        .from("universes")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUniverses(data || []);
      
      // Fetch stats
      const [charactersRes, locationsRes, eventsRes, objectsRes] = await Promise.all([
        supabase.from("characters").select("id", { count: "exact", head: true }),
        supabase.from("locations").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("objects").select("id", { count: "exact", head: true }),
      ]);
      
      const processingCount = data?.filter(u => u.processing_status === "processing").length || 0;
      
      setStats({
        totalUniverses: data?.length || 0,
        totalCharacters: charactersRes.count || 0,
        totalLocations: locationsRes.count || 0,
        totalEvents: eventsRes.count || 0,
        totalObjects: objectsRes.count || 0,
        processingCount,
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus universos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Lumen Admin
            </h1>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
              <p className="text-muted-foreground">
                Gerencie seus universos e visualize estatísticas
              </p>
            </div>
            <Button onClick={() => setUploadOpen(true)} size="lg" className="bg-primary hover:bg-primary/90">
              <Upload className="w-4 h-4 mr-2" />
              Novo Universo
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatsCard
                  title="Total de Universos"
                  value={stats.totalUniverses}
                  icon={Book}
                  trend={stats.processingCount > 0 ? `${stats.processingCount} em processamento` : undefined}
                />
                <StatsCard
                  title="Total de Personagens"
                  value={stats.totalCharacters}
                  icon={Users}
                />
                <StatsCard
                  title="Total de Locais"
                  value={stats.totalLocations}
                  icon={MapPin}
                />
                <StatsCard
                  title="Total de Eventos"
                  value={stats.totalEvents}
                  icon={Calendar}
                />
                <StatsCard
                  title="Total de Objetos"
                  value={stats.totalObjects}
                  icon={FileText}
                />
                <StatsCard
                  title="Taxa de Sucesso"
                  value={`${stats.totalUniverses > 0 ? Math.round(((stats.totalUniverses - stats.processingCount) / stats.totalUniverses) * 100) : 0}%`}
                  icon={CheckCircle}
                />
              </div>

              {/* Universes Section */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-4">Meus Universos</h3>
              </div>

              {universes.length === 0 ? (
                <Card className="p-12 text-center border-dashed">
                  <Book className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum universo ainda</h3>
                  <p className="text-muted-foreground mb-4">
                    Comece fazendo upload de um PDF de um livro
                  </p>
                  <Button onClick={() => setUploadOpen(true)}>
                    <Upload className="w-4 h-4 mr-2" />
                    Fazer Upload
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {universes.map((universe) => (
                    <Card
                      key={universe.id}
                      className="p-6 cursor-pointer hover:shadow-lg hover:shadow-primary/20 transition-all hover:scale-105 duration-200 border-border"
                      onClick={() => (window.location.href = `/universe.html?id=${universe.id}`)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <Book className="w-8 h-8 text-primary" />
                        <div className="flex items-center gap-2">
                          {universe.processing_status === "processing" && (
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          )}
                          {universe.processing_status === "completed" && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                          {universe.processing_status === "failed" && (
                            <span className="text-destructive text-sm">✗</span>
                          )}
                        </div>
                      </div>
                      <h3 className="text-xl font-semibold mb-2 line-clamp-1">{universe.title}</h3>
                      {universe.description && (
                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                          {universe.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {universe.processing_status === "processing" && (
                          <span className="text-primary font-medium">Processando...</span>
                        )}
                        {universe.processing_status === "completed" && (
                          <span className="text-green-500 font-medium">Completo</span>
                        )}
                        {universe.processing_status === "failed" && (
                          <span className="text-destructive font-medium">Erro no processamento</span>
                        )}
                        <span className="ml-auto">
                          {new Date(universe.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </main>

        <UploadPDFDialog open={uploadOpen} onOpenChange={setUploadOpen} onSuccess={fetchUniverses} />
      </div>
      <Toaster />
    </>
  );
};
