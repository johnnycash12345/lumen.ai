import { MapPin, BookOpen, ArrowLeft, Calendar, Users } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { motion } from 'framer-motion';

interface ElementDetailCardProps {
  element: {
    id: string;
    name: string;
    type: 'location' | 'case';
    description: string;
  };
  onBack: () => void;
}

export function ElementDetailCard({ element, onBack }: ElementDetailCardProps) {
  const Icon = element.type === 'location' ? MapPin : BookOpen;
  const typeLabel = element.type === 'location' ? 'Local' : 'Caso';

  // Mock data
  const relatedCharacters = ['Sherlock Holmes', 'Dr. Watson', 'Inspector Lestrade'];
  const timeline = [
    { year: '1887', event: 'Primeira aparição' },
    { year: '1890', event: 'Evento principal' }
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
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FFD479]/20 to-[#0B1E3D]/10 flex items-center justify-center flex-shrink-0">
              <Icon className="w-8 h-8 text-[#FFD479]" />
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
                {element.name}
              </h2>
              <Badge className="bg-[#FFD479]/20 text-[#0B1E3D] border-[#FFD479]/40">
                {typeLabel}
              </Badge>
            </div>
          </div>

          <p className="text-sm text-[#0B1E3D]/70 leading-relaxed">
            {element.description}
          </p>
        </div>

        <Separator className="my-6 bg-[#0B1E3D]/10" />

        {/* Personagens Relacionados */}
        <div className="mb-6">
          <h3 
            className="text-[#0B1E3D] mb-4 flex items-center gap-2"
            style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.1rem'
            }}
          >
            <Users className="w-5 h-5 text-[#FFD479]" />
            Personagens Relacionados
          </h3>
          <div className="space-y-2">
            {relatedCharacters.map((char, idx) => (
              <button
                key={idx}
                className="w-full text-left px-4 py-2.5 rounded-lg bg-[#F8F4ED] hover:bg-[#FFD479]/10 border border-[#0B1E3D]/10 hover:border-[#FFD479] transition-all duration-200"
              >
                <span className="text-sm text-[#0B1E3D]">{char}</span>
              </button>
            ))}
          </div>
        </div>

        <Separator className="my-6 bg-[#0B1E3D]/10" />

        {/* Cronologia */}
        {element.type === 'case' && (
          <>
            <div className="mb-6">
              <h3 
                className="text-[#0B1E3D] mb-4 flex items-center gap-2"
                style={{
                  fontFamily: 'Playfair Display, serif',
                  fontSize: '1.1rem'
                }}
              >
                <Calendar className="w-5 h-5 text-[#FFD479]" />
                Cronologia do Caso
              </h3>
              <div className="space-y-3">
                {timeline.map((item, idx) => (
                  <div key={idx} className="flex gap-3">
                    <div className="w-16 text-xs text-[#FFD479] flex-shrink-0">
                      {item.year}
                    </div>
                    <div className="flex-1 text-sm text-[#0B1E3D]/70">
                      {item.event}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Separator className="my-6 bg-[#0B1E3D]/10" />
          </>
        )}

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
                Todas as informações foram validadas contra as obras originais.
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
