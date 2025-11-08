import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface UniverseCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
}

export function UniverseCard({ title, description, icon: Icon, onClick }: UniverseCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="group relative bg-white rounded-lg p-5 sm:p-8 shadow-sm border border-[#0B1E3D]/10 text-left transition-all duration-300 hover:shadow-xl hover:border-[#FFD479]/30 overflow-hidden w-full"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Golden particles effect on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-[#FFD479] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              y: [0, -20],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 flex items-center justify-center rounded-full bg-[#FFD479]/10 group-hover:bg-[#FFD479]/20 transition-colors duration-300">
          <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#FFD479] stroke-[1.5] group-hover:scale-110 transition-transform duration-300" />
        </div>
        
        <h3 className="mb-2 sm:mb-3 text-[#0B1E3D] group-hover:text-[#FFD479] transition-colors duration-300 text-lg sm:text-xl lg:text-2xl">
          {title}
        </h3>
        
        <p className="text-[#0B1E3D]/70 text-xs sm:text-sm leading-relaxed group-hover:text-[#0B1E3D]/90 transition-colors duration-300">
          {description}
        </p>
      </div>
    </motion.button>
  );
}
