import { ArrowLeft, Gem, User } from 'lucide-react';
import { Card } from './ui/card';

interface ObjectDynamicPageProps {
  data: any;
  onBack: () => void;
}

export function ObjectDynamicPage({ data, onBack }: ObjectDynamicPageProps) {
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
            <Gem className="w-12 h-12" />
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
              Descrição
            </h2>
            <p className="text-[#0B1E3D]/80 leading-relaxed">{data.description}</p>
          </Card>
        )}

        {/* Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {data.significance && (
            <Card className="p-6 bg-white">
              <h3 className="font-bold text-[#0B1E3D] mb-2">Significância</h3>
              <p className="text-[#0B1E3D]/70">{data.significance}</p>
            </Card>
          )}

          {data.owner && (
            <Card className="p-6 bg-white">
              <div className="flex items-start gap-3">
                <User className="w-6 h-6 text-[#FFD479] mt-1" />
                <div>
                  <h3 className="font-bold text-[#0B1E3D] mb-2">Proprietário</h3>
                  <p className="text-[#0B1E3D]/70">{data.owner.name || 'Desconhecido'}</p>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}