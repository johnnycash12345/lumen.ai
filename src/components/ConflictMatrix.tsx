import { motion } from 'motion';
import { Swords } from 'lucide-react';

interface Conflict {
  name: string;
  intensity: number;
  description: string;
}

interface ConflictMatrixProps {
  conflicts: Conflict[];
  characterName: string;
}

export function ConflictMatrix({ conflicts, characterName }: ConflictMatrixProps) {
  const maxIntensity = Math.max(...conflicts.map(c => c.intensity));

  return (
    <div className="bg-white rounded-xl border border-[#0B1E3D]/10 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Swords className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD479]" />
        <h3 className="text-sm sm:text-base text-[#0B1E3D]">Matriz de Conflitos</h3>
      </div>

      <div className="space-y-4">
        {conflicts.map((conflict, idx) => {
          const percentage = (conflict.intensity / maxIntensity) * 100;
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="text-[#0B1E3D]">{conflict.name}</span>
                <span className="text-[#FFD479]">{conflict.intensity}%</span>
              </div>

              <div className="relative h-2 bg-[#F8F4ED] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: idx * 0.1 + 0.2, duration: 0.8, ease: 'easeOut' }}
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    background: `linear-gradient(90deg, 
                      ${conflict.intensity > 70 ? '#ef4444' : conflict.intensity > 40 ? '#f59e0b' : '#FFD479'} 0%, 
                      ${conflict.intensity > 70 ? '#dc2626' : conflict.intensity > 40 ? '#d97706' : '#d4a574'} 100%)`
                  }}
                />
              </div>

              <p className="text-[10px] sm:text-xs text-[#0B1E3D]/60 leading-relaxed">
                {conflict.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
