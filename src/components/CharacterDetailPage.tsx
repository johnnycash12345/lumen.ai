import { useState } from 'react';
import { ArrowLeft, User, MapPin, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { CharacterPerspectiveMode } from './CharacterPerspectiveMode';
import { ElementComparator } from './ElementComparator';
import { ConflictMatrix } from './ConflictMatrix';
import { MotivationAnalysis } from './MotivationAnalysis';
import { QuotesCarousel } from './QuotesCarousel';
import { Timeline } from './Timeline';
import { Badge } from './ui/badge';
import { motion } from 'motion';
import { 
  watsonDetailedData, 
  lestradeDetailedData, 
  catalogElements, 
  timelineEvents 
} from '../data/mockUniverseData';

interface CharacterDetailPageProps {
  characterId: string;
  onBack: () => void;
  onActivatePerspective: () => void;
  isPerspectiveActive: boolean;
}

export function CharacterDetailPage({ 
  characterId, 
  onBack, 
  onActivatePerspective,
  isPerspectiveActive 
}: CharacterDetailPageProps) {
  const character = catalogElements.find(el => el.id === characterId && el.type === 'character');
  
  if (!character) return null;

  // Use Watson as the detailed example
  const isWatson = characterId === 'watson';
  const detailedData = isWatson ? watsonDetailedData : lestradeDetailedData;

  return (
    <div className="min-h-screen bg-[#F8F4ED] pt-16 sm:pt-20 lg:pt-24 pb-8 sm:pb-12 lg:pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Back Button */}
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-4 text-[#0B1E3D] hover:text-[#FFD479]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao Catálogo
        </Button>

        {/* Character Perspective Mode */}
        {isWatson && (
          <CharacterPerspectiveMode
            characterName={character.name}
            isActive={isPerspectiveActive}
            onActivate={onActivatePerspective}
            onDeactivate={() => {}}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Character Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-[#0B1E3D]/10 p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD479]/20 to-[#0B1E3D]/10 flex items-center justify-center">
                    <User className="w-8 h-8 text-[#FFD479]" />
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl text-[#0B1E3D] mb-1">
                      {character.name}
                    </h1>
                    <Badge className="bg-[#FFD479]/20 text-[#0B1E3D]">
                      Personagem
                    </Badge>
                  </div>
                </div>

                <ElementComparator
                  element={character as any}
                  availableElements={catalogElements as any}
                  onCompare={(el1, el2) => {
                    console.log('Compare:', el1.name, 'vs', el2.name);
                  }}
                />
              </div>

              <p className="text-sm sm:text-base text-[#0B1E3D]/70 leading-relaxed mb-4">
                {character.description}
              </p>

              {/* Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(character.attributes).map(([key, value]) => (
                  <div 
                    key={key}
                    className="bg-gradient-to-br from-[#F8F4ED] to-white p-3 rounded-lg border border-[#0B1E3D]/10"
                  >
                    <div className="text-xs text-[#FFD479] mb-1">{key}</div>
                    <div className="text-sm text-[#0B1E3D]">{value}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Tabs for Mobile/Desktop */}
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-white border border-[#0B1E3D]/10">
                <TabsTrigger value="analysis">Análise</TabsTrigger>
                <TabsTrigger value="quotes">Citações</TabsTrigger>
                <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
              </TabsList>

              <TabsContent value="analysis" className="space-y-6 mt-6">
                {/* Motivation Analysis */}
                {isWatson && (
                  <MotivationAnalysis
                    motivations={detailedData.motivations}
                    characterName={character.name}
                    summary={watsonDetailedData.motivationSummary}
                  />
                )}

                {/* Conflict Matrix */}
                <ConflictMatrix
                  conflicts={detailedData.conflicts}
                  characterName={character.name}
                />
              </TabsContent>

              <TabsContent value="quotes" className="mt-6">
                {isWatson && watsonDetailedData.quotes && (
                  <QuotesCarousel
                    quotes={watsonDetailedData.quotes}
                    characterName={character.name}
                  />
                )}
              </TabsContent>

              <TabsContent value="timeline" className="mt-6">
                <Timeline
                  events={timelineEvents}
                  filterBy={character.name}
                  onEventClick={(event) => {
                    console.log('Event clicked:', event.title);
                  }}
                />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6">
            {/* Related Locations */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-[#0B1E3D]/10 p-4 sm:p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-[#FFD479]" />
                <h3 className="text-sm text-[#0B1E3D]">Locais Frequentes</h3>
              </div>

              <div className="space-y-2">
                {['221B Baker Street', 'St. Bartholomew\'s Hospital', 'Diogenes Club'].map((location, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left p-2 rounded-lg hover:bg-[#FFD479]/10 transition-colors duration-200 text-xs text-[#0B1E3D]/70 hover:text-[#0B1E3D]"
                  >
                    → {location}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Related Events */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl border border-[#0B1E3D]/10 p-4 sm:p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="w-4 h-4 text-[#FFD479]" />
                <h3 className="text-sm text-[#0B1E3D]">Eventos Importantes</h3>
              </div>

              <div className="space-y-3">
                {timelineEvents
                  .filter(e => e.relatedCharacters?.includes(character.name))
                  .slice(0, 3)
                  .map((event, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-gradient-to-br from-[#F8F4ED] to-white border border-[#FFD479]/20"
                    >
                      <div className="text-[10px] text-[#FFD479] mb-1">{event.year}</div>
                      <div className="text-xs text-[#0B1E3D]">{event.title}</div>
                    </div>
                  ))}
              </div>
            </motion.div>

            {/* Tags/Themes */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-[#FFD479]/10 to-[#FFD479]/5 rounded-xl border border-[#FFD479]/30 p-4 sm:p-6"
            >
              <h3 className="text-sm text-[#0B1E3D] mb-3">Análise de Temas</h3>
              <div className="flex flex-wrap gap-2">
                {['Lealdade', 'Aventura', 'Medicina', 'Guerra', 'Amizade', 'Narração'].map((tag, idx) => (
                  <Badge
                    key={idx}
                    className="bg-white/80 text-[#0B1E3D] hover:bg-[#FFD479] hover:text-white cursor-pointer transition-all duration-300"
                  >
                    #{tag}
                  </Badge>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
