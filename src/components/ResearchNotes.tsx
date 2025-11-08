import { useState } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { FileText, Plus, X, Edit2, Download, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
}

interface ResearchNotesProps {
  notes: Note[];
  onSaveNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  onDeleteNote: (noteId: string) => void;
  onExportNotes: () => void;
}

export function ResearchNotes({ notes, onSaveNote, onDeleteNote, onExportNotes }: ResearchNotesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    
    onSaveNote({ title, content, tags });
    handleClose();
  };

  const handleClose = () => {
    setIsDialogOpen(false);
    setSelectedNote(null);
    setTitle('');
    setContent('');
    setTags([]);
    setTagInput('');
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-[#0B1E3D]/10 p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD479]" />
            <h3 className="text-sm sm:text-base text-[#0B1E3D]">Minhas Notas de Pesquisa</h3>
          </div>
          
          <div className="flex items-center gap-2">
            {notes.length > 0 && (
              <Button
                onClick={onExportNotes}
                variant="ghost"
                size="sm"
                className="text-[#0B1E3D]/60 hover:text-[#FFD479]"
              >
                <Download className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={() => setIsDialogOpen(true)}
              size="sm"
              className="bg-[#FFD479] hover:bg-[#0B1E3D] text-[#0B1E3D] hover:text-white transition-all duration-300"
            >
              <Plus className="w-4 h-4 mr-1" />
              Nova Nota
            </Button>
          </div>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-[#0B1E3D]/20 mx-auto mb-3" />
            <p className="text-sm text-[#0B1E3D]/60 mb-4">
              Nenhuma nota salva ainda. Comece a documentar suas descobertas!
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notes.map((note, idx) => (
              <motion.div
                key={note.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-gradient-to-br from-[#F8F4ED] to-white p-3 sm:p-4 rounded-lg border border-[#0B1E3D]/10 hover:border-[#FFD479]/30 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm text-[#0B1E3D] flex-1">{note.title}</h4>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      onClick={() => {
                        setSelectedNote(note);
                        setTitle(note.title);
                        setContent(note.content);
                        setTags(note.tags);
                        setIsDialogOpen(true);
                      }}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      onClick={() => onDeleteNote(note.id)}
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 hover:text-red-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-[#0B1E3D]/60 line-clamp-2 mb-2">
                  {note.content}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="secondary"
                        className="text-[10px] bg-[#FFD479]/10 text-[#0B1E3D] hover:bg-[#FFD479]/20"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-[10px] text-[#0B1E3D]/40">
                    {new Date(note.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Note Editor Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[#0B1E3D]">
              {selectedNote ? 'Editar Nota' : 'Nova Nota de Pesquisa'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#0B1E3D]/70 mb-1 block">Título</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Análise do caso Carbúnculo Azul"
                className="border-[#0B1E3D]/20 focus:border-[#FFD479]"
              />
            </div>

            <div>
              <label className="text-xs text-[#0B1E3D]/70 mb-1 block">Conteúdo</label>
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Suas anotações e descobertas..."
                rows={8}
                className="border-[#0B1E3D]/20 focus:border-[#FFD479] resize-none"
              />
            </div>

            <div>
              <label className="text-xs text-[#0B1E3D]/70 mb-1 block">Tags</label>
              <div className="flex gap-2 mb-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Adicionar tag..."
                  className="border-[#0B1E3D]/20 focus:border-[#FFD479]"
                />
                <Button
                  onClick={handleAddTag}
                  variant="outline"
                  className="border-[#FFD479] text-[#0B1E3D] hover:bg-[#FFD479]/10"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Badge 
                    key={tag}
                    className="bg-[#FFD479]/20 text-[#0B1E3D] hover:bg-[#FFD479]/30"
                  >
                    #{tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                onClick={handleClose}
                variant="outline"
                className="flex-1 border-[#0B1E3D]/20"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                disabled={!title.trim() || !content.trim()}
                className="flex-1 bg-[#FFD479] hover:bg-[#0B1E3D] text-[#0B1E3D] hover:text-white transition-all duration-300"
              >
                Salvar Nota
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
