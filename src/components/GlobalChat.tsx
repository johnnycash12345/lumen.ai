import { useState } from 'react';
import { motion } from 'motion';
import { Hexagon, Send } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { TypingEffect } from './TypingEffect';

interface GlobalChatProps {
  onUniverseSelect: (universe: string) => void;
}

interface ChatMessage {
  role: 'assistant' | 'user';
  content: string;
  suggestions?: Array<{ label: string; universeId: string }>;
}

export function GlobalChat({ onUniverseSelect }: GlobalChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Olá. Eu sou LUMEN. Qual história, personagem ou mistério você gostaria de visitar hoje?',
      suggestions: [
        { label: 'Sherlock Holmes', universeId: 'sherlock' },
        { label: 'Harry Potter', universeId: 'harry-potter' },
        { label: 'O Senhor dos Anéis', universeId: 'lotr' },
        { label: 'Star Wars', universeId: 'star-wars' }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: inputValue
    };

    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response: ChatMessage = {
        role: 'assistant',
        content: 'Excelente escolha! O universo de Sherlock Holmes é repleto de mistérios fascinantes. Gostaria de explorar os casos, personagens ou locais de Londres vitoriana?',
        suggestions: [
          { label: 'Explorar Sherlock Holmes', universeId: 'sherlock' }
        ]
      };
      setMessages(prev => [...prev, response]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1.8 }}
      className="max-w-3xl mx-auto"
    >
      <div 
        className="bg-white border border-[#0B1E3D]/20 overflow-hidden"
        style={{
          borderRadius: '4px',
          boxShadow: '0 4px 20px rgba(11, 30, 61, 0.08)'
        }}
      >
        {/* Chat Header - Elegant Document Style */}
        <div className="bg-transparent px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-2 sm:gap-3 border-b border-[#0B1E3D]/20">
          <motion.div
            className="flex items-center justify-center flex-shrink-0"
            animate={{
              filter: [
                'drop-shadow(0 0 4px rgba(255, 212, 121, 0.4))',
                'drop-shadow(0 0 8px rgba(255, 212, 121, 0.6))',
                'drop-shadow(0 0 4px rgba(255, 212, 121, 0.4))',
              ]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Hexagon className="w-6 h-6 sm:w-7 sm:h-7 text-[#FFD479] fill-[#FFD479]/20" />
          </motion.div>
          <div className="min-w-0">
            <h3 
              className="text-[#0B1E3D] tracking-wider"
              style={{
                fontFamily: 'Playfair Display, serif',
                fontSize: '1rem'
              }}
            >
              LUMEN
            </h3>
          </div>
        </div>

        {/* Chat Messages - Document Style with Typewriter Effect */}
        <div className="p-4 sm:p-6 min-h-[200px] max-h-[300px] sm:max-h-[400px] overflow-y-auto space-y-3 sm:space-y-4 bg-[#F8F4ED]">
          {messages.map((message, idx) => (
            <div key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className={`flex gap-2 sm:gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.role === 'assistant' && (
                  <div className="flex items-start pt-1">
                    <span className="text-[#0B1E3D] text-xs sm:text-sm opacity-40">&gt;</span>
                  </div>
                )}
                
                <div className={`max-w-[85%] sm:max-w-[80%] ${message.role === 'user' ? 'order-first' : ''}`}>
                  <div className={`${message.role === 'user' ? 'bg-[#0B1E3D] text-white px-3 sm:px-4 py-2 sm:py-3 rounded-xl' : 'px-0 py-0'}`}>
                    <p 
                      className="text-xs sm:text-sm leading-relaxed"
                      style={{
                        fontFamily: message.role === 'assistant' ? 'Courier New, monospace' : 'Inter, sans-serif',
                        color: message.role === 'assistant' ? '#0B1E3D' : undefined
                      }}
                    >
                      {idx === 0 && message.role === 'assistant' ? (
                        <TypingEffect text={message.content} speed={30} />
                      ) : (
                        message.content
                      )}
                    </p>
                    
                    {/* Cursor pulsante apenas na última mensagem do assistente */}
                    {idx === messages.length - 1 && message.role === 'assistant' && (
                      <motion.span
                        className="inline-block w-2 h-4 bg-[#0B1E3D] ml-1"
                        animate={{
                          opacity: [1, 0, 1]
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    )}
                  </div>

                  {/* Suggestion Buttons */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-2"
                    >
                      {message.suggestions.map((suggestion, sIdx) => (
                        <Button
                          key={sIdx}
                          onClick={() => onUniverseSelect(suggestion.universeId)}
                          className="bg-white border-2 border-[#FFD479] text-[#0B1E3D] hover:bg-[#FFD479] hover:text-[#0B1E3D] transition-all duration-300 rounded-full text-[10px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 h-auto shadow-sm"
                        >
                          {suggestion.label}
                        </Button>
                      ))}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          ))}

          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3 items-start"
            >
              <span className="text-[#0B1E3D] text-xs sm:text-sm pt-1 opacity-40">&gt;</span>
              <div className="flex items-center gap-1">
                <span className="text-[#0B1E3D] text-xs sm:text-sm" style={{ fontFamily: 'Courier New, monospace' }}>
                  Pensando
                </span>
                {[0, 1, 2].map((i) => (
                  <motion.span
                    key={i}
                    className="text-[#0B1E3D] text-xs sm:text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: i * 0.3
                    }}
                  >
                    .
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area - Document Style */}
        <div className="border-t border-[#0B1E3D]/20 p-3 sm:p-4 bg-white">
          <div className="flex gap-2 items-center">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Digite sua pergunta..."
              className="flex-1 bg-[#F8F4ED] border border-[#0B1E3D] focus-visible:ring-[#FFD479] text-xs sm:text-sm"
              style={{
                fontFamily: 'Courier New, monospace',
                borderRadius: '4px'
              }}
            />
            <Button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-[#FFD479] hover:bg-[#0B1E3D] text-[#0B1E3D] hover:text-white transition-all duration-300 px-3 sm:px-4 flex-shrink-0"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
