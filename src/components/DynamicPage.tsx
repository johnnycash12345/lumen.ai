import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';
import { UniverseDynamicPage } from './UniverseDynamicPage';
import { CharacterDynamicPage } from './CharacterDynamicPage';
import { LocationDynamicPage } from './LocationDynamicPage';
import { EventDynamicPage } from './EventDynamicPage';
import { ObjectDynamicPage } from './ObjectDynamicPage';

interface DynamicPageProps {
  slug: string;
  onBack: () => void;
}

export function DynamicPage({ slug, onBack }: DynamicPageProps) {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPageData();
  }, [slug]);

  const fetchPageData = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: functionError } = await supabase.functions.invoke(
        'get-page-data',
        {
          body: { slug },
        }
      );

      if (functionError) {
        throw functionError;
      }

      if (!data) {
        throw new Error('Página não encontrada');
      }

      setPageData(data);
    } catch (err: any) {
      console.error('Error fetching page data:', err);
      setError(err.message || 'Erro ao carregar página');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-[#0B1E3D] animate-spin mx-auto mb-4" />
          <p className="text-[#0B1E3D]">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-[#F8F4ED] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <h2 className="text-2xl font-bold text-[#0B1E3D] mb-4">
            Página não encontrada
          </h2>
          <p className="text-[#0B1E3D]/70 mb-6">
            {error || 'A página que você está procurando não existe.'}
          </p>
          <button
            onClick={onBack}
            className="px-6 py-2 bg-[#0B1E3D] text-white rounded-lg hover:bg-[#0B1E3D]/90"
          >
            Voltar
          </button>
        </div>
      </div>
    );
  }

  const { page, data } = pageData;

  // Render appropriate component based on page type
  switch (page.type) {
    case 'UNIVERSE':
      return <UniverseDynamicPage data={data} onBack={onBack} />;
    case 'CHARACTER':
      return <CharacterDynamicPage data={data} onBack={onBack} />;
    case 'LOCATION':
      return <LocationDynamicPage data={data} onBack={onBack} />;
    case 'EVENT':
      return <EventDynamicPage data={data} onBack={onBack} />;
    case 'OBJECT':
      return <ObjectDynamicPage data={data} onBack={onBack} />;
    default:
      return (
        <div className="min-h-screen bg-[#F8F4ED] flex items-center justify-center">
          <p className="text-[#0B1E3D]">Tipo de página desconhecido</p>
        </div>
      );
  }
}