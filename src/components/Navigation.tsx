import { Hexagon, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion';
import { useState } from 'react';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'inicio', label: 'Início' },
    { id: 'sobre', label: 'Sobre' },
    { id: 'documentacao', label: 'Documentação' },
    { id: 'contato', label: 'Contato' },
  ];

  const handleNavigate = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#0B1E3D]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <button 
            onClick={() => handleNavigate('inicio')}
            className="flex items-center gap-2 sm:gap-3 group"
          >
            <motion.div
              animate={{ 
                filter: [
                  'drop-shadow(0 0 2px rgba(255, 212, 121, 0.5))',
                  'drop-shadow(0 0 8px rgba(255, 212, 121, 0.8))',
                  'drop-shadow(0 0 2px rgba(255, 212, 121, 0.5))'
                ]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Hexagon className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFD479] fill-[#FFD479]" />
            </motion.div>
            <span style={{ fontFamily: 'Playfair Display, serif' }} className="text-lg sm:text-xl lg:text-2xl text-[#0B1E3D] group-hover:text-[#FFD479] transition-colors duration-300">
              LUMEN
            </span>
          </button>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`relative text-sm transition-colors duration-300 ${
                  currentPage === item.id 
                    ? 'text-[#0B1E3D]' 
                    : 'text-[#0B1E3D]/60 hover:text-[#FFD479]'
                }`}
              >
                {item.label}
                {currentPage === item.id && (
                  <motion.span 
                    layoutId="activeTab"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#FFD479]"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#FFD479]/10 transition-colors duration-300"
            aria-label="Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#0B1E3D]" />
            ) : (
              <Menu className="w-6 h-6 text-[#0B1E3D]" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-[#0B1E3D]/20 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-[57px] sm:top-[65px] right-0 bottom-0 w-64 bg-white border-l border-[#0B1E3D]/10 z-40 md:hidden shadow-2xl"
            >
              <div className="p-6 space-y-1">
                {navItems.map((item, idx) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 ${
                      currentPage === item.id
                        ? 'bg-gradient-to-r from-[#FFD479]/20 to-[#FFD479]/10 text-[#0B1E3D] border-l-4 border-[#FFD479]'
                        : 'text-[#0B1E3D]/70 hover:bg-[#FFD479]/5 hover:text-[#0B1E3D]'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>

              {/* Golden accent at bottom */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="h-px bg-gradient-to-r from-transparent via-[#FFD479] to-transparent" />
                <p className="text-xs text-[#0B1E3D]/40 text-center mt-4">
                  Enciclopédia Interativa
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
