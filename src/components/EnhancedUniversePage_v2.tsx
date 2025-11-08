import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { NewsCarousel } from './NewsCarousel';
import { CuriosityWidget } from './CuriosityWidget';
import { RelationshipMap } from './RelationshipMap';
import { UserProgress } from './UserProgress';
import { ResearchNotes } from './ResearchNotes';
import { CharacterDetailCard } from './CharacterDetailCard';
import { ElementDetailCard } from './ElementDetailCard';
import { CatalogQuickFilter } from './CatalogQuickFilter';
import { MobileUniverseTabs } from './MobileUniverseTabs';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { LoadingDots } from './LoadingDots';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  newsArticles, 
  curiosities, 
  catalogElements,
  userProgressData,
  sampleResearchNotes
} from '../data/mockUniverseData';

interface EnhancedUniversePageProps {
  universeId: string;
  onBack: () => void;
}

const universeCategories = [
  {
    id: 'characters',
    name: 'Personagens',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="7" r="4" strokeWidth="2" />
      </svg>
    ),
    items: ['Sherlock Holmes', 'Dr. John Watson', 'Mrs. Hudson', 'Inspetor Lestrade', 'Professor Moriarty']
  },
  {
    id: 'locations',
    name: 'Locais',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeWidth="2" strokeLinecap="round" />
        <circle cx="12" cy="10" r="3" strokeWidth="2" />
      </svg>
    ),
    items: ['221B Baker Street', 'Scotland Yard', 'Reichenbach Falls', 'Diogenes Club']
  },
  {
    id: 'cases',
    name: 'Casos',
    icon: ({ className }: { className?: string }) => (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" strokeWidth="2" strokeLinecap="round" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    items: ['A Study in Scarlet', 'The Hound of the Baskervilles', 'The Final Problem']
  }
];

type CenterView = 'chat' | 'character' | 'location' | 'case';

