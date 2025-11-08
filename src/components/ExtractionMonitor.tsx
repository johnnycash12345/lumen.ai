import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ExtractionMonitorProps {
  jobId: string;
  universeId: string;
  onComplete?: () => void;
}

interface JobData {
  status: string;
  progress: number;
  error_message?: string;
}

export function ExtractionMonitor({ jobId, universeId, onComplete }: ExtractionMonitorProps) {
  const [jobData, setJobData] = useState<JobData>({
    status: 'PROCESSING',
    progress: 0,
  });
  const [entityCount, setEntityCount] = useState({
    characters: 0,
    locations: 0,
    events: 0,
    objects: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const fetchJobStatus = async () => {
      try {
        // Buscar dados do job
        const { data: job, error: jobError } = await supabase
          .from('processing_jobs')
          .select('status, progress, error_message')
          .eq('universe_id', universeId)
          .single();

        if (jobError) throw jobError;

        if (job) {
          setJobData({
            status: job.status,
            progress: job.progress || 0,
            error_message: job.error_message || undefined,
          });

          // Se completado, buscar contagem de entidades
          if (job.status === 'COMPLETED') {
            const [characters, locations, events, objects] = await Promise.all([
              supabase.from('characters').select('id', { count: 'exact', head: true }).eq('universe_id', universeId),
              supabase.from('locations').select('id', { count: 'exact', head: true }).eq('universe_id', universeId),
              supabase.from('events').select('id', { count: 'exact', head: true }).eq('universe_id', universeId),
              supabase.from('objects').select('id', { count: 'exact', head: true }).eq('universe_id', universeId),
            ]);

            setEntityCount({
              characters: characters.count || 0,
              locations: locations.count || 0,
              events: events.count || 0,
              objects: objects.count || 0,
            });

            if (onComplete) onComplete();
            clearInterval(intervalId);
          }

          // Se falhou, parar polling
          if (job.status === 'FAILED') {
            clearInterval(intervalId);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar status do job:', error);
      }
    };

    // Buscar imediatamente
    fetchJobStatus();

    // Configurar polling a cada 2 segundos
    intervalId = setInterval(fetchJobStatus, 2000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [jobId, universeId, onComplete]);

  const getStatusIcon = () => {
    switch (jobData.status) {
      case 'COMPLETED':
        return <CheckCircle className="w-6 h-6 text-green-600" />;
      case 'FAILED':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Loader2 className="w-6 h-6 text-primary animate-spin" />;
    }
  };

  const getStatusText = () => {
    switch (jobData.status) {
      case 'COMPLETED':
        return 'Extração concluída com sucesso!';
      case 'FAILED':
        return 'Falha na extração';
      case 'PROCESSING':
        return 'Processando PDF...';
      default:
        return 'Aguardando...';
    }
  };

  return (
    <Card className="p-6 bg-background border-border">
      <div className="space-y-6">
        {/* Header com status */}
        <div className="flex items-center gap-3">
          {getStatusIcon()}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">{getStatusText()}</h3>
            {jobData.status === 'PROCESSING' && (
              <p className="text-sm text-muted-foreground">
                Isso pode levar alguns minutos...
              </p>
            )}
          </div>
        </div>

        {/* Barra de progresso */}
        {jobData.status === 'PROCESSING' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium text-foreground">{jobData.progress}%</span>
            </div>
            <Progress value={jobData.progress} className="h-2" />
          </div>
        )}

        {/* Mensagem de erro */}
        {jobData.status === 'FAILED' && jobData.error_message && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive">{jobData.error_message}</p>
          </div>
        )}

        {/* Contagem de entidades quando completado */}
        {jobData.status === 'COMPLETED' && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{entityCount.characters}</div>
              <div className="text-xs text-muted-foreground mt-1">Personagens</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{entityCount.locations}</div>
              <div className="text-xs text-muted-foreground mt-1">Locais</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{entityCount.events}</div>
              <div className="text-xs text-muted-foreground mt-1">Eventos</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-foreground">{entityCount.objects}</div>
              <div className="text-xs text-muted-foreground mt-1">Objetos</div>
            </div>
          </div>
        )}

        {/* Botão Ver Universo */}
        {jobData.status === 'COMPLETED' && (
          <Button
            onClick={() => navigate(`/universe/${universeId}`)}
            className="w-full"
            size="lg"
          >
            Ver Universo
          </Button>
        )}
      </div>
    </Card>
  );
}
