import { motion } from '@/lib/motion';
import { Award, TrendingUp, Star, Clock } from 'lucide-react';
import { UserProgress } from './UserProgress';
import { ResearchNotes } from './ResearchNotes';
import { userProgressData, sampleResearchNotes } from '../data/mockUniverseData';
import { useState } from 'react';

export function JourneyPage() {
  const [researchNotes, setResearchNotes] = useState(sampleResearchNotes);

  const handleSaveNote = (note: any) => {
    const newNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setResearchNotes([newNote, ...researchNotes]);
  };

  const handleDeleteNote = (noteId: string) => {
    setResearchNotes(researchNotes.filter(note => note.id !== noteId));
  };

  const handleExportNotes = () => {
    const notesText = researchNotes
      .map(note => `# ${note.title}\n\n${note.content}\n\nTags: ${note.tags.join(', ')}\n\n---\n\n`)
      .join('');
    
    const blob = new Blob([notesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lumen-research-notes.txt';
    a.click();
  };

  const achievements = [
    { id: '1', title: 'Primeiro Passo', description: 'Explorou seu primeiro universo', icon: Star, unlocked: true },
    { id: '2', title: 'Conversador', description: 'Teve 50 conversas com o Lumen', icon: TrendingUp, unlocked: false },
    { id: '3', title: 'Erudito', description: 'Completou 100% de um universo', icon: Award, unlocked: false },
    { id: '4', title: 'Dedicado', description: 'Usou o Lumen por 7 dias seguidos', icon: Clock, unlocked: false }
  ];

  return (
    <div className="min-h-screen pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-[#0B1E3D] mb-2 text-center">Minha Jornada Lumen</h1>
          <p className="text-center text-sm sm:text-base text-[#0B1E3D]/70 mb-8">
            Acompanhe seu progresso e documentação através dos universos
          </p>

          {/* Progress Section */}
          <div className="mb-8">
            <UserProgress progressData={userProgressData} />
          </div>

          {/* Achievements */}
          <div className="mb-8">
            <h2 className="text-xl text-[#0B1E3D] mb-4">Conquistas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {achievements.map((achievement, idx) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`p-4 rounded-xl border-2 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-[#FFD479]/20 to-[#FFD479]/10 border-[#FFD479]'
                      : 'bg-white border-[#0B1E3D]/10 opacity-60'
                  }`}
                >
                  <achievement.icon 
                    className={`w-8 h-8 mb-3 ${
                      achievement.unlocked ? 'text-[#FFD479]' : 'text-[#0B1E3D]/30'
                    }`} 
                  />
                  <h3 className="text-sm text-[#0B1E3D] mb-1">{achievement.title}</h3>
                  <p className="text-xs text-[#0B1E3D]/60">{achievement.description}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Research Notes */}
          <div>
            <ResearchNotes
              notes={researchNotes}
              onSaveNote={handleSaveNote}
              onDeleteNote={handleDeleteNote}
              onExportNotes={handleExportNotes}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
