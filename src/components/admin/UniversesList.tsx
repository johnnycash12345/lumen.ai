import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Trash2, Eye } from 'lucide-react';
import { toast } from 'sonner';

interface Universe {
  id: string;
  name: string;
  description: string;
  source_type: string;
  status: string;
  created_at: string;
  _count?: {
    characters: number;
    locations: number;
    events: number;
  };
}

export function UniversesList() {
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUniverses();
  }, []);

  const loadUniverses = async () => {
    try {
      const { data, error } = await supabase
        .from('universes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUniverses(data || []);
    } catch (error: any) {
      toast.error('Erro ao carregar universos');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este universo?')) return;

    try {
      const { error } = await supabase.from('universes').delete().eq('id', id);

      if (error) throw error;

      toast.success('Universo deletado com sucesso');
      loadUniverses();
    } catch (error: any) {
      toast.error('Erro ao deletar universo');
      console.error(error);
    }
  };

  const filteredUniverses = universes.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#0B1E3D]">Carregando universos...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-['Playfair_Display'] text-[#0B1E3D]">
          Universos
        </h1>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#0B1E3D]/50" />
          <Input
            placeholder="Buscar universos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUniverses.map((universe) => (
          <Card key={universe.id} className="p-6 bg-white hover:shadow-lg transition-shadow">
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-xl font-['Playfair_Display'] text-[#0B1E3D]">
                  {universe.name}
                </h3>
                <Badge
                  className={
                    universe.status === 'ACTIVE'
                      ? 'bg-green-100 text-green-800'
                      : universe.status === 'PROCESSING'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }
                >
                  {universe.status}
                </Badge>
              </div>
              <p className="text-sm text-[#0B1E3D]/70 line-clamp-2">
                {universe.description}
              </p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#0B1E3D]/70">Tipo:</span>
                <Badge variant="outline" className="text-[#0B1E3D]">
                  {universe.source_type}
                </Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#0B1E3D]/70">Criado em:</span>
                <span className="text-[#0B1E3D]">
                  {new Date(universe.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => toast.info('Visualização em desenvolvimento')}
              >
                <Eye className="w-4 h-4 mr-2" />
                Ver Detalhes
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDelete(universe.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredUniverses.length === 0 && (
        <div className="text-center py-12">
          <p className="text-[#0B1E3D]/70">
            {searchTerm
              ? 'Nenhum universo encontrado com este termo'
              : 'Nenhum universo criado ainda. Faça upload de um PDF para começar!'}
          </p>
        </div>
      )}
    </div>
  );
}
