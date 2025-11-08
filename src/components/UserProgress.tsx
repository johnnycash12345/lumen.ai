import { motion } from 'framer-motion';
import { Award, BookOpen, Users, MapPin, TrendingUp } from 'lucide-react';
import { Progress } from './ui/progress';

interface ProgressData {
  universe: string;
  overallProgress: number;
  storiesRead: { current: number; total: number };
  charactersExplored: { current: number; total: number };
  locationsVisited: { current: number; total: number };
  conversationsHad: number;
}

interface UserProgressProps {
  progressData: ProgressData;
}

export function UserProgress({ progressData }: UserProgressProps) {
  const stats = [
    {
      icon: BookOpen,
      label: 'Contos Lidos',
      current: progressData.storiesRead.current,
      total: progressData.storiesRead.total,
      color: '#FFD479'
    },
    {
      icon: Users,
      label: 'Personagens',
      current: progressData.charactersExplored.current,
      total: progressData.charactersExplored.total,
      color: '#0B1E3D'
    },
    {
      icon: MapPin,
      label: 'Locais',
      current: progressData.locationsVisited.current,
      total: progressData.locationsVisited.total,
      color: '#FFD479'
    }
  ];

  return (
    <div className="bg-gradient-to-br from-white to-[#F8F4ED] rounded-xl border border-[#0B1E3D]/10 p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-4">
        <Award className="w-5 h-5 text-[#FFD479]" />
        <h3 className="text-base sm:text-lg text-[#0B1E3D]">Minha Jornada em {progressData.universe}</h3>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#0B1E3D]/70">Progresso Geral</span>
          <span className="text-lg text-[#FFD479]">{progressData.overallProgress}%</span>
        </div>
        <Progress value={progressData.overallProgress} className="h-3" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        {stats.map((stat, idx) => {
          const percentage = (stat.current / stat.total) * 100;
          
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-lg p-3 sm:p-4 border border-[#0B1E3D]/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                <span className="text-xs text-[#0B1E3D]/70">{stat.label}</span>
              </div>
              
              <div className="text-xl sm:text-2xl text-[#0B1E3D] mb-2">
                {stat.current}
                <span className="text-sm text-[#0B1E3D]/40">/{stat.total}</span>
              </div>
              
              <div className="h-1.5 bg-[#F8F4ED] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ delay: idx * 0.1 + 0.3, duration: 0.8 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: stat.color }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Conversations */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-[#FFD479]/10 to-transparent rounded-lg border border-[#FFD479]/20">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#FFD479]" />
          <span className="text-xs sm:text-sm text-[#0B1E3D]">Conversas com o Lumen</span>
        </div>
        <span className="text-base sm:text-lg text-[#FFD479]">{progressData.conversationsHad}</span>
      </div>
    </div>
  );
}
