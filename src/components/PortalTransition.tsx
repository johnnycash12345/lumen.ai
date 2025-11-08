import { motion } from 'framer-motion';

interface PortalTransitionProps {
  isVisible: boolean;
  onComplete: () => void;
}

export function PortalTransition({ isVisible, onComplete }: PortalTransitionProps) {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1E3D]/90 backdrop-blur-sm"
      onAnimationComplete={() => {
        setTimeout(onComplete, 1500);
      }}
    >
      {/* Golden particles */}
      <div className="relative">
        {[...Array(12)].map((_, i) => {
          const angle = (i * 30) * (Math.PI / 180);
          const distance = 100;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          
          return (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-[#FFD479] rounded-full"
              style={{
                left: '50%',
                top: '50%',
              }}
              initial={{ x: 0, y: 0, opacity: 0 }}
              animate={{
                x: [0, x, 0],
                y: [0, y, 0],
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0]
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.05,
                ease: "easeInOut"
              }}
            />
          );
        })}
        
        {/* Center glow */}
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-r from-[#FFD479] to-[#FFC857]"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: [0, 1, 1.5],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 1.5,
            ease: "easeOut"
          }}
        />
      </div>
      
      {/* Loading text */}
      <motion.div
        className="absolute text-white text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <p className="text-sm">Entrando no universo...</p>
      </motion.div>
    </motion.div>
  );
}
