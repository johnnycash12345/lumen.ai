import { ArrowLeft, Book, MapPin, Calendar, Gem } from 'lucide-react';
import { Card } from './ui/card';

interface UniverseDynamicPageProps {
  data: any;
  onBack: () => void;
}

export function UniverseDynamicPage({ data, onBack }: UniverseDynamicPageProps) {
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
          <h1 className="text-5xl font-bold mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
            {data.title}
          </h1>
          {data.description && (
            <p className="text-xl text-white/90 max-w-3xl">
              {data.description}
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card className="p-6 bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Book className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0B1E3D]">{data.characters?.length || 0}</p>
                <p className="text-sm text-[#0B1E3D]/70">Personagens</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0B1E3D]">{data.locations?.length || 0}</p>
                <p className="text-sm text-[#0B1E3D]/70">Locais</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0B1E3D]">{data.events?.length || 0}</p>
                <p className="text-sm text-[#0B1E3D]/70">Eventos</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Gem className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[#0B1E3D]">{data.objects?.length || 0}</p>
                <p className="text-sm text-[#0B1E3D]/70">Objetos</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Characters */}
        {data.characters && data.characters.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#0B1E3D] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Personagens
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.characters.map((character: any) => (
                <Card key={character.id} className="p-6 bg-white hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-[#0B1E3D] mb-2">{character.name}</h3>
                  {character.role && (
                    <p className="text-sm text-[#FFD479] mb-2 font-medium">{character.role}</p>
                  )}
                  {character.description && (
                    <p className="text-sm text-[#0B1E3D]/70 line-clamp-3">{character.description}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Locations */}
        {data.locations && data.locations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#0B1E3D] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Locais
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.locations.map((location: any) => (
                <Card key={location.id} className="p-6 bg-white hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-[#0B1E3D] mb-2">{location.name}</h3>
                  {location.type && (
                    <p className="text-sm text-[#FFD479] mb-2 font-medium">{location.type}</p>
                  )}
                  {location.description && (
                    <p className="text-sm text-[#0B1E3D]/70 line-clamp-3">{location.description}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Events */}
        {data.events && data.events.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-[#0B1E3D] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Linha do Tempo
            </h2>
            <div className="space-y-4">
              {data.events.map((event: any) => (
                <Card key={event.id} className="p-6 bg-white hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-[#0B1E3D] mb-2">{event.name}</h3>
                  {event.description && (
                    <p className="text-sm text-[#0B1E3D]/70">{event.description}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Objects */}
        {data.objects && data.objects.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-[#0B1E3D] mb-6" style={{ fontFamily: 'Playfair Display, serif' }}>
              Objetos Importantes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.objects.map((object: any) => (
                <Card key={object.id} className="p-6 bg-white hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-bold text-[#0B1E3D] mb-2">{object.name}</h3>
                  {object.significance && (
                    <p className="text-sm text-[#FFD479] mb-2 font-medium">{object.significance}</p>
                  )}
                  {object.description && (
                    <p className="text-sm text-[#0B1E3D]/70 line-clamp-3">{object.description}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}