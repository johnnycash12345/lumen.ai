import { useState } from 'react';
import { ChevronRight, Send, User, MapPin, Calendar, Book, ArrowLeft, Sparkles } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { NarrativeMessage } from './NarrativeMessage';
import { RelationshipMap } from './RelationshipMap';
import { MobileUniverseTabs } from './MobileUniverseTabs';
import { motion } from '@/lib/motion';
import { ScrollArea } from './ui/scroll-area';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface UniversePageProps {
  universeId: string;
  onBack: () => void;
}

const universeData: Record<string, any> = {
  'sherlock': {
    name: 'Sherlock Holmes',
    categories: [
      {
        id: 'characters',
        name: 'Personagens',
        icon: User,
        items: ['Sherlock Holmes', 'Dr. John Watson', 'Mrs. Hudson', 'Inspector Lestrade', 'Professor Moriarty']
      },
      {
        id: 'locations',
        name: 'Locais',
        icon: MapPin,
        items: ['221B Baker Street', 'Scotland Yard', 'The Reichenbach Falls', 'Diogenes Club']
      },
      {
        id: 'cases',
        name: 'Casos',
        icon: Book,
        items: ['A Study in Scarlet', 'The Hound of the Baskervilles', 'The Final Problem']
      }
    ]
  }
};

