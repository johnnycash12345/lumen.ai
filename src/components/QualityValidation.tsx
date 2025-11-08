import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw, FileCheck, Eye } from 'lucide-react';

interface QualityMetrics {
  totalEntities: number;
  charactersCount: number;
  locationsCount: number;
  eventsCount: number;
  objectsCount: number;
  entitiesWithDescription: number;
  entitiesWithoutDescription: number;
  averageDescriptionLength: number;
  score: number;
}

interface Recommendation {
  type: 'warning' | 'info' | 'success';
  message: string;
}

interface QualityValidationProps {
  universeId: string;
  onAccept?: () => void;
  onReview?: () => void;
  onReprocess?: () => void;
}

export const QualityValidation = ({ 
  universeId, 
  onAccept, 
  onReview, 
  onReprocess 
}: QualityValidationProps) => {
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    analyzeQuality();
  }, [universeId]);

  const analyzeQuality = async () => {
    try {
      setLoading(true);

      // Buscar todas as entidades
      const [charsRes, locsRes, eventsRes, objsRes] = await Promise.all([
        supabase.from('characters').select('description').eq('universe_id', universeId),
        supabase.from('locations').select('description').eq('universe_id', universeId),
        supabase.from('events').select('description').eq('universe_id', universeId),
        supabase.from('objects').select('description').eq('universe_id', universeId),
      ]);

      const chars = charsRes.data || [];
      const locs = locsRes.data || [];
      const events = eventsRes.data || [];
      const objs = objsRes.data || [];

      const allEntities = [...chars, ...locs, ...events, ...objs];
      const totalEntities = allEntities.length;

      // Calcular métricas
      const entitiesWithDesc = allEntities.filter(e => e.description && e.description.length > 20).length;
      const entitiesWithoutDesc = totalEntities - entitiesWithDesc;

      const descriptions = allEntities
        .filter(e => e.description)
        .map(e => e.description!.length);
      const avgDescLength = descriptions.length > 0 
        ? descriptions.reduce((a, b) => a + b, 0) / descriptions.length 
        : 0;

      // Calcular score (0-100)
      let score = 0;
      
      // Base score por número de entidades (0-40 pontos)
      if (totalEntities >= 20) score += 40;
      else if (totalEntities >= 10) score += 30;
      else if (totalEntities >= 5) score += 20;
      else score += 10;

      // Score por diversidade (0-30 pontos)
      const diversityScore = 
        (chars.length > 0 ? 10 : 0) +
        (locs.length > 0 ? 10 : 0) +
        (events.length > 0 ? 5 : 0) +
        (objs.length > 0 ? 5 : 0);
      score += diversityScore;

      // Score por qualidade das descrições (0-30 pontos)
      const descQuality = (entitiesWithDesc / totalEntities) * 30;
      score += descQuality;

      score = Math.round(Math.min(score, 100));

      const metrics: QualityMetrics = {
        totalEntities,
        charactersCount: chars.length,
        locationsCount: locs.length,
        eventsCount: events.length,
        objectsCount: objs.length,
        entitiesWithDescription: entitiesWithDesc,
        entitiesWithoutDescription: entitiesWithoutDesc,
        averageDescriptionLength: Math.round(avgDescLength),
        score,
      };

      setMetrics(metrics);
      generateRecommendations(metrics);
    } catch (error) {
      console.error('Erro ao analisar qualidade:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateRecommendations = (metrics: QualityMetrics) => {
    const recs: Recommendation[] = [];

    if (metrics.score >= 80) {
      recs.push({
        type: 'success',
        message: 'Excelente qualidade de extração! Todas as entidades possuem informações completas.',
      });
    }

    if (metrics.totalEntities < 10) {
      recs.push({
        type: 'warning',
        message: 'Poucas entidades extraídas. Considere reprocessar com um PDF mais completo.',
      });
    }

    if (metrics.charactersCount === 0) {
      recs.push({
        type: 'warning',
        message: 'Nenhum personagem foi extraído. Verifique se o PDF contém informações sobre personagens.',
      });
    }

    if (metrics.entitiesWithoutDescription > metrics.totalEntities * 0.3) {
      recs.push({
        type: 'warning',
        message: `${metrics.entitiesWithoutDescription} entidades sem descrição detalhada. A revisão manual pode melhorar a qualidade.`,
      });
    }

    if (metrics.averageDescriptionLength < 50) {
      recs.push({
        type: 'info',
        message: 'Descrições curtas detectadas. Adicione mais detalhes manualmente para enriquecer o universo.',
      });
    }

    if (metrics.locationsCount === 0) {
      recs.push({
        type: 'info',
        message: 'Nenhum local foi extraído. Adicione locais manualmente se necessário.',
      });
    }

    if (recs.length === 0) {
      recs.push({
        type: 'success',
        message: 'Nenhum problema detectado. A extração está completa e detalhada.',
      });
    }

    setRecommendations(recs);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 border-green-300';
    if (score >= 60) return 'bg-yellow-100 border-yellow-300';
    return 'bg-red-100 border-red-300';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle2 className="h-8 w-8 text-green-600" />;
    if (score >= 60) return <AlertTriangle className="h-8 w-8 text-yellow-600" />;
    return <XCircle className="h-8 w-8 text-red-600" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excelente';
    if (score >= 60) return 'Boa';
    return 'Precisa Melhorias';
  };

  if (loading || !metrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <RefreshCw className="h-6 w-6 animate-spin text-primary" />
            <span className="ml-2">Analisando qualidade...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5" />
          Validação de Qualidade
        </CardTitle>
        <CardDescription>
          Análise automática da qualidade da extração de entidades
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Principal */}
        <div className={`p-6 rounded-lg border-2 ${getScoreBgColor(metrics.score)}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getScoreIcon(metrics.score)}
              <div>
                <div className={`text-4xl font-bold ${getScoreColor(metrics.score)}`}>
                  {metrics.score}%
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {getScoreLabel(metrics.score)}
                </div>
              </div>
            </div>
          </div>
          <Progress value={metrics.score} className="h-3" />
        </div>

        {/* Métricas Detalhadas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{metrics.totalEntities}</div>
            <div className="text-xs text-muted-foreground">Total de Entidades</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{metrics.charactersCount}</div>
            <div className="text-xs text-muted-foreground">Personagens</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{metrics.locationsCount}</div>
            <div className="text-xs text-muted-foreground">Locais</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-primary">{metrics.eventsCount + metrics.objectsCount}</div>
            <div className="text-xs text-muted-foreground">Eventos + Objetos</div>
          </div>
        </div>

        {/* Recomendações */}
        <div className="space-y-3">
          <h4 className="font-semibold text-sm">Recomendações</h4>
          {recommendations.map((rec, idx) => (
            <Alert key={idx} variant={rec.type === 'warning' ? 'destructive' : 'default'}>
              {rec.type === 'success' && <CheckCircle2 className="h-4 w-4" />}
              {rec.type === 'warning' && <AlertTriangle className="h-4 w-4" />}
              {rec.type === 'info' && <Eye className="h-4 w-4" />}
              <AlertDescription>{rec.message}</AlertDescription>
            </Alert>
          ))}
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <Button
            onClick={onAccept}
            className="flex-1"
            variant={metrics.score >= 60 ? 'default' : 'outline'}
          >
            <CheckCircle2 className="h-4 w-4 mr-2" />
            Aceitar Extração
          </Button>
          
          <Button
            onClick={onReview}
            variant="outline"
            className="flex-1"
          >
            <Eye className="h-4 w-4 mr-2" />
            Revisar Manualmente
          </Button>

          {metrics.score < 80 && (
            <Button
              onClick={onReprocess}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reprocessar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
