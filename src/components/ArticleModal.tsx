import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, MessageCircle, Users, Quote, ThumbsUp, ThumbsDown, Calendar } from 'lucide-react';
import { Dialog, DialogContent } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Textarea } from './ui/textarea';

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  date: string;
  excerpt: string;
  content: string;
  image?: string;
  tags: string[];
  year?: string;
  relatedCharacters?: string[];
  relatedQuotes?: Array<{
    text: string;
    character: string;
  }>;
}

interface ArticleModalProps {
  article: NewsArticle | null;
  onClose: () => void;
  onAskLumen?: (question: string) => void;
}

export function ArticleModal({ article, onClose, onAskLumen }: ArticleModalProps) {
  const [vote, setVote] = useState<'up' | 'down' | null>(null);
  const [comment, setComment] = useState('');

  if (!article) return null;

  const handleVote = (type: 'up' | 'down') => {
    setVote(vote === type ? null : type);
  };

  return (
    <Dialog open={!!article} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] p-0 overflow-hidden bg-white">
        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Main Content - Left/Top - 70% */}
          <div className="flex-1 lg:w-[70%] overflow-y-auto p-8 sm:p-12 bg-white">
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-[#F8F4ED] hover:bg-[#FFD479] border border-[#0B1E3D]/10 flex items-center justify-center transition-all duration-200"
            >
              <X className="w-4 h-4 text-[#0B1E3D]" />
            </button>

            {/* Article Header */}
            <div className="mb-10">
              <div className="flex items-center gap-2 text-xs text-[#0B1E3D]/50 mb-4">
                <span>{article.source}</span>
                <span>•</span>
                <span>{article.date}</span>
              </div>

              <h1 
                className="text-3xl sm:text-4xl lg:text-5xl text-[#0B1E3D] mb-6 leading-tight"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  lineHeight: '1.2'
                }}
              >
                {article.title}
              </h1>

              <p 
                className="text-lg text-[#0B1E3D]/70 leading-relaxed border-l-4 border-[#FFD479] pl-4"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic'
                }}
              >
                {article.excerpt}
              </p>
            </div>

            {/* Article Content */}
            <div 
              className="prose prose-lg max-w-none mb-10"
              style={{
                fontFamily: 'Inter, sans-serif',
                color: '#0B1E3D',
                lineHeight: '1.9'
              }}
            >
              {article.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="mb-6 text-base leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <Separator className="my-8 bg-[#0B1E3D]/10" />

            {/* Ask Lumen CTA - Discreto */}
            <div className="bg-[#F8F4ED] rounded-lg p-5 border border-[#0B1E3D]/10 mb-8">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-[#0B1E3D]/60 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-[#0B1E3D]/70 mb-2">
                    Quer explorar mais sobre este evento canônico?
                  </p>
                  <Button
                    onClick={() => {
                      onAskLumen?.(`Conte-me mais sobre: ${article.title}`);
                      onClose();
                    }}
                    variant="outline"
                    className="border-[#0B1E3D] text-[#0B1E3D] hover:bg-[#0B1E3D] hover:text-white text-sm"
                  >
                    Pergunte ao Lumen
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="my-8 bg-[#0B1E3D]/10" />

            {/* Voting System - Rodapé da Coluna Central */}
            <div className="pt-6 border-t border-[#0B1E3D]/10">
              <p className="text-sm text-[#0B1E3D]/60 mb-3">
                Este artigo foi útil?
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleVote('up')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                    vote === 'up'
                      ? 'bg-[#0B1E3D] text-white'
                      : 'text-[#0B1E3D]/40 hover:text-[#0B1E3D]/70'
                  }`}
                >
                  <ThumbsUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleVote('down')}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 ${
                    vote === 'down'
                      ? 'bg-[#0B1E3D] text-white'
                      : 'text-[#0B1E3D]/40 hover:text-[#0B1E3D]/70'
                  }`}
                >
                  <ThumbsDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar - Right/Bottom - 30% */}
          <div 
            className="lg:w-[30%] p-6 sm:p-8 overflow-y-auto border-l border-[#0B1E3D]/10"
            style={{
              backgroundColor: 'rgba(11, 30, 61, 0.03)'
            }}
          >
            <h2 
              className="text-[#0B1E3D] mb-6 pb-3 border-b-2 border-[#FFD479]"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1.1rem'
              }}
            >
              Análise Contextual
            </h2>

            {/* Characters Involved */}
            {article.relatedCharacters && article.relatedCharacters.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-4 h-4 text-[#0B1E3D]/70" />
                  <h3 
                    className="text-[#0B1E3D]"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '0.95rem'
                    }}
                  >
                    Personagens Envolvidos
                  </h3>
                </div>
                
                {article.year && (
                  <div className="mb-3 px-3 py-1.5 rounded-md bg-[#F8F4ED] border border-[#0B1E3D]/10 inline-block">
                    <span className="text-xs text-[#0B1E3D]/70">
                      Relações Ativas: {article.year}
                    </span>
                  </div>
                )}

                <div className="space-y-2 mt-3">
                  {article.relatedCharacters.map((character, idx) => (
                    <button
                      key={idx}
                      className="w-full text-left px-3 py-2 rounded-md bg-[#F8F4ED] hover:bg-[#FFD479]/20 transition-colors duration-200 group border border-[#0B1E3D]/10 hover:border-[#FFD479]"
                    >
                      <span className="text-sm text-[#0B1E3D]/80 group-hover:text-[#0B1E3D]">
                        {character}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Related Quotes */}
            {article.relatedQuotes && article.relatedQuotes.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Quote className="w-4 h-4 text-[#0B1E3D]/70" />
                  <h3 
                    className="text-[#0B1E3D]"
                    style={{
                      fontFamily: 'Playfair Display, serif',
                      fontSize: '0.95rem'
                    }}
                  >
                    Citações Relacionadas
                  </h3>
                </div>

                <div className="space-y-4">
                  {article.relatedQuotes.map((quote, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 rounded-md bg-white border-l-3 border-l-4 border-[#FFD479]"
                    >
                      <blockquote className="text-sm text-[#0B1E3D]/80 italic mb-2 leading-relaxed">
                        "{quote.text}"
                      </blockquote>
                      <cite className="text-xs text-[#0B1E3D]/60 not-italic">
                        — {quote.character}
                      </cite>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags moved to sidebar */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#0B1E3D]/10">
                <h3 
                  className="text-[#0B1E3D] mb-3"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '0.9rem'
                  }}
                >
                  Temas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, idx) => (
                    <Badge 
                      key={idx}
                      className="bg-[#F8F4ED] text-[#0B1E3D] hover:bg-[#FFD479] border border-[#0B1E3D]/10 cursor-pointer text-xs"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