export function UniversePage({ universeId, onBack }: UniversePageProps) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant' as const,
      content: 'Bem-vindo ao universo de Sherlock Holmes. Explore personagens, locais e casos, ou faça perguntas sobre o universo.',
      sources: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [highlightedCharacters, setHighlightedCharacters] = useState<string[]>([]);
  const [highlightedCatalogItems, setHighlightedCatalogItems] = useState<string[]>([]);
  const [mobileTab, setMobileTab] = useState<'catalog' | 'chat' | 'references'>('chat');

  const universe = universeData[universeId];

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { role: 'user' as const, content: inputValue };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant' as const,
          content: 'Dr. John H. Watson é o leal amigo e biógrafo de Sherlock Holmes. Um ex-cirurgião do exército, Watson conheceu Holmes após retornar da guerra no Afeganistão. Ele se tornou não apenas companheiro de apartamento de Holmes na Baker Street, mas também seu parceiro em inúmeras investigações.',
          sources: [
            { title: 'A Study in Scarlet', reference: 'Cap. 1' },
            { title: 'The Sign of Four', reference: 'Cap. 2' }
          ]
        }
      ]);
      
      // Highlight mentioned characters and items
      setHighlightedCharacters(['watson', 'holmes']);
      setHighlightedCatalogItems(['Dr. John Watson', '221B Baker Street']);
      
      setIsLoading(false);
    }, 2000);
  };

  const handleCharacterClick = (characterId: string) => {
    setInputValue(`Conte-me mais sobre ${characterId}`);
  };

  const characters = [
    { id: 'holmes', name: 'Sherlock', x: 200, y: 150 },
    { id: 'watson', name: 'Watson', x: 120, y: 100 },
    { id: 'moriarty', name: 'Moriarty', x: 280, y: 100 },
    { id: 'lestrade', name: 'Lestrade', x: 120, y: 200 },
    { id: 'hudson', name: 'Mrs. Hudson', x: 280, y: 200 }
  ];

  const relationships = [
    { from: 'holmes', to: 'watson' },
    { from: 'holmes', to: 'moriarty' },
    { from: 'holmes', to: 'lestrade' },
    { from: 'holmes', to: 'hudson' }
  ];

  return (
    <div className="min-h-screen pt-14 sm:pt-16 lg:pt-20 pb-4 sm:pb-8">
      {/* Mobile Tabs - Only visible on mobile */}
      <div className="lg:hidden">
        <MobileUniverseTabs activeTab={mobileTab} onTabChange={setMobileTab} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6 flex items-center gap-2 sm:gap-4 pt-3 lg:pt-0">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="text-[#0B1E3D] hover:text-[#FFD479] p-2 sm:px-4"
          >
            <ArrowLeft className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Voltar</span>
          </Button>
          <h2 className="text-[#0B1E3D] text-xl sm:text-2xl lg:text-3xl">{universe.name}</h2>
        </div>

        {/* Three Column Layout - Desktop */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel - Catalog */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="col-span-3 bg-white rounded-lg border border-[#0B1E3D]/10 p-4"
          >
            <h4 className="mb-4 text-[#0B1E3D]">Catálogo</h4>
            <ScrollArea className="h-[calc(100%-3rem)]">
              <div className="space-y-4">
                {universe.categories.map((category: any) => (
                  <div key={category.id}>
                    <button
                      onClick={() => setActiveCategory(
                        activeCategory === category.id ? null : category.id
                      )}
                      className="flex items-center gap-2 w-full text-left mb-2 group"
                    >
                      <category.icon className="w-4 h-4 text-[#FFD479]" />
                      <span className="text-sm text-[#0B1E3D] group-hover:text-[#FFD479] transition-colors duration-200">
                        {category.name}
                      </span>
                      <ChevronRight 
                        className={`w-3 h-3 ml-auto text-[#0B1E3D]/50 transition-transform duration-200 ${
                          activeCategory === category.id ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    
                    {activeCategory === category.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-6 space-y-1"
                      >
                        {category.items.map((item: string, idx: number) => {
                          const isHighlighted = highlightedCatalogItems.includes(item);
                          return (
                            <button
                              key={idx}
                              className={`block text-xs transition-all duration-200 py-1 flex items-center gap-2 ${
                                isHighlighted 
                                  ? 'text-[#FFD479] font-medium' 
                                  : 'text-[#0B1E3D]/70 hover:text-[#FFD479]'
                              }`}
                            >
                              {isHighlighted && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="inline-block"
                                >
                                  <Sparkles className="w-3 h-3 text-[#FFD479]" />
                                </motion.span>
                              )}
                              • {item}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </motion.div>

          {/* Center Panel - Chat */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-6 bg-white/50 rounded-lg border border-[#0B1E3D]/10 p-6 flex flex-col"
          >
            <ScrollArea className="flex-1 pr-4 mb-4">
              <div className="space-y-4">
                {messages.map((message, idx) => (
                  <ChatMessage
                    key={idx}
                    role={message.role}
                    content={message.content}
                    sources={message.sources}
                  />
                ))}
                
                {/* Example Narrative Message - Shows after first question */}
                {messages.length > 2 && (
                  <NarrativeMessage
                    character="Watson"
                    content="Holmes sempre teve um método peculiar de dedução. Ele observava os menores detalhes - uma mancha de lama, o desgaste de um sapato, a marca de tinta nos dedos - e deles extraía conclusões surpreendentes que pareciam mágica para os não iniciados."
                    fidelityScore={97}
                  />
                )}

                {/* Loading State */}
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FFD479]/20 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-[#FFD479]" />
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-[#0B1E3D]/10">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((i) => (
                          <motion.div
                            key={i}
                            className="w-2 h-2 bg-[#FFD479] rounded-full"
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              delay: i * 0.2
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Faça uma pergunta sobre o universo..."
                disabled={isLoading}
                className="flex-1 border-[#0B1E3D]/20 focus-visible:ring-[#FFD479] disabled:opacity-50"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-[#0B1E3D] hover:bg-[#FFD479] hover:text-[#0B1E3D] transition-all duration-300 disabled:opacity-50"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
          </motion.div>

          {/* Right Panel - References */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="col-span-3 space-y-4"
          >
            <RelationshipMap
              characters={characters}
              relationships={relationships}
              centerCharacter="holmes"
              highlightedCharacters={highlightedCharacters}
              onCharacterClick={handleCharacterClick}
            />

            <div className="bg-white rounded-lg p-4 border border-[#0B1E3D]/10">
              <h4 className="mb-3 text-[#0B1E3D] text-sm">Validação IA</h4>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '95%' }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="bg-[#FFD479] h-full rounded-full"
                  />
                </div>
                <span className="text-xs text-[#0B1E3D]">95%</span>
              </div>
              <p className="text-xs text-[#0B1E3D]/60 mt-2">
                Fidelidade canônica verificada
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-[#0B1E3D]/10">
              <h4 className="mb-3 text-[#0B1E3D] text-sm">Fontes Originais</h4>
              <div className="space-y-2 text-xs text-[#0B1E3D]/70">
                <div className="flex items-start gap-2">
                  <Book className="w-3 h-3 mt-0.5 text-[#FFD479] flex-shrink-0" />
                  <div>
                    <div>A Study in Scarlet</div>
                    <div className="text-[#0B1E3D]/50">Arthur Conan Doyle, 1887</div>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Book className="w-3 h-3 mt-0.5 text-[#FFD479] flex-shrink-0" />
                  <div>
                    <div>The Hound of the Baskervilles</div>
                    <div className="text-[#0B1E3D]/50">Arthur Conan Doyle, 1902</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Mobile Layout - Stacked with tabs */}
        <div className="lg:hidden">
          {/* Catalog Panel */}
          {mobileTab === 'catalog' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg border border-[#0B1E3D]/10 p-4"
            >
              <h4 className="mb-4 text-[#0B1E3D]">Catálogo</h4>
              <div className="space-y-4">
                {universe.categories.map((category: any) => (
                  <div key={category.id}>
                    <button
                      onClick={() => setActiveCategory(
                        activeCategory === category.id ? null : category.id
                      )}
                      className="flex items-center gap-2 w-full text-left mb-2 group"
                    >
                      <category.icon className="w-4 h-4 text-[#FFD479]" />
                      <span className="text-sm text-[#0B1E3D] group-hover:text-[#FFD479] transition-colors duration-200">
                        {category.name}
                      </span>
                      <ChevronRight 
                        className={`w-3 h-3 ml-auto text-[#0B1E3D]/50 transition-transform duration-200 ${
                          activeCategory === category.id ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    
                    {activeCategory === category.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="ml-6 space-y-1"
                      >
                        {category.items.map((item: string, idx: number) => {
                          const isHighlighted = highlightedCatalogItems.includes(item);
                          return (
                            <button
                              key={idx}
                              className={`block text-xs transition-all duration-200 py-1 flex items-center gap-2 ${
                                isHighlighted 
                                  ? 'text-[#FFD479] font-medium' 
                                  : 'text-[#0B1E3D]/70 hover:text-[#FFD479]'
                              }`}
                            >
                              {isHighlighted && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="inline-block"
                                >
                                  <Sparkles className="w-3 h-3 text-[#FFD479]" />
                                </motion.span>
                              )}
                              • {item}
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Chat Panel */}
          {mobileTab === 'chat' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/50 rounded-lg border border-[#0B1E3D]/10 p-4 flex flex-col"
              style={{ height: 'calc(100vh - 200px)' }}
            >
              <ScrollArea className="flex-1 pr-2 mb-4">
                <div className="space-y-3">
                  {messages.map((message, idx) => (
                    <ChatMessage
                      key={idx}
                      role={message.role}
                      content={message.content}
                      sources={message.sources}
                    />
                  ))}
                  
                  {messages.length > 2 && (
                    <NarrativeMessage
                      character="Watson"
                      content="Holmes sempre teve um método peculiar de dedução. Ele observava os menores detalhes - uma mancha de lama, o desgaste de um sapato, a marca de tinta nos dedos - e deles extraía conclusões surpreendentes que pareciam mágica para os não iniciados."
                      fidelityScore={97}
                    />
                  )}

                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-2"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#FFD479]/20 flex items-center justify-center">
                        <Sparkles className="w-3 h-3 text-[#FFD479]" />
                      </div>
                      <div className="bg-white rounded-lg p-3 border border-[#0B1E3D]/10">
                        <div className="flex gap-1">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              className="w-1.5 h-1.5 bg-[#FFD479] rounded-full"
                              animate={{
                                scale: [1, 1.3, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{
                                duration: 1,
                                repeat: Infinity,
                                delay: i * 0.2
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </ScrollArea>

              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Faça uma pergunta..."
                  disabled={isLoading}
                  className="flex-1 border-[#0B1E3D]/20 focus-visible:ring-[#FFD479] disabled:opacity-50 text-sm"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading}
                  className="bg-[#0B1E3D] hover:bg-[#FFD479] hover:text-[#0B1E3D] transition-all duration-300 disabled:opacity-50"
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="w-4 h-4" />
                    </motion.div>
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </motion.div>
          )}

          {/* References Panel */}
          {mobileTab === 'references' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <RelationshipMap
                characters={characters}
                relationships={relationships}
                centerCharacter="holmes"
                highlightedCharacters={highlightedCharacters}
                onCharacterClick={handleCharacterClick}
              />

              <div className="bg-white rounded-lg p-4 border border-[#0B1E3D]/10">
                <h4 className="mb-3 text-[#0B1E3D] text-sm">Validação IA</h4>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-gray-100 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: '95%' }}
                      transition={{ duration: 1, delay: 0.3 }}
                      className="bg-[#FFD479] h-full rounded-full"
                    />
                  </div>
                  <span className="text-xs text-[#0B1E3D]">95%</span>
                </div>
                <p className="text-xs text-[#0B1E3D]/60 mt-2">
                  Fidelidade canônica verificada
                </p>
              </div>

              <div className="bg-white rounded-lg p-4 border border-[#0B1E3D]/10">
                <h4 className="mb-3 text-[#0B1E3D] text-sm">Fontes Originais</h4>
                <div className="space-y-2 text-xs text-[#0B1E3D]/70">
                  <div className="flex items-start gap-2">
                    <Book className="w-3 h-3 mt-0.5 text-[#FFD479] flex-shrink-0" />
                    <div>
                      <div>A Study in Scarlet</div>
                      <div className="text-[#0B1E3D]/50">Arthur Conan Doyle, 1887</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Book className="w-3 h-3 mt-0.5 text-[#FFD479] flex-shrink-0" />
                    <div>
                      <div>The Hound of the Baskervilles</div>
                      <div className="text-[#0B1E3D]/50">Arthur Conan Doyle, 1902</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
