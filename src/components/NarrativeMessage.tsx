import { motion } from 'motion/react';
import { Quote, Sparkles } from 'lucide-react';

interface NarrativeMessageProps {
  character: string;
  content: string;
  fidelityScore?: number;
}

export function NarrativeMessage({ character, content, fidelityScore = 95 }: NarrativeMessageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="my-6"
    >
      <div className="relative bg-gradient-to-br from-white to-[#F8F4ED] rounded-lg p-6 border-l-4 border-[#FFD479] shadow-md">
        {/* Golden Accent Corner */}
        <div className="absolute top-4 right-4">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Sparkles className="w-5 h-5 text-[#FFD479]" />
          </motion.div>
        </div>

        {/* Character Label */}
        <div className="flex items-center gap-2 mb-3">
          <Quote className="w-4 h-4 text-[#FFD479]" />
          <span className="font-['Playfair_Display'] text-[#0B1E3D]">
            Voz de {character}
          </span>
        </div>

        {/* Narrative Content */}
        <blockquote className="text-[#0B1E3D]/90 leading-relaxed italic mb-4 pl-4">
          "{content}"
        </blockquote>

        {/* Fidelity Badge */}
        <div className="flex items-center gap-2 pt-3 border-t border-[#FFD479]/20">
          <div className="flex-1">
            <div className="flex items-center gap-2 text-xs text-[#0B1E3D]/60">
              <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${fidelityScore}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="bg-gradient-to-r from-[#FFD479] to-[#FFD479]/60 h-full rounded-full"
                />
              </div>
              <span className="text-[#FFD479] font-medium">{fidelityScore}%</span>
            </div>
          </div>
          <span className="text-xs text-[#FFD479]">Fidelidade Canônica</span>
        </div>
      </div>
    </motion.div>
  );
}
