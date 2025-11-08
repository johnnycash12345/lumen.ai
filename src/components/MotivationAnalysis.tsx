import { motion } from 'framer-motion';
import { Target } from 'lucide-react';

interface Motivation {
  name: string;
  percentage: number;
  color: string;
}

interface MotivationAnalysisProps {
  motivations: Motivation[];
  characterName: string;
  summary: string;
}

export function MotivationAnalysis({ motivations, characterName, summary }: MotivationAnalysisProps) {
  return (
    <div className="bg-gradient-to-br from-white to-[#F8F4ED] rounded-xl border border-[#0B1E3D]/10 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#FFD479]" />
        <h3 className="text-sm sm:text-base text-[#0B1E3D]">Motivação Canônica</h3>
      </div>

      <p className="text-xs sm:text-sm text-[#0B1E3D]/70 leading-relaxed mb-4">
        {summary}
      </p>

      {/* Circular Progress */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-4">
        {motivations.map((motivation, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mb-2">
              {/* Background circle */}
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="50%"
                  cy="50%"
                  r="30%"
                  fill="none"
                  stroke="#F8F4ED"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="30%"
                  fill="none"
                  stroke={motivation.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ strokeDashoffset: 188 }}
                  animate={{ 
                    strokeDashoffset: 188 - (188 * motivation.percentage) / 100 
                  }}
                  transition={{ delay: idx * 0.1 + 0.3, duration: 1, ease: 'easeOut' }}
                  style={{
                    strokeDasharray: 188
                  }}
                />
              </svg>
              
              {/* Percentage in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs sm:text-sm text-[#0B1E3D]">
                  {motivation.percentage}%
                </span>
              </div>
            </div>
            
            <span className="text-[10px] sm:text-xs text-center text-[#0B1E3D]/80">
              {motivation.name}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Bar representation for mobile */}
      <div className="space-y-2">
        {motivations.map((motivation, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: motivation.color }}
            />
            <div className="flex-1 h-1.5 bg-[#F8F4ED] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${motivation.percentage}%` }}
                transition={{ delay: idx * 0.1 + 0.4, duration: 0.8 }}
                className="h-full rounded-full"
                style={{ backgroundColor: motivation.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
