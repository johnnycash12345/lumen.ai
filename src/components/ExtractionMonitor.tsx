import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

interface ExtractionMonitorProps {
  jobId: string;
  onComplete?: (universeId: string) => void;
}

interface JobStatus {
  id: string;
  status: string;
  progress: number;
  error_message: string | null;
  universe_id: string | null;
  created_at: string;
  updated_at: string;
}

export const ExtractionMonitor = ({ jobId, onComplete }: ExtractionMonitorProps) => {
  const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [entityCount, setEntityCount] = useState(0);

  useEffect(() => {
    const fetchJobStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('processing_jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (error) throw error;

        setJobStatus(data);
        setLoading(false);

        // Se completou, buscar contagem de entidades
        if (data.status === 'COMPLETED' && data.universe_id) {
          const [chars, locs, evs, objs] = await Promise.all([
            supabase.from('characters').select('id', { count: 'exact', head: true }).eq('universe_id', data.universe_id),
            supabase.from('locations').select('id', { count: 'exact', head: true }).eq('universe_id', data.universe_id),
            supabase.from('events').select('id', { count: 'exact', head: true }).eq('universe_id', data.universe_id),
            supabase.from('objects').select('id', { count: 'exact', head: true }).eq('universe_id', data.universe_id),
          ]);

          const total = (chars.count || 0) + (locs.count || 0) + (evs.count || 0) + (objs.count || 0);
          setEntityCount(total);
        }
      } catch (err) {
        console.error('Erro ao buscar status:', err);
      }
    };

    fetchJobStatus();

    // Atualizar a cada 2 segundos se não estiver completo
    const interval = setInterval(() => {
      if (jobStatus?.status !== 'COMPLETED' && jobStatus?.status !== 'FAILED') {
        fetchJobStatus();
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [jobId, jobStatus?.status]);

  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>Carregando status...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!jobStatus) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <span>Job não encontrado</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (jobStatus.status) {
      case 'COMPLETED':
        return <CheckCircle2 className="h-6 w-6 text-green-500" />;
      case 'FAILED':
        return <AlertCircle className="h-6 w-6 text-destructive" />;
      default:
        return <Loader2 className="h-6 w-6 animate-spin text-primary" />;
    }
  };

  const getStatusText = () => {
    switch (jobStatus.status) {
      case 'PENDING':
        return 'Aguardando processamento...';
      case 'PROCESSING':
        return 'Extraindo entidades do PDF...';
      case 'COMPLETED':
        return 'Extração concluída com sucesso!';
      case 'FAILED':
        return 'Erro na extração';
      default:
        return jobStatus.status;
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div className="flex-1">
            <CardTitle>{getStatusText()}</CardTitle>
            <CardDescription>
              {jobStatus.status === 'COMPLETED' && `${entityCount} entidades extraídas`}
              {jobStatus.status === 'PROCESSING' && `Progresso: ${jobStatus.progress}%`}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {jobStatus.status === 'PROCESSING' && (
          <div className="space-y-2">
            <Progress value={jobStatus.progress} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              {jobStatus.progress}% completo
            </p>
          </div>
        )}

        {jobStatus.error_message && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{jobStatus.error_message}</p>
          </div>
        )}

        {jobStatus.status === 'COMPLETED' && jobStatus.universe_id && (
          <Button
            onClick={() => onComplete?.(jobStatus.universe_id!)}
            className="w-full"
            size="lg"
          >
            Ver Universo
          </Button>
        )}

        {jobStatus.status === 'FAILED' && (
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Tentar Novamente
          </Button>
        )}
      </CardContent>
    </Card>
  );
};
