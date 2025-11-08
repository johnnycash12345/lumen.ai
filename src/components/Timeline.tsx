import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';

interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  category: string;
  relatedCharacters?: string[];
}

interface TimelineProps {
  events: TimelineEvent[];
  filterBy?: string;
  onEventClick?: (event: TimelineEvent) => void;
}

export function Timeline({ events, filterBy, onEventClick }: TimelineProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const filteredEvents = filterBy
    ? events.filter(e => e.relatedCharacters?.includes(filterBy) || e.category === filterBy)
    : events;

  const handlePrevious = () => {
    setSelectedIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex(prev => Math.min(filteredEvents.length - 1, prev + 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) handleNext();
    if (isRightSwipe) handlePrevious();
  };

  return (
    <div className="bg-white rounded-xl border border-[#0B1E3D]/10 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B1E3D] to-[#0B1E3D]/90 px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD479]" />
          <h3 className="text-white text-sm sm:text-base">Linha do Tempo</h3>
        </div>
        {filterBy && (
          <span className="text-xs text-white/70 bg-white/10 px-2 py-1 rounded-full">
            Filtrado: {filterBy}
          </span>
        )}
      </div>

      {/* Desktop Timeline - Horizontal scroll */}
      <div className="hidden lg:block p-6">
        <div className="relative">
          <div className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-[#FFD479] scrollbar-track-gray-100">
            {filteredEvents.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="flex-shrink-0 w-64 snap-start"
              >
                <button
                  onClick={() => onEventClick?.(event)}
                  className="text-left w-full group"
                >
                  <div className="relative pl-6 pb-6">
                    {/* Dot */}
                    <motion.div
                      className="absolute left-0 top-0 w-4 h-4 rounded-full bg-[#FFD479] ring-4 ring-[#FFD479]/20"
                      whileHover={{ scale: 1.3 }}
                    />
                    
                    {/* Line to next */}
                    {idx < filteredEvents.length - 1 && (
                      <div className="absolute left-2 top-4 w-64 h-0.5 bg-gradient-to-r from-[#FFD479] to-[#FFD479]/20" />
                    )}

                    {/* Content */}
                    <div className="bg-gradient-to-br from-[#F8F4ED] to-white p-4 rounded-lg border border-[#0B1E3D]/10 group-hover:border-[#FFD479]/50 transition-all duration-300 group-hover:shadow-lg">
                      <div className="text-xs text-[#FFD479] mb-1">{event.year}</div>
                      <div className="text-sm text-[#0B1E3D] mb-2">{event.title}</div>
                      <div className="text-xs text-[#0B1E3D]/60 line-clamp-2">{event.description}</div>
                    </div>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Timeline - Swipeable cards */}
      <div 
        className="lg:hidden p-4"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-[#F8F4ED] to-white p-4 rounded-lg border-2 border-[#FFD479]/30"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FFD479]" />
                  <span className="text-sm text-[#FFD479]">{filteredEvents[selectedIndex]?.year}</span>
                </div>
                <span className="text-xs text-[#0B1E3D]/40">
                  {selectedIndex + 1} / {filteredEvents.length}
                </span>
              </div>
              
              <h4 className="text-[#0B1E3D] mb-2 text-base">
                {filteredEvents[selectedIndex]?.title}
              </h4>
              
              <p className="text-sm text-[#0B1E3D]/70 leading-relaxed">
                {filteredEvents[selectedIndex]?.description}
              </p>

              {filteredEvents[selectedIndex]?.relatedCharacters && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {filteredEvents[selectedIndex].relatedCharacters?.map(char => (
                    <span key={char} className="text-xs bg-[#FFD479]/10 text-[#0B1E3D] px-2 py-1 rounded-full">
                      {char}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-4">
            <Button
              onClick={handlePrevious}
              disabled={selectedIndex === 0}
              variant="ghost"
              size="sm"
              className="disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex gap-1">
              {filteredEvents.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === selectedIndex ? 'bg-[#FFD479] w-6' : 'bg-[#0B1E3D]/20'
                  }`}
                />
              ))}
            </div>

            <Button
              onClick={handleNext}
              disabled={selectedIndex === filteredEvents.length - 1}
              variant="ghost"
              size="sm"
              className="disabled:opacity-30"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
