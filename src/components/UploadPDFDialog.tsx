import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload } from "lucide-react";

interface UploadPDFDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const UploadPDFDialog = ({ open, onOpenChange, onSuccess }: UploadPDFDialogProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file || !title) {
      toast({
        title: "Erro",
        description: "Por favor, preencha o título e selecione um arquivo PDF",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      // Create universe record first
      const { data: universe, error: universeError } = await supabase
        .from("universes")
        .insert({
          user_id: user.id,
          title,
          description,
          processing_status: "pending",
        })
        .select()
        .single();

      if (universeError) throw universeError;

      // Upload PDF to storage
      const filePath = `${user.id}/${universe.id}/${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("pdfs")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Update universe with PDF path
      await supabase
        .from("universes")
        .update({ pdf_path: filePath })
        .eq("id", universe.id);

      // Call edge function to process PDF
      const { error: processingError } = await supabase.functions.invoke("process-pdf", {
        body: { pdf_path: filePath, universe_id: universe.id },
      });

      if (processingError) {
        console.error("Processing error:", processingError);
      }

      toast({
        title: "Sucesso!",
        description: "PDF enviado. O processamento começará em breve.",
      });

      setTitle("");
      setDescription("");
      setFile(null);
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao fazer upload",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Universo</DialogTitle>
          <DialogDescription>
            Faça upload de um PDF de um livro para extrair personagens, locais, eventos e mais.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Universo *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Harry Potter e a Pedra Filosofal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Breve descrição do universo..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdf">Arquivo PDF *</Label>
            <Input
              id="pdf"
              type="file"
              accept=".pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
            Cancelar
          </Button>
          <Button onClick={handleUpload} disabled={uploading || !title || !file}>
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Enviar
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
