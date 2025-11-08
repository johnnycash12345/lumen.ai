import { motion } from 'framer-motion';
import { User, Sparkles } from 'lucide-react';
import { Button } from './ui/button';

interface CharacterPerspectiveModeProps {
  characterName: string;
  characterAvatar?: string;
  isActive: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}

export function CharacterPerspectiveMode({ 
  characterName, 
  characterAvatar,
  isActive, 
  onActivate,
  onDeactivate 
}: CharacterPerspectiveModeProps) {
  
  if (isActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#FFD479]/20 to-[#FFD479]/10 border-2 border-[#FFD479] rounded-xl p-4 mb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ 
                boxShadow: ['0 0 0 0 rgba(255, 212, 121, 0.4)', '0 0 0 8px rgba(255, 212, 121, 0)']
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-10 h-10 rounded-full bg-[#FFD479] flex items-center justify-center"
            >
              {characterAvatar ? (
                <img src={characterAvatar} alt={characterName} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-[#0B1E3D]" />
              )}
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-3 h-3 text-[#FFD479]" />
                <span className="text-xs text-[#0B1E3D]/70">Modo Perspectiva Ativa</span>
              </div>
              <span className="text-sm text-[#0B1E3D]">
                Conversando como <strong>{characterName}</strong>
              </span>
            </div>
          </div>
          
          <Button
            onClick={onDeactivate}
            variant="ghost"
            size="sm"
            className="text-[#0B1E3D]/60 hover:text-[#0B1E3D]"
          >
            Desativar
          </Button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-gradient-to-br from-white to-[#F8F4ED] border border-[#0B1E3D]/10 rounded-xl p-4 mb-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-[#0B1E3D]/5 flex items-center justify-center flex-shrink-0">
            {characterAvatar ? (
              <img src={characterAvatar} alt={characterName} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-[#0B1E3D]/40" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-xs text-[#0B1E3D]/60 mb-1">Experimente o roleplay</p>
            <p className="text-sm text-[#0B1E3D] truncate">
              Converse na perspectiva de <strong>{characterName}</strong>
            </p>
          </div>
        </div>
        
        <Button
          onClick={onActivate}
          className="bg-[#0B1E3D] hover:bg-[#FFD479] text-white hover:text-[#0B1E3D] transition-all duration-300 flex-shrink-0 text-xs sm:text-sm"
        >
          <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Converse como </span>
          {characterName}
        </Button>
      </div>
    </motion.div>
  );
}
