import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle, RefreshCw, FileEdit, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

interface QualityMetrics {
  score: number;
  totalEntities: number;
  completeness: number;
  hasDescriptions: number;
  recommendations: string[];
}

interface QualityValidationProps {
  universeId: string;
  onAccept?: () => void;
  onReview?: () => void;
  onReprocess?: () => void;
}

export function QualityValidation({ 
  universeId, 
  onAccept, 
  onReview, 
  onReprocess 
}: QualityValidationProps) {
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    analyzeQuality();
  }, [universeId]);

  const analyzeQuality = async () => {
    setIsLoading(true);
    try {
      // Buscar todas as entidades
      const [
        { data: characters, error: charError },
        { data: locations, error: locError },
        { data: events, error: eventError },
        { data: objects, error: objError },
      ] = await Promise.all([
        supabase.from('characters').select('*').eq('universe_id', universeId),
        supabase.from('locations').select('*').eq('universe_id', universeId),
        supabase.from('events').select('*').eq('universe_id', universeId),
        supabase.from('objects').select('*').eq('universe_id', universeId),
      ]);

      if (charError || locError || eventError || objError) {
        throw new Error('Erro ao buscar entidades');
      }

      const totalEntities = (characters?.length || 0) + (locations?.length || 0) + 
                           (events?.length || 0) + (objects?.length || 0);

      // Calcular completude (entidades com descrição)
      const withDescription = [
        ...(characters || []).filter(c => c.description),
        ...(locations || []).filter(l => l.description),
        ...(events || []).filter(e => e.description),
        ...(objects || []).filter(o => o.description),
      ].length;

      const completeness = totalEntities > 0 ? (withDescription / totalEntities) * 100 : 0;

      // Calcular score geral
      let score = 0;
      const recommendations: string[] = [];

      // Critério 1: Quantidade de entidades (30 pontos)
      if (totalEntities >= 20) {
        score += 30;
      } else if (totalEntities >= 10) {
        score += 20;
        recommendations.push('Extraia mais entidades para aumentar a riqueza do universo');
      } else if (totalEntities >= 5) {
        score += 10;
        recommendations.push('Poucas entidades encontradas. Verifique se o PDF está completo');
      } else {
        recommendations.push('Número muito baixo de entidades. Considere reprocessar o PDF');
      }

      // Critério 2: Completude das descrições (40 pontos)
      if (completeness >= 80) {
        score += 40;
      } else if (completeness >= 60) {
        score += 30;
        recommendations.push('Algumas entidades não possuem descrição detalhada');
      } else if (completeness >= 40) {
        score += 20;
        recommendations.push('Muitas entidades sem descrição. Revise manualmente para melhorar');
      } else {
        score += 10;
        recommendations.push('A maioria das entidades está incompleta. Reprocessamento recomendado');
      }

      // Critério 3: Diversidade de entidades (30 pontos)
      const hasCharacters = (characters?.length || 0) > 0;
      const hasLocations = (locations?.length || 0) > 0;
      const hasEvents = (events?.length || 0) > 0;
      const hasObjects = (objects?.length || 0) > 0;

      const entityTypes = [hasCharacters, hasLocations, hasEvents, hasObjects].filter(Boolean).length;

      if (entityTypes === 4) {
        score += 30;
      } else if (entityTypes === 3) {
        score += 20;
        recommendations.push('Um tipo de entidade está faltando. Verifique o conteúdo do PDF');
      } else if (entityTypes === 2) {
        score += 10;
        recommendations.push('Apenas 2 tipos de entidades encontrados. Extração pode estar incompleta');
      } else {
        recommendations.push('Extração muito limitada. Reprocessamento fortemente recomendado');
      }

      // Se não há recomendações, adicionar mensagem positiva
      if (recommendations.length === 0) {
        recommendations.push('Excelente! A extração está completa e de alta qualidade');
      }

      setMetrics({
        score,
        totalEntities,
        completeness: Math.round(completeness),
        hasDescriptions: withDescription,
        recommendations,
      });
    } catch (error: any) {
      console.error('Erro ao analisar qualidade:', error);
      toast.error('Erro ao analisar qualidade da extração');
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return 'bg-green-600';
    if (score >= 60) return 'bg-yellow-600';
    return 'bg-red-600';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-8 h-8 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
    return <XCircle className="w-8 h-8 text-red-600" />;
  };

  const handleAccept = async () => {
    setIsProcessing(true);
    try {
      // Atualizar status do universo
      const { error } = await supabase
        .from('universes')
        .update({ processing_status: 'completed' })
        .eq('id', universeId);

      if (error) throw error;

      toast.success('Extração aceita com sucesso!');
      if (onAccept) onAccept();
    } catch (error: any) {
      console.error('Erro ao aceitar extração:', error);
      toast.error('Erro ao aceitar extração');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReview = () => {
    if (onReview) onReview();
    toast.info('Modo de revisão ativado');
  };

  const handleReprocess = async () => {
    setIsProcessing(true);
    try {
      // Atualizar status para reprocessar
      const { error } = await supabase
        .from('universes')
        .update({ processing_status: 'pending' })
        .eq('id', universeId);

      if (error) throw error;

      toast.success('Reprocessamento iniciado');
      if (onReprocess) onReprocess();
    } catch (error: any) {
      console.error('Erro ao reprocessar:', error);
      toast.error('Erro ao iniciar reprocessamento');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Analisando qualidade da extração...
        </div>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card className="p-6">
        <div className="text-center text-destructive">
          Erro ao carregar análise de qualidade
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-background">
      <div className="space-y-6">
        {/* Header com Score */}
        <div className="flex items-center gap-4">
          {getScoreIcon(metrics.score)}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">
              Qualidade da Extração
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-3xl font-bold ${getScoreColor(metrics.score)}`}>
                {metrics.score}%
              </span>
              <span className="text-sm text-muted-foreground">
                ({metrics.totalEntities} entidades extraídas)
              </span>
            </div>
          </div>
        </div>

        {/* Barra de progresso do score */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Score Geral</span>
            <span className="font-medium text-foreground">{metrics.score}%</span>
          </div>
          <div className="relative">
            <Progress value={metrics.score} className="h-3" />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full transition-all ${getScoreBgColor(metrics.score)}`}
              style={{ width: `${metrics.score}%` }}
            />
          </div>
        </div>

        {/* Métricas detalhadas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Completude</div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {metrics.completeness}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {metrics.hasDescriptions} de {metrics.totalEntities} com descrição
            </div>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-2xl font-bold text-foreground mt-1">
              {metrics.totalEntities}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              entidades extraídas
            </div>
          </div>
        </div>

        {/* Recomendações */}
        <div className="space-y-2">
          <h4 className="font-semibold text-foreground">Recomendações</h4>
          <ul className="space-y-2">
            {metrics.recommendations.map((rec, index) => (
              <li key={index} className="flex gap-2 text-sm">
                <span className="text-primary mt-0.5">•</span>
                <span className="text-muted-foreground">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
          <Button
            onClick={handleAccept}
            disabled={isProcessing}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
          >
            <CheckCheck className="w-4 h-4 mr-2" />
            Aceitar
          </Button>
          <Button
            onClick={handleReview}
            disabled={isProcessing}
            variant="outline"
            className="flex-1"
          >
            <FileEdit className="w-4 h-4 mr-2" />
            Revisar
          </Button>
          <Button
            onClick={handleReprocess}
            disabled={isProcessing}
            variant="outline"
            className="flex-1"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isProcessing ? 'animate-spin' : ''}`} />
            Reprocessar
          </Button>
        </div>
      </div>
    </Card>
  );
}