export function EnhancedUniversePage({ universeId, onBack }: EnhancedUniversePageProps) {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant' as const,
      content: 'Bem-vindo ao universo de Sherlock Holmes. Explore personagens, locais e casos através do catálogo à esquerda, ou faça perguntas sobre o universo.',
      sources: []
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>('characters');
  const [highlightedItems, setHighlightedItems] = useState<string[]>([]);
  const [mobileTab, setMobileTab] = useState<'catalog' | 'chat' | 'references'>('chat');
  const [researchNotes, setResearchNotes] = useState(sampleResearchNotes);
  const [centerView, setCenterView] = useState<CenterView>('chat');
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [catalogFilter, setCatalogFilter] = useState('');

  const characters = [
    { id: 'holmes', name: 'Holmes', x: 200, y: 150 },
    { id: 'watson', name: 'Watson', x: 120, y: 100 },
    { id: 'moriarty', name: 'Moriarty', x: 280, y: 100 },
    { id: 'lestrade', name: 'Lestrade', x: 120, y: 200 },
    { id: 'hudson', name: 'Mrs. Hudson', x: 280, y: 200 }
  ];

  const relationships = [
    { from: 'holmes', to: 'watson', type: 'friendship' as const, strength: 0.95 },
    { from: 'holmes', to: 'moriarty', type: 'rivalry' as const, strength: 1.0 },
    { from: 'watson', to: 'lestrade', type: 'professional' as const, strength: 0.6 },
    { from: 'holmes', to: 'hudson', type: 'professional' as const, strength: 0.7 }
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: 'user' as const, content: inputValue };
    setMessages([...messages, userMessage]);
    setInputValue('');
    setIsLoading(true);

    setTimeout(() => {
      const newMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: 'Dr. John H. Watson é o leal amigo e biógrafo de Sherlock Holmes. Um ex-cirurgião do exército, Watson conheceu Holmes após retornar da guerra no Afeganistão.',
        sources: [
          { title: 'A Study in Scarlet', reference: 'Cap. 1' },
          { title: 'The Sign of Four', reference: 'Cap. 2' }
        ]
      };
      
      setMessages(prev => [...prev, newMessage]);
      setHighlightedItems(['Dr. John Watson', '221B Baker Street']);
      setIsLoading(false);
    }, 2000);
  };

  const handleCatalogItemClick = (item: string, categoryId: string) => {
    const itemId = item.toLowerCase().replace(/\s+/g, '-').replace(/\./g, '');
    
    if (categoryId === 'characters') {
      const character = catalogElements.find(el => el.id === itemId && el.type === 'character');
      setSelectedElement(character || { 
        id: itemId, 
        name: item, 
        type: 'character', 
        description: 'Personagem do universo Sherlock Holmes.' 
      });
      setCenterView('character');
    } else if (categoryId === 'locations') {
      setSelectedElement({ 
        id: itemId, 
        name: item, 
        type: 'location', 
        description: 'Local importante no universo Sherlock Holmes. Este lugar desempenha um papel crucial nas histórias e investigações.' 
      });
      setCenterView('location');
    } else if (categoryId === 'cases') {
      setSelectedElement({ 
        id: itemId, 
        name: item, 
        type: 'case', 
        description: 'Caso icônico investigado por Sherlock Holmes. Uma das mais memoráveis aventuras do detetive.' 
      });
      setCenterView('case');
    }
  };

  const handleBackToChat = () => {
    setCenterView('chat');
    setSelectedElement(null);
  };

  const handleSaveNote = (note: any) => {
    const newNote = {
      ...note,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setResearchNotes([newNote, ...researchNotes]);
  };

  const handleDeleteNote = (noteId: string) => {
    setResearchNotes(researchNotes.filter(note => note.id !== noteId));
  };

  const handleExportNotes = () => {
    const notesText = researchNotes
      .map(note => `# ${note.title}\n\n${note.content}\n\nTags: ${note.tags.join(', ')}\n\n---\n\n`)
      .join('');
    
    const blob = new Blob([notesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lumen-research-notes.txt';
    a.click();
  };

  // Filter catalog items
  const filteredCategories = universeCategories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      item.toLowerCase().includes(catalogFilter.toLowerCase())
    )
  }));

  return (
    <div className="min-h-screen bg-[#F8F4ED]">
      {/* Mobile Tabs */}
      <div className="lg:hidden fixed top-16 left-0 right-0 z-10 bg-[#F8F4ED]">
        <MobileUniverseTabs
          activeTab={mobileTab}
          onTabChange={setMobileTab}
        />
      </div>

      {/* Desktop Back Button */}
      <div className="hidden lg:block fixed top-20 left-4 z-10">
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-[#0B1E3D] hover:text-[#FFD479]"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar à Biblioteca
        </Button>
      </div>

      {/* Main Layout - Fixed Height */}
      <div className="pt-16 sm:pt-20 lg:pt-24 h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-full">
          {/* Desktop: 3-column layout with fixed heights */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6 h-[calc(100vh-7rem)]">
            {/* Left Sidebar - Catalog (Fixed, Scrollable) */}
            <div className="col-span-3 flex flex-col h-full overflow-hidden">
              <div className="mb-4">
                <UserProgress progressData={userProgressData} />
              </div>
              
              <div className="flex-1 bg-white rounded-xl border border-[#0B1E3D]/10 p-4 overflow-hidden flex flex-col">
                <h3 
                  className="text-[#0B1E3D] mb-3"
                  style={{
                    fontFamily: 'Playfair Display, serif',
                    fontSize: '1rem'
                  }}
                >
                  Catálogo
                </h3>
                
                {/* Quick Filter */}
                <CatalogQuickFilter
                  value={catalogFilter}
                  onChange={setCatalogFilter}
                />
                
                {/* Scrollable Catalog */}
                <ScrollArea className="flex-1">
                  <div className="space-y-4 pr-2">
                    {filteredCategories.map(category => (
                      <div key={category.id}>
                        <button
                          onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                          className="flex items-center gap-2 w-full text-left mb-2 hover:text-[#FFD479] transition-colors duration-200"
                        >
                          <category.icon className="w-4 h-4 text-[#FFD479]" />
                          <span className="text-xs text-[#0B1E3D]">{category.name}</span>
                        </button>
                        
                        {activeCategory === category.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="space-y-1 ml-6"
                          >
                            {category.items.map((item, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleCatalogItemClick(item, category.id)}
                                className={`block text-xs py-1 w-full text-left transition-colors duration-200 ${
                                  highlightedItems.includes(item)
                                    ? 'text-[#FFD479]'
                                    : 'text-[#0B1E3D]/70 hover:text-[#FFD479]'
                                }`}
                              >
                                • {item}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Center - Dynamic Content (Fixed Height, Scrollable) */}
            <div className="col-span-6 bg-white rounded-xl border border-[#0B1E3D]/10 overflow-hidden flex flex-col h-full">
              <AnimatePresence mode="wait">
                {centerView === 'chat' && (
                  <motion.div
                    key="chat"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col h-full"
                  >
                    <ScrollArea className="flex-1 p-6">
                      {messages.map((msg, idx) => (
                        <ChatMessage
                          key={msg.id}
                          role={msg.role}
                          content={msg.content}
                          sources={msg.sources}
                          useTypingEffect={idx === messages.length - 1 && msg.role === 'assistant' && !isLoading}
                          showVoting={msg.role === 'assistant'}
                          messageId={msg.id}
                        />
                      ))}
                      {isLoading && (
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-8 h-8 rounded-full bg-[#FFD479]/20 flex items-center justify-center flex-shrink-0">
                            <LoadingDots />
                          </div>
                          <div className="text-sm text-[#0B1E3D]/60">Lumen está pensando...</div>
                        </div>
                      )}
                    </ScrollArea>

                    <div className="p-4 border-t border-[#0B1E3D]/10">
                      <div className="flex gap-2">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                          placeholder="Faça uma pergunta ao Lumen..."
                          className="flex-1"
                        />
                        <Button onClick={handleSendMessage} disabled={isLoading}>
                          Enviar
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {centerView === 'character' && selectedElement && (
                  <motion.div
                    key="character"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full p-6"
                  >
                    <CharacterDetailCard
                      character={selectedElement}
                      onBack={handleBackToChat}
                      onCompare={() => console.log('Compare')}
                      onViewTimeline={() => console.log('Timeline')}
                      onConversasComo={() => console.log('Converse como')}
                    />
                  </motion.div>
                )}

                {(centerView === 'location' || centerView === 'case') && selectedElement && (
                  <motion.div
                    key={centerView}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="h-full p-6"
                  >
                    <ElementDetailCard
                      element={selectedElement}
                      onBack={handleBackToChat}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Sidebar - Fixed Height, Optimized */}
            <div className="col-span-3 flex flex-col gap-4 h-full overflow-y-auto pr-2">
              <NewsCarousel
                articles={newsArticles}
                universe="Sherlock Holmes"
                onAskLumen={(article) => {
                  setInputValue(`Conte-me mais sobre: ${article.title}`);
                  setCenterView('chat');
                }}
              />
              
              <CuriosityWidget
                curiosities={curiosities}
                onCuriosityClick={(curiosity) => {
                  setInputValue(curiosity.text);
                  setCenterView('chat');
                }}
              />

              <RelationshipMap
                characters={characters}
                relationships={relationships}
                highlightedCharacters={[]}
                onCharacterClick={(charId) => {
                  const char = characters.find(c => c.id === charId);
                  if (char) {
                    handleCatalogItemClick(char.name, 'characters');
                  }
                }}
              />

              <ResearchNotes
                notes={researchNotes}
                onSaveNote={handleSaveNote}
                onDeleteNote={handleDeleteNote}
                onExportNotes={handleExportNotes}
              />
            </div>
          </div>

          {/* Mobile: Tab-based content */}
          <div className="lg:hidden pt-12">
            {/* Mobile content here - simplified for now */}
            <div className="text-center text-[#0B1E3D]/60 py-8">
              Ver versão desktop para experiência completa
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
