import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import {
  BookOpen,
  Users,
  MapPin,
  Calendar,
  FileText,
  TrendingUp,
} from 'lucide-react';

interface Stats {
  totalUniverses: number;
  totalCharacters: number;
  totalLocations: number;
  totalEvents: number;
  processingJobs: number;
  successRate: number;
}

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    totalUniverses: 0,
    totalCharacters: 0,
    totalLocations: 0,
    totalEvents: 0,
    processingJobs: 0,
    successRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [
        { count: universesCount },
        { count: charactersCount },
        { count: locationsCount },
        { count: eventsCount },
        { data: jobs },
      ] = await Promise.all([
        supabase.from('universes').select('*', { count: 'exact', head: true }),
        supabase.from('characters').select('*', { count: 'exact', head: true }),
        supabase.from('locations').select('*', { count: 'exact', head: true }),
        supabase.from('events').select('*', { count: 'exact', head: true }),
        supabase.from('processing_jobs').select('status'),
      ]);

      const processingCount = jobs?.filter((j) => j.status === 'PROCESSING').length || 0;
      const completedCount = jobs?.filter((j) => j.status === 'COMPLETED').length || 0;
      const totalJobs = jobs?.length || 0;
      const successRate = totalJobs > 0 ? (completedCount / totalJobs) * 100 : 0;

      setStats({
        totalUniverses: universesCount || 0,
        totalCharacters: charactersCount || 0,
        totalLocations: locationsCount || 0,
        totalEvents: eventsCount || 0,
        processingJobs: processingCount,
        successRate: Math.round(successRate),
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Universos',
      value: stats.totalUniverses,
      icon: BookOpen,
      color: '#FFD479',
    },
    {
      title: 'Total de Personagens',
      value: stats.totalCharacters,
      icon: Users,
      color: '#0B1E3D',
    },
    {
      title: 'Total de Locais',
      value: stats.totalLocations,
      icon: MapPin,
      color: '#FFD479',
    },
    {
      title: 'Total de Eventos',
      value: stats.totalEvents,
      icon: Calendar,
      color: '#0B1E3D',
    },
    {
      title: 'PDFs em Processamento',
      value: stats.processingJobs,
      icon: FileText,
      color: '#FFD479',
    },
    {
      title: 'Taxa de Sucesso',
      value: `${stats.successRate}%`,
      icon: TrendingUp,
      color: stats.successRate > 90 ? '#10B981' : stats.successRate > 70 ? '#FFD479' : '#EF4444',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-[#0B1E3D]">Carregando estatísticas...</div>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#0B1E3D] mb-8">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card) => (
          <Card
            key={card.title}
            className="p-6 bg-white hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-[#0B1E3D]/70 mb-2">{card.title}</p>
                <p className="text-3xl font-bold text-[#0B1E3D]">{card.value}</p>
              </div>
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${card.color}20` }}
              >
                <card.icon className="w-6 h-6" style={{ color: card.color }} />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
