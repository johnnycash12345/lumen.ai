import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, LogOut, Book, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { UploadPDFDialog } from "@/components/UploadPDFDialog";

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
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <header className="border-b bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Lumen AI
          </h1>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">Meus Universos</h2>
            <p className="text-muted-foreground">
              Faça upload de PDFs para explorar universos fictícios
            </p>
          </div>
          <Button onClick={() => setUploadOpen(true)} size="lg">
            <Upload className="w-4 h-4 mr-2" />
            Novo Universo
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : universes.length === 0 ? (
          <Card className="p-12 text-center">
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
                className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => window.location.href = `/universe.html?id=${universe.id}`}
              >
                <h3 className="text-xl font-semibold mb-2">{universe.title}</h3>
                {universe.description && (
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                    {universe.description}
                  </p>
                )}
                <div className="flex items-center gap-2">
                  {universe.processing_status === "processing" && (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-primary" />
                      <span className="text-sm text-primary">Processando...</span>
                    </>
                  )}
                  {universe.processing_status === "completed" && (
                    <span className="text-sm text-green-600">✓ Completo</span>
                  )}
                  {universe.processing_status === "failed" && (
                    <span className="text-sm text-destructive">✗ Erro</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <UploadPDFDialog open={uploadOpen} onOpenChange={setUploadOpen} onSuccess={fetchUniverses} />
    </div>
    <Toaster />
    </>
  );
};
