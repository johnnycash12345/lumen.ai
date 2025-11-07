import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, X, Check } from 'lucide-react';
import { toast } from 'sonner';

export function UploadPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    source_type: 'BOOK',
    author: '',
    publication_year: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [processingSteps, setProcessingSteps] = useState<string[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      toast.error('Apenas arquivos PDF são permitidos');
      return;
    }

    if (selectedFile.size > 50 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 50MB');
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast.error('Selecione um arquivo PDF');
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    setProcessingSteps([]);

    try {
      // Step 1: Upload file to storage
      updateProgress(10, '✓ Arquivo validado');
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}.${fileExt}`;

      updateProgress(20, '⏳ Fazendo upload do arquivo...');

      const { error: uploadError } = await supabase.storage
        .from('pdfs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      updateProgress(40, '✓ Arquivo enviado');

      // Step 2: Create universe record
      updateProgress(50, '⏳ Criando registro do universo...');

      const { data: universe, error: universeError } = await supabase
        .from('universes')
        .insert({
          name: formData.name,
          description: formData.description,
          source_type: formData.source_type,
          author: formData.author || null,
          publication_year: formData.publication_year
            ? parseInt(formData.publication_year)
            : null,
          status: 'PROCESSING',
          pdf_url: filePath,
          created_by: user.id,
        })
        .select()
        .single();

      if (universeError) throw universeError;

      updateProgress(70, '✓ Universo criado');

      // Step 3: Create processing job
      updateProgress(80, '⏳ Iniciando processamento com IA...');

      const { error: jobError } = await supabase
        .from('processing_jobs')
        .insert({
          universe_id: universe.id,
          status: 'PROCESSING',
          progress: 0,
          created_by: user.id,
        });

      if (jobError) throw jobError;

      updateProgress(100, '✓ Processamento iniciado!');

      toast.success(
        'PDF enviado com sucesso! O processamento pode levar alguns minutos.'
      );

      // Reset form
      setFile(null);
      setFormData({
        name: '',
        description: '',
        source_type: 'BOOK',
        author: '',
        publication_year: '',
      });
      setIsProcessing(false);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Erro ao processar PDF');
      setIsProcessing(false);
    }
  };

  const updateProgress = (value: number, step: string) => {
    setProgress(value);
    setProcessingSteps((prev) => [...prev, step]);
  };

  return (
    <div>
      <h1 className="text-3xl font-['Playfair_Display'] text-[#0B1E3D] mb-8">
        Upload de PDF
      </h1>

      <Card className="max-w-2xl mx-auto p-8 bg-white">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div>
            <Label className="text-[#0B1E3D]">Arquivo PDF</Label>
            <div
              className="mt-2 border-2 border-dashed border-[#0B1E3D]/20 rounded-lg p-8 text-center hover:border-[#FFD479] transition-colors cursor-pointer"
              onClick={() => document.getElementById('file-input')?.click()}
            >
              {file ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-8 h-8 text-[#FFD479]" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#0B1E3D]">{file.name}</p>
                    <p className="text-xs text-[#0B1E3D]/70">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-[#0B1E3D]/50 hover:text-[#0B1E3D]"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div>
                  <Upload className="w-12 h-12 text-[#0B1E3D]/50 mx-auto mb-3" />
                  <p className="text-sm text-[#0B1E3D]">
                    Arraste um PDF aqui ou clique para selecionar
                  </p>
                  <p className="text-xs text-[#0B1E3D]/70 mt-1">
                    Máximo 50MB
                  </p>
                </div>
              )}
            </div>
            <input
              id="file-input"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Form Fields */}
          <div>
            <Label htmlFor="name" className="text-[#0B1E3D]">
              Nome do Universo *
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="ex: Harry Potter e a Pedra Filosofal"
              required
              maxLength={100}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-[#0B1E3D]">
              Descrição *
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="ex: O primeiro livro da série Harry Potter"
              required
              maxLength={500}
              className="mt-1"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="source_type" className="text-[#0B1E3D]">
              Tipo de Fonte *
            </Label>
            <Select
              value={formData.source_type}
              onValueChange={(value) =>
                setFormData({ ...formData, source_type: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BOOK">Livro</SelectItem>
                <SelectItem value="MOVIE">Filme</SelectItem>
                <SelectItem value="SERIES">Série</SelectItem>
                <SelectItem value="GAME">Jogo</SelectItem>
                <SelectItem value="OTHER">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author" className="text-[#0B1E3D]">
                Autor/Criador
              </Label>
              <Input
                id="author"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="ex: J.K. Rowling"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="year" className="text-[#0B1E3D]">
                Ano de Publicação
              </Label>
              <Input
                id="year"
                type="number"
                value={formData.publication_year}
                onChange={(e) =>
                  setFormData({ ...formData, publication_year: e.target.value })
                }
                placeholder="ex: 1997"
                className="mt-1"
                min="1000"
                max="2100"
              />
            </div>
          </div>

          {/* Processing Progress */}
          {isProcessing && (
            <div className="space-y-4 p-4 bg-[#F8F4ED] rounded-lg">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#0B1E3D]">
                    Processando...
                  </span>
                  <span className="text-sm font-medium text-[#0B1E3D]">
                    {progress}%
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>

              <div className="space-y-1">
                {processingSteps.map((step, index) => (
                  <p
                    key={index}
                    className="text-sm text-[#0B1E3D]/70 flex items-center gap-2"
                  >
                    {step.startsWith('✓') && (
                      <Check className="w-4 h-4 text-green-600" />
                    )}
                    {step}
                  </p>
                ))}
              </div>

              <p className="text-xs text-[#0B1E3D]/70">
                Tempo estimado: 2-5 minutos
              </p>
            </div>
          )}

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={!file || !formData.name || !formData.description || isProcessing}
              className="flex-1 bg-[#0B1E3D] hover:bg-[#0B1E3D]/90 text-white"
            >
              {isProcessing ? 'Processando...' : 'Processar PDF'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setFile(null);
                setFormData({
                  name: '',
                  description: '',
                  source_type: 'BOOK',
                  author: '',
                  publication_year: '',
                });
              }}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
