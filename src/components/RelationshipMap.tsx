import { motion } from 'framer-motion';
import { User } from 'lucide-react';

interface Character {
  id: string;
  name: string;
  x: number;
  y: number;
}

interface Relationship {
  from: string;
  to: string;
}

interface RelationshipMapProps {
  characters: Character[];
  relationships: Relationship[];
  centerCharacter: string;
  highlightedCharacters?: string[];
  onCharacterClick?: (characterId: string) => void;
}

export function RelationshipMap({ 
  characters, 
  relationships, 
  centerCharacter,
  highlightedCharacters = [],
  onCharacterClick 
}: RelationshipMapProps) {
  return (
    <div className="bg-white rounded-lg p-6 border border-[#0B1E3D]/10 h-full">
      <h4 className="mb-4 text-[#0B1E3D]">Mapa de Relações</h4>
      
      <svg className="w-full h-64" viewBox="0 0 400 300">
        {/* Draw relationships */}
        {relationships.map((rel, idx) => {
          const from = characters.find(c => c.id === rel.from);
          const to = characters.find(c => c.id === rel.to);
          if (!from || !to) return null;
          
          const isHighlighted = highlightedCharacters.includes(rel.from) || highlightedCharacters.includes(rel.to);
          
          return (
            <motion.line
              key={idx}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke={isHighlighted ? '#FFD479' : '#FFD479'}
              strokeWidth={isHighlighted ? '2.5' : '1.5'}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: 1, 
                opacity: isHighlighted ? 0.9 : 0.6 
              }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className={isHighlighted ? 'drop-shadow-lg' : ''}
            />
          );
        })}
        
        {/* Draw characters */}
        {characters.map((char, idx) => {
          const isCenter = char.id === centerCharacter;
          const isHighlighted = highlightedCharacters.includes(char.id);
          
          return (
            <motion.g
              key={char.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
              onClick={() => onCharacterClick?.(char.id)}
              className="cursor-pointer"
            >
              {/* Glow effect for highlighted characters */}
              {isHighlighted && (
                <motion.circle
                  cx={char.x}
                  cy={char.y}
                  r={isCenter ? 35 : 25}
                  fill="none"
                  stroke="#FFD479"
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0.3, 0.7, 0.3],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              )}
              
              <circle
                cx={char.x}
                cy={char.y}
                r={isCenter ? 30 : 20}
                fill={isCenter || isHighlighted ? '#FFD479' : '#0B1E3D'}
                stroke={isCenter || isHighlighted ? '#0B1E3D' : '#FFD479'}
                strokeWidth={isHighlighted ? '2' : '1.5'}
                className="hover:opacity-80 transition-opacity"
              />
              <text
                x={char.x}
                y={char.y + (isCenter ? 45 : 35)}
                textAnchor="middle"
                className={`text-xs font-medium pointer-events-none ${
                  isHighlighted ? 'fill-[#FFD479]' : 'fill-[#0B1E3D]'
                }`}
              >
                {char.name}
              </text>
            </motion.g>
          );
        })}
      </svg>
      
      <div className="mt-4 text-xs text-[#0B1E3D]/60">
        <p>Explore as conexões entre personagens e eventos</p>
      </div>
    </div>
  );
}
