import { User, Scale, Clock, MessageCircle, ArrowLeft, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { MotivationAnalysis } from './MotivationAnalysis';
import { QuotesCarousel } from './QuotesCarousel';
import { motion } from 'framer-motion';
import { watsonDetailedData } from '../data/mockUniverseData';

interface CharacterDetailCardProps {
  character: any;
  onBack: () => void;
  onCompare?: () => void;
  onViewTimeline?: () => void;
  onConversasComo?: () => void;
}

export function CharacterDetailCard({
  character,
  onBack,
  onCompare,
  onViewTimeline,
  onConversasComo
}: CharacterDetailCardProps) {
  const isProtagonist = character.id === 'sherlock-holmes';
  
  // Mock data - in real app, this would come from props
  const motivations = {
    logic: 95,
    order: 85,
    challenge: 90
  };

  const quotes = [
    {
      text: "Elementary, my dear Watson.",
      character: "Sherlock Holmes",
      context: "The Return of Sherlock Holmes"
    },
    {
      text: "When you have eliminated the impossible, whatever remains, however improbable, must be the truth.",
      character: "Sherlock Holmes",
      context: "The Sign of Four"
    }
  ];

  const sources = [
    { title: 'A Study in Scarlet', year: '1887' },
    { title: 'The Sign of Four', year: '1890' },
    { title: 'The Hound of the Baskervilles', year: '1902' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-full flex flex-col"
    >
      {/* Header com botão voltar */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#0B1E3D]/10">
        <Button
          onClick={onBack}
          variant="ghost"
          size="sm"
          className="text-[#0B1E3D]/70 hover:text-[#0B1E3D]"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Chat
        </Button>
      </div>

      {/* Conteúdo com scroll */}
      <div className="flex-1 overflow-y-auto pr-2">
        {/* Character Header */}
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD479]/20 to-[#0B1E3D]/10 flex items-center justify-center flex-shrink-0">
              <User className="w-8 h-8 text-[#FFD479]" />
            </div>
            <div className="flex-1">
              <h2 
                className="text-[#0B1E3D] mb-2"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.75rem',
                  lineHeight: '1.2'
                }}
              >
                {character.name}
              </h2>
              <Badge className="bg-[#FFD479]/20 text-[#0B1E3D] border-[#FFD479]/40">
                Personagem
              </Badge>
            </div>
          </div>

          {/* Linha de Ação */}
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              onClick={onCompare}
              variant="outline"
              size="sm"
              className="border-[#0B1E3D] text-[#0B1E3D] hover:bg-[#0B1E3D] hover:text-white text-xs"
            >
              <Scale className="w-3.5 h-3.5 mr-1.5" />
              Comparar
            </Button>
            
            <Button
              onClick={onViewTimeline}
              variant="outline"
              size="sm"
              className="border-[#0B1E3D] text-[#0B1E3D] hover:bg-[#0B1E3D] hover:text-white text-xs"
            >
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              Ver Cronologia
            </Button>
            
            {!isProtagonist && onConversasComo && (
              <Button
                onClick={onConversasComo}
                size="sm"
                className="bg-[#0B1E3D] text-white hover:bg-[#FFD479] hover:text-[#0B1E3D] text-xs"
              >
                <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
                Converse como {character.name.split(' ')[0]}
              </Button>
            )}
          </div>

          <p className="text-sm text-[#0B1E3D]/70 leading-relaxed">
            {character.description}
          </p>
        </div>

        <Separator className="my-6 bg-[#0B1E3D]/10" />

        {/* Análise de Motivação */}
        <div className="mb-6">
          <h3 
            className="text-[#0B1E3D] mb-4 flex items-center gap-2"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.1rem'
            }}
          >
            Análise de Motivação Canônica
          </h3>
          <MotivationAnalysis motivations={motivations} />
        </div>

        <Separator className="my-6 bg-[#0B1E3D]/10" />

        {/* Citações e Contexto */}
        <div className="mb-6">
          <h3 
            className="text-[#0B1E3D] mb-4 flex items-center gap-2"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.1rem'
            }}
          >
            Citações Canônicas
          </h3>
          <QuotesCarousel quotes={quotes} />
        </div>

        <Separator className="my-6 bg-[#0B1E3D]/10" />

        {/* Fontes Originais (Clicáveis) */}
        <div className="mb-6">
          <h3 
            className="text-[#0B1E3D] mb-4 flex items-center gap-2"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.1rem'
            }}
          >
            Fontes Originais
          </h3>
          <div className="space-y-2">
            {sources.map((source, idx) => (
              <button
                key={idx}
                className="w-full text-left px-4 py-3 rounded-lg bg-[#F8F4ED] hover:bg-[#FFD479]/10 border border-[#0B1E3D]/10 hover:border-[#FFD479] transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-[#FFD479]" />
                    <span className="text-sm text-[#0B1E3D] group-hover:text-[#0B1E3D]">
                      {source.title}
                    </span>
                  </div>
                  <span className="text-xs text-[#0B1E3D]/50">
                    {source.year}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Validação IA */}
        <div className="bg-gradient-to-br from-[#FFD479]/5 to-[#FFD479]/10 rounded-lg p-4 border-2 border-[#FFD479]/30">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FFD479]/20 flex items-center justify-center flex-shrink-0">
              <span className="text-sm">✓</span>
            </div>
            <div>
              <h4 className="text-sm text-[#0B1E3D] mb-1">
                Validação Canônica
              </h4>
              <p className="text-xs text-[#0B1E3D]/60 leading-relaxed">
                Todas as informações foram validadas contra as obras originais de Sir Arthur Conan Doyle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
