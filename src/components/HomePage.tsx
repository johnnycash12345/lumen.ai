import { Search, Sparkles, Castle, Rocket, BookOpen } from 'lucide-react';
import { UniverseCard } from './UniverseCard';
import { GlobalChat } from './GlobalChat';
import { NewsCarousel } from './NewsCarousel';
import { CuriosityWidget } from './CuriosityWidget';
import { motion } from 'motion/react';
import { newsArticles, curiosities } from '../data/mockUniverseData';

interface HomePageProps {
  onSelectUniverse: (universe: string) => void;
}

const universes = [
  {
    id: 'sherlock',
    title: 'Sherlock Holmes',
    description: 'Enter the world of deduction. Explore cases, characters, and London\'s mysteries.',
    icon: Search,
  },
  {
    id: 'harry-potter',
    title: 'Harry Potter',
    description: 'The wizarding world awaits. Discover spells, creatures, and Hogwarts.',
    icon: Sparkles,
  },
  {
    id: 'lotr',
    title: 'O Senhor dos Anéis',
    description: 'Journey to Middle-earth. Maps, lore, and the Fellowship\'s quest.',
    icon: Castle,
  },
  {
    id: 'star-wars',
    title: 'Star Wars',
    description: 'A galaxy far, far away. Explore planets, characters, and the Force.',
    icon: Rocket,
  },
];

export function HomePage({ onSelectUniverse }: HomePageProps) {
  return (
    <div className="min-h-screen pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          {/* Título LUMEN com Glow Dourado */}
          <motion.h1 
            className="text-[#0B1E3D] mb-3 sm:mb-4 text-4xl sm:text-5xl lg:text-6xl relative inline-block"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            style={{
              fontFamily: 'Playfair Display, serif'
            }}
          >
            <motion.span
              animate={{
                textShadow: [
                  '0 0 10px rgba(255, 212, 121, 0.3)',
                  '0 0 20px rgba(255, 212, 121, 0.5)',
                  '0 0 10px rgba(255, 212, 121, 0.3)',
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              LUMEN
            </motion.span>
          </motion.h1>
          
          {/* Subtítulo - Slide up */}
          <motion.p 
            className="text-base sm:text-lg lg:text-xl text-[#0B1E3D]/80 max-w-2xl mx-auto px-4 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Converse com universos inteiros.
          </motion.p>
          
          {/* Frase Principal - Fade in */}
          <motion.p 
            className="text-sm sm:text-base text-[#0B1E3D]/70 max-w-xl mx-auto px-4 mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.5 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 300
            }}
          >
            Descubra tudo sobre seu universo preferido.
          </motion.p>
          
          {/* Frase Complementar - Fade in */}
          <motion.p 
            className="text-xs sm:text-sm text-[#0B1E3D]/40 max-w-lg mx-auto px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 1.5 }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontWeight: 200
            }}
          >
            Nossa IA dá voz a cada personagem, local e evento.
          </motion.p>
        </div>

        {/* Global Chat */}
        <div className="mb-8 sm:mb-12 lg:mb-16">
          <GlobalChat onUniverseSelect={onSelectUniverse} />
        </div>

        {/* News & Curiosities Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <NewsCarousel 
              articles={newsArticles}
              universe="sherlock"
              onAskLumen={(article) => {
                console.log('Ask Lumen about:', article.title);
              }}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <CuriosityWidget
              curiosities={curiosities}
              universeId="sherlock"
              onNavigateToUniverse={(universeId) => {
                onSelectUniverse(universeId);
              }}
            />
          </motion.div>
        </div>

        {/* Universe Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12 sm:mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          {universes.map((universe, index) => (
            <motion.div
              key={universe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
            >
              <UniverseCard
                title={universe.title}
                description={universe.description}
                icon={universe.icon}
                onClick={() => onSelectUniverse(universe.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.div 
          className="text-center text-xs sm:text-sm text-[#0B1E3D]/50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
            <a href="#" className="hover:text-[#FFD479] transition-colors duration-300">Sobre</a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-[#FFD479] transition-colors duration-300">Contato</a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-[#FFD479] transition-colors duration-300">Documentação</a>
            <span className="hidden sm:inline">•</span>
            <a href="#" className="hover:text-[#FFD479] transition-colors duration-300">Github</a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
