import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ExtractionMonitor } from './ExtractionMonitor';
import { ExtractedEntitiesView } from './ExtractedEntitiesView';
import { QualityValidation } from './QualityValidation';
import { Upload, FileText, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

type UploadStage = 'upload' | 'monitoring' | 'validation' | 'completed';

interface UploadPDFProps {
  onPublish?: (universeId: string) => void;
}

export const UploadPDF = ({ onPublish }: UploadPDFProps) => {
  const [stage, setStage] = useState<UploadStage>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [jobId, setJobId] = useState<string | null>(null);
  const [universeId, setUniverseId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('monitoring');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Por favor, selecione um arquivo PDF');
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) {
        toast.error('Arquivo muito grande. Máximo 50MB');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file || !title.trim()) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      setUploading(true);
      const user = await supabase.auth.getUser();
      if (!user.data.user) {
        toast.error('Você precisa estar autenticado');
        return;
      }

      // Criar universo
      const { data: universe, error: universeError } = await supabase
        .from('universes')
        .insert({
          title,
          description: description || null,
          user_id: user.data.user.id,
          processing_status: 'pending',
        })
        .select()
        .single();

      if (universeError) throw universeError;

      // Upload do PDF
      const filePath = `${user.data.user.id}/${universe.id}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Atualizar universo com o caminho do PDF
      const { error: updateError } = await supabase
        .from('universes')
        .update({ pdf_path: filePath })
        .eq('id', universe.id);

      if (updateError) throw updateError;

      // Criar job de processamento
      const { data: job, error: jobError } = await supabase
        .from('processing_jobs')
        .insert({
          universe_id: universe.id,
          status: 'PENDING',
          progress: 0,
        })
        .select()
        .single();

      if (jobError) throw jobError;

      setJobId(job.id);
      setUniverseId(universe.id);
      setStage('monitoring');
      toast.success('Upload iniciado! Processando PDF...');

      // Chamar edge function para processar o PDF
      supabase.functions.invoke('process-pdf', {
        body: { jobId: job.id, universeId: universe.id, filePath }
      }).then(({ data, error }) => {
        if (error) {
          console.error('Erro ao iniciar processamento:', error);
        } else {
          console.log('Processamento iniciado:', data);
        }
      });

    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error(error.message || 'Erro ao fazer upload do PDF');
    } finally {
      setUploading(false);
    }
  };

  const handleExtractionComplete = (completedUniverseId: string) => {
    setUniverseId(completedUniverseId);
    setStage('validation');
    setActiveTab('entities');
    toast.success('Extração concluída!');
  };

  const handleAccept = () => {
    setStage('completed');
    toast.success('Universo validado com sucesso!');
  };

  const handlePublish = () => {
    if (universeId) {
      onPublish?.(universeId);
      toast.success('Universo publicado!');
    }
  };

  const handleReprocess = async () => {
    if (!universeId) return;
    
    try {
      // Criar novo job de processamento
      const { data: job, error } = await supabase
        .from('processing_jobs')
        .insert({
          universe_id: universeId,
          status: 'PENDING',
          progress: 0,
        })
        .select()
        .single();

      if (error) throw error;

      setJobId(job.id);
      setStage('monitoring');
      setActiveTab('monitoring');
      toast.info('Reprocessando PDF...');
    } catch (error) {
      console.error('Erro ao reprocessar:', error);
      toast.error('Erro ao reprocessar PDF');
    }
  };

  const handleEdit = () => {
    if (universeId) {
      setActiveTab('entities');
      toast.info('Modo de edição ativado');
    }
  };

  if (stage === 'upload') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de PDF
          </CardTitle>
          <CardDescription>
            Faça upload de um PDF para extrair entidades e criar um universo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Universo *</Label>
            <Input
              id="title"
              placeholder="Ex: Harry Potter e a Pedra Filosofal"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              placeholder="Breve descrição sobre este universo..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Arquivo PDF *</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {file && <FileText className="h-5 w-5 text-primary" />}
            </div>
            {file && (
              <p className="text-sm text-muted-foreground">
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
              </p>
            )}
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || !title.trim() || uploading}
            className="w-full"
            size="lg"
          >
            {uploading ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Fazendo Upload...
              </>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Iniciar Extração
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (stage === 'monitoring' && jobId) {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-6">
        <ExtractionMonitor
          jobId={jobId}
          onComplete={handleExtractionComplete}
        />
      </div>
    );
  }

  if ((stage === 'validation' || stage === 'completed') && universeId) {
    return (
      <div className="w-full max-w-6xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {stage === 'completed' ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  Universo Pronto para Publicação
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5" />
                  Revisão da Extração
                </>
              )}
            </CardTitle>
            <CardDescription>
              {title}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="monitoring">Monitoramento</TabsTrigger>
                <TabsTrigger value="entities">Entidades</TabsTrigger>
                <TabsTrigger value="quality">Qualidade</TabsTrigger>
              </TabsList>

              <TabsContent value="monitoring" className="mt-6">
                {jobId && (
                  <ExtractionMonitor
                    jobId={jobId}
                    onComplete={handleExtractionComplete}
                  />
                )}
              </TabsContent>

              <TabsContent value="entities" className="mt-6">
                <ExtractedEntitiesView
                  universeId={universeId}
                  onEdit={(type, id) => {
                    console.log('Editar:', type, id);
                    toast.info(`Editando ${type}: ${id}`);
                  }}
                />
              </TabsContent>

              <TabsContent value="quality" className="mt-6">
                <QualityValidation
                  universeId={universeId}
                  onAccept={handleAccept}
                  onReview={() => setActiveTab('entities')}
                  onReprocess={handleReprocess}
                />
              </TabsContent>
            </Tabs>

            {stage === 'completed' && (
              <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t">
                <Button
                  onClick={handlePublish}
                  size="lg"
                  className="flex-1"
                >
                  <CheckCircle2 className="h-5 w-5 mr-2" />
                  Publicar Universo
                </Button>
                
                <Button
                  onClick={handleEdit}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Editar Entidades
                </Button>

                <Button
                  onClick={handleReprocess}
                  variant="outline"
                  size="lg"
                  className="flex-1"
                >
                  <Upload className="h-5 w-5 mr-2" />
                  Reprocessar PDF
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};
