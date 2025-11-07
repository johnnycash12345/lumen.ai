import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface Category {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  items: string[];
}

interface CatalogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  activeCategory: string | null;
  onCategoryToggle: (categoryId: string) => void;
  highlightedItems: string[];
}

export function CatalogDrawer({
  isOpen,
  onClose,
  categories,
  activeCategory,
  onCategoryToggle,
  highlightedItems
}: CatalogDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B1E3D]/20 backdrop-blur-sm z-40 lg:hidden"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 bottom-0 w-80 max-w-[85vw] bg-white border-r border-[#0B1E3D]/10 z-50 lg:hidden shadow-2xl overflow-y-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0B1E3D] to-[#0B1E3D]/90 px-4 py-4 flex items-center justify-between sticky top-0 z-10">
              <h3 className="text-white">Catálogo</h3>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:text-[#FFD479] hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Categories */}
            <div className="p-4 space-y-4">
              {categories.map((category) => (
                <div key={category.id}>
                  <button
                    onClick={() => onCategoryToggle(category.id)}
                    className="flex items-center gap-2 w-full text-left mb-2 group"
                  >
                    <category.icon className="w-4 h-4 text-[#FFD479]" />
                    <span className="text-sm text-[#0B1E3D] group-hover:text-[#FFD479] transition-colors duration-200 flex-1">
                      {category.name}
                    </span>
                    <ChevronRight
                      className={`w-3 h-3 text-[#0B1E3D]/50 transition-transform duration-200 ${
                        activeCategory === category.id ? 'rotate-90' : ''
                      }`}
                    />
                  </button>

                  {activeCategory === category.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-6 space-y-1"
                    >
                      {category.items.map((item, idx) => {
                        const isHighlighted = highlightedItems.includes(item);
                        return (
                          <button
                            key={idx}
                            className={`block text-xs transition-all duration-200 py-1.5 px-2 rounded flex items-center gap-2 w-full text-left ${
                              isHighlighted
                                ? 'text-[#FFD479] font-medium bg-[#FFD479]/10'
                                : 'text-[#0B1E3D]/70 hover:text-[#FFD479] hover:bg-[#FFD479]/5'
                            }`}
                          >
                            {isHighlighted && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="inline-block"
                              >
                                <Sparkles className="w-3 h-3 text-[#FFD479]" />
                              </motion.span>
                            )}
                            • {item}
                          </button>
                        );
                      })}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
