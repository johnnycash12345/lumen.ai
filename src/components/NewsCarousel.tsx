import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { ArticleModal } from './ArticleModal';

interface NewsArticle {
  id: string;
  title: string;
  source: string;
  date: string;
  excerpt: string;
  content: string;
  image?: string;
  tags: string[];
}

interface NewsCarouselProps {
  articles: NewsArticle[];
  universe: string;
  onAskLumen?: (article: NewsArticle) => void;
}

export function NewsCarousel({ articles, universe, onAskLumen }: NewsCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null);

  const handlePrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? articles.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev === articles.length - 1 ? 0 : prev + 1));
  };

  const currentArticle = articles[currentIndex];

  return (
    <>
      <div className="bg-white rounded-lg border border-[#0B1E3D]/20 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-[#F8F4ED] px-4 sm:px-6 py-3 sm:py-4 border-b border-[#0B1E3D]/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-[#0B1E3D]" />
              <h3 
                className="text-[#0B1E3D] tracking-wide"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1rem'
                }}
              >
                Novidades do Cânone
              </h3>
            </div>
            <span className="text-xs text-[#0B1E3D]/50">
              {currentIndex + 1} / {articles.length}
            </span>
          </div>
        </div>

        {/* Carousel */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.4 }}
              onClick={() => setSelectedArticle(currentArticle)}
              className="p-5 sm:p-6 cursor-pointer hover:bg-[#F8F4ED]/50 transition-colors duration-200 group"
            >
              {/* Fonte/Jornal */}
              <div className="flex items-center gap-2 text-xs mb-3">
                <span className="text-[#0B1E3D]/50">{currentArticle.source}</span>
                <span className="text-[#0B1E3D]/30">•</span>
                <span className="text-[#0B1E3D]/40">{currentArticle.date}</span>
              </div>

              {/* Título (Manchete) */}
              <h4 
                className="text-[#0B1E3D] mb-3 leading-tight"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.25rem'
                }}
              >
                {currentArticle.title}
              </h4>

              {/* Excerpt */}
              <p className="text-sm text-[#0B1E3D]/60 leading-relaxed mb-4 line-clamp-2">
                {currentArticle.excerpt}
              </p>

              {/* Ícone de Leitura */}
              <div className="flex items-center justify-end">
                <motion.div
                  className="flex items-center gap-1.5 text-[#FFD479] group-hover:text-[#0B1E3D] transition-colors duration-200"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-xs">Ler artigo</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons - Desktop */}
          <div className="hidden sm:block">
            <button
              onClick={handlePrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-[#0B1E3D]/10 flex items-center justify-center hover:bg-[#FFD479] hover:border-[#FFD479] transition-all duration-300 group"
            >
              <ChevronLeft className="w-4 h-4 text-[#0B1E3D] group-hover:text-white" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 border border-[#0B1E3D]/10 flex items-center justify-center hover:bg-[#FFD479] hover:border-[#FFD479] transition-all duration-300 group"
            >
              <ChevronRight className="w-4 h-4 text-[#0B1E3D] group-hover:text-white" />
            </button>
          </div>
        </div>

        {/* Dots Navigation - Mobile */}
        <div className="sm:hidden flex justify-center gap-1.5 pb-4">
          {articles.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-[#FFD479] w-6' : 'bg-[#0B1E3D]/20 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Article Modal with Sidebar */}
      <ArticleModal
        article={selectedArticle}
        onClose={() => setSelectedArticle(null)}
        onAskLumen={(question) => {
          if (onAskLumen && selectedArticle) {
            onAskLumen(selectedArticle);
          }
        }}
      />
    </>
  );
}
