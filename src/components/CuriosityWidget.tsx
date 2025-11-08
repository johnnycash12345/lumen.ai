import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from '@/lib/motion';
import { Lightbulb, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface Curiosity {
  id: string;
  text: string;
  category: string;
}

interface CuriosityWidgetProps {
  curiosities: Curiosity[];
  onCuriosityClick?: (curiosity: Curiosity) => void;
  universeId?: string;
  onNavigateToUniverse?: (universeId: string) => void;
}

export function CuriosityWidget({ curiosities, onCuriosityClick, universeId, onNavigateToUniverse }: CuriosityWidgetProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(false);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRotating(true);
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % curiosities.length);
      setIsRotating(false);
    }, 300);
  };

  // Auto-rotate every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % curiosities.length);
    }, 10000);

    return () => clearInterval(interval);
  }, [currentIndex, curiosities.length]);

  const currentCuriosity = curiosities[currentIndex];

  const handleClick = () => {
    if (onNavigateToUniverse && universeId) {
      onNavigateToUniverse(universeId);
    } else if (onCuriosityClick) {
      onCuriosityClick(currentCuriosity);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={handleClick}
      className="bg-white rounded-lg border-2 border-[#FFD479]/40 p-6 sm:p-8 overflow-hidden relative cursor-pointer hover:border-[#FFD479] hover:shadow-lg transition-all duration-300 group"
      style={{
        boxShadow: '0 2px 12px rgba(255, 212, 121, 0.15)'
      }}
    >
      {/* Decorative golden line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFD479] to-transparent opacity-60" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                rotate: isRotating ? 360 : 0,
                scale: [1, 1.1, 1]
              }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFD479]/10"
            >
              <Lightbulb className="w-5 h-5 text-[#FFD479]" />
            </motion.div>
            <div>
              <span 
                className="text-[#0B1E3D] block"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1rem'
                }}
              >
                Lumen Insights
              </span>
              <div className="text-xs text-[#0B1E3D]/50 mt-0.5">{currentCuriosity?.category}</div>
            </div>
          </div>

          <Button
            onClick={handleNext}
            variant="ghost"
            size="sm"
            className="h-auto p-2 hover:bg-[#FFD479]/10 flex-shrink-0"
          >
            <motion.div
              animate={{ rotate: isRotating ? 360 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <RefreshCw className="w-4 h-4 text-[#0B1E3D]/60" />
            </motion.div>
          </Button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-base text-[#0B1E3D]/80 leading-relaxed group-hover:text-[#0B1E3D] transition-colors duration-300 mb-4">
              {currentCuriosity?.text}
            </p>
            <motion.span 
              className="text-sm text-[#FFD479] inline-flex items-center gap-1"
              initial={{ opacity: 0.7 }}
              whileHover={{ opacity: 1, x: 5 }}
            >
              Explorar universo
              <ArrowRight className="w-4 h-4" />
            </motion.span>
          </motion.div>
        </AnimatePresence>

        {/* Progress dots */}
        <div className="flex gap-1.5 mt-5 pt-4 border-t border-[#0B1E3D]/10">
          {curiosities.map((_, idx) => (
            <motion.div
              key={idx}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'bg-[#FFD479] w-8' : 'bg-[#0B1E3D]/20 w-1.5'
              }`}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
