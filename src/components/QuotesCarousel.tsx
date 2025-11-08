import { useState } from 'react';
import { motion, AnimatePresence } from 'motion';
import { Quote, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface QuoteData {
  text: string;
  source: string;
  context: string;
  chapter?: string;
}

interface QuotesCarouselProps {
  quotes: QuoteData[];
  characterName: string;
}

export function QuotesCarousel({ quotes, characterName }: QuotesCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedQuote, setSelectedQuote] = useState<QuoteData | null>(null);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? quotes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === quotes.length - 1 ? 0 : prev + 1));
  };

  const currentQuote = quotes[currentIndex];

  return (
    <>
      <div className="bg-gradient-to-br from-[#F8F4ED] to-white rounded-xl border border-[#FFD479]/20 p-4 sm:p-6 relative overflow-hidden">
        {/* Decorative quote marks */}
        <Quote className="absolute top-2 left-2 w-8 h-8 sm:w-12 sm:h-12 text-[#FFD479]/10" />
        <Quote className="absolute bottom-2 right-2 w-8 h-8 sm:w-12 sm:h-12 text-[#FFD479]/10 rotate-180" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Quote className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD479]" />
            <h3 className="text-sm sm:text-base text-[#0B1E3D]">Citações Mais Famosas</h3>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="min-h-[120px] sm:min-h-[140px] flex flex-col justify-between"
            >
              <blockquote className="text-sm sm:text-base text-[#0B1E3D] leading-relaxed mb-3 italic">
                "{currentQuote.text}"
              </blockquote>

              <div className="flex items-center justify-between">
                <div className="text-xs text-[#FFD479]">
                  — {currentQuote.source}
                </div>
                
                <Button
                  onClick={() => setSelectedQuote(currentQuote)}
                  variant="ghost"
                  size="sm"
                  className="text-[#0B1E3D]/60 hover:text-[#FFD479] text-xs"
                >
                  <BookOpen className="w-3 h-3 mr-1" />
                  Ver contexto
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#0B1E3D]/10">
            <Button
              onClick={handlePrevious}
              variant="ghost"
              size="sm"
              className="hover:text-[#FFD479]"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <div className="flex gap-1.5">
              {quotes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? 'bg-[#FFD479] w-6' : 'bg-[#0B1E3D]/20 w-1.5'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              variant="ghost"
              size="sm"
              className="hover:text-[#FFD479]"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Context Dialog */}
      <Dialog open={!!selectedQuote} onOpenChange={() => setSelectedQuote(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#0B1E3D]">
              <BookOpen className="w-5 h-5 text-[#FFD479]" />
              Contexto Canônico
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-[#F8F4ED] to-white p-4 rounded-lg border border-[#FFD479]/20">
              <blockquote className="text-sm sm:text-base text-[#0B1E3D] leading-relaxed italic mb-2">
                "{selectedQuote?.text}"
              </blockquote>
              <div className="text-xs text-[#FFD479]">
                — {selectedQuote?.source}
                {selectedQuote?.chapter && ` (${selectedQuote.chapter})`}
              </div>
            </div>

            <div>
              <h4 className="text-sm text-[#0B1E3D] mb-2">Circunstâncias</h4>
              <DialogDescription className="text-xs sm:text-sm text-[#0B1E3D]/70 leading-relaxed">
                {selectedQuote?.context}
              </DialogDescription>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
