import { ArrowLeft, Calendar, MapPin, Users } from 'lucide-react';
import { Card } from './ui/card';

interface EventDynamicPageProps {
  data: any;
  onBack: () => void;
}

export function EventDynamicPage({ data, onBack }: EventDynamicPageProps) {
  return (
    <div className="min-h-screen bg-[#F8F4ED]">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#0B1E3D] to-[#1a3a5c] text-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </button>
          <div className="flex items-center gap-4 mb-4">
            <Calendar className="w-12 h-12" />
            <h1 className="text-5xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              {data.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Description */}
        {data.description && (
          <Card className="p-8 bg-white mb-8">
            <h2 className="text-2xl font-bold text-[#0B1E3D] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Descrição do Evento
            </h2>
            <p className="text-[#0B1E3D]/80 leading-relaxed">{data.description}</p>
          </Card>
        )}

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {data.timeline_order && (
            <Card className="p-6 bg-white">
              <h3 className="font-bold text-[#0B1E3D] mb-2">Ordem na Linha do Tempo</h3>
              <p className="text-2xl font-bold text-[#FFD479]">#{data.timeline_order}</p>
            </Card>
          )}

          {data.location && (
            <Card className="p-6 bg-white">
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-green-500 mt-1" />
                <div>
                  <h3 className="font-bold text-[#0B1E3D] mb-2">Local</h3>
                  <p className="text-[#0B1E3D]/70">{data.location.name || 'Desconhecido'}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Characters Involved */}
        {data.characters && data.characters.length > 0 && (
          <Card className="p-8 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-[#FFD479]" />
              <h2 className="text-2xl font-bold text-[#0B1E3D]" style={{ fontFamily: 'Playfair Display, serif' }}>
                Personagens Envolvidos
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.characters.map((character: any) => (
                <div key={character.id} className="p-4 bg-[#F8F4ED] rounded-lg">
                  <p className="font-bold text-[#0B1E3D]">{character.name}</p>
                  {character.role && (
                    <p className="text-sm text-[#0B1E3D]/70">{character.role}</p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}