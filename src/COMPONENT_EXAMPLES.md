# 🎨 Exemplos Práticos de Componentes - Lumen

## 📱 Exemplos Completos de Uso

### 1. Página de Personagem Completa

```tsx
import { CharacterDetailPage } from './components/CharacterDetailPage';
import { useState } from 'react';

function MyApp() {
  const [isPerspectiveActive, setIsPerspectiveActive] = useState(false);

  return (
    <CharacterDetailPage
      characterId="watson"
      onBack={() => navigate('/universe/sherlock')}
      onActivatePerspective={() => {
        setIsPerspectiveActive(true);
        // Redirecionar para chat
        navigate('/universe/sherlock?tab=chat&mode=watson');
      }}
      isPerspectiveActive={isPerspectiveActive}
    />
  );
}
```

**Resultado:**
- Header com avatar e nome
- Botão comparar
- Abas: Análise / Citações / Timeline
- Sidebar com locais e eventos relacionados
- Tags de temas clicáveis

---

### 2. Chat com Typing Effect e Votação

```tsx
import { ChatMessage } from './components/ChatMessage';
import { useState } from 'react';

function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Como posso ajudar?',
      sources: []
    }
  ]);

  const handleSendMessage = (text: string) => {
    // Adicionar mensagem do usuário
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      role: 'user',
      content: text
    }]);

    // Simular resposta da IA
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Esta é uma resposta detalhada...',
        sources: [
          { title: 'A Study in Scarlet', reference: 'Cap. 1' }
        ]
      }]);
    }, 1000);
  };

  return (
    <div className="space-y-4">
      {messages.map((msg, idx) => (
        <ChatMessage
          key={msg.id}
          role={msg.role}
          content={msg.content}
          sources={msg.sources}
          // Só a última mensagem do assistente usa typing effect
          useTypingEffect={
            idx === messages.length - 1 && 
            msg.role === 'assistant'
          }
          // Mostrar votação em todas as mensagens do assistente
          showVoting={msg.role === 'assistant'}
          messageId={msg.id}
        />
      ))}
    </div>
  );
}
```

**Recursos:**
- Typing effect apenas na última mensagem
- Fontes canônicas clicáveis
- Sistema de votação like/dislike
- Avatar diferenciado por role

---

### 3. Sistema Completo de Notas

```tsx
import { ResearchNotes } from './components/ResearchNotes';
import { useState } from 'react';

function NotesManager() {
  const [notes, setNotes] = useState([]);

  const handleSaveNote = (noteData) => {
    const newNote = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setNotes([newNote, ...notes]);
    
    // Opcional: Salvar no localStorage
    localStorage.setItem('lumen-notes', JSON.stringify([newNote, ...notes]));
  };

  const handleDeleteNote = (noteId) => {
    const updated = notes.filter(n => n.id !== noteId);
    setNotes(updated);
    localStorage.setItem('lumen-notes', JSON.stringify(updated));
  };

  const handleExportNotes = () => {
    const markdown = notes
      .map(note => 
        `# ${note.title}\n\n` +
        `${note.content}\n\n` +
        `**Tags:** ${note.tags.map(t => `#${t}`).join(', ')}\n\n` +
        `**Data:** ${new Date(note.createdAt).toLocaleDateString()}\n\n` +
        `---\n\n`
      )
      .join('');
    
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumen-notes-${Date.now()}.md`;
    a.click();
  };

  // Carregar notas do localStorage ao montar
  useEffect(() => {
    const saved = localStorage.getItem('lumen-notes');
    if (saved) {
      setNotes(JSON.parse(saved));
    }
  }, []);

  return (
    <ResearchNotes
      notes={notes}
      onSaveNote={handleSaveNote}
      onDeleteNote={handleDeleteNote}
      onExportNotes={handleExportNotes}
    />
  );
}
```

**Funcionalidades:**
- Criar notas com título, conteúdo e tags
- Editar notas existentes
- Deletar com animação
- Exportar em Markdown
- Persistência com localStorage

---

### 4. Timeline com Filtros Dinâmicos

```tsx
import { Timeline } from './components/Timeline';
import { useState } from 'react';

function TimelineWithFilters() {
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const events = [
    {
      id: '1',
      year: '1881',
      title: 'Encontro de Holmes e Watson',
      description: '...',
      category: 'Início',
      relatedCharacters: ['Sherlock Holmes', 'Dr. John Watson']
    },
    // ... mais eventos
  ];

  const categories = ['Todos', 'Início', 'Conflitos', 'Mistérios'];
  const characters = ['Sherlock Holmes', 'Dr. John Watson', 'Professor Moriarty'];

  return (
    <div className="space-y-4">
      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <div className="text-sm text-[#0B1E3D]/70 w-full mb-2">
          Filtrar por:
        </div>
        
        {/* Filtro por categoria */}
        <div className="flex gap-2">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === 'Todos' ? null : cat)}
              className={`px-3 py-1 rounded-full text-xs transition-all ${
                (cat === 'Todos' && !selectedCategory) || selectedCategory === cat
                  ? 'bg-[#FFD479] text-white'
                  : 'bg-white text-[#0B1E3D] border border-[#0B1E3D]/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filtro por personagem */}
        <div className="w-full mt-2">
          <select
            value={filter || ''}
            onChange={(e) => setFilter(e.target.value || null)}
            className="px-3 py-2 rounded-lg border border-[#0B1E3D]/20 text-sm"
          >
            <option value="">Todos os personagens</option>
            {characters.map(char => (
              <option key={char} value={char}>{char}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline */}
      <Timeline
        events={events}
        filterBy={filter}
        onEventClick={(event) => {
          console.log('Evento clicado:', event);
          // Abrir modal ou navegar
        }}
      />
    </div>
  );
}
```

**Recursos:**
- Filtros por categoria e personagem
- Estados visuais dos filtros ativos
- Contagem de eventos filtrados
- Reset de filtros

---

### 5. Carrossel de Notícias com Modal

```tsx
import { NewsCarousel } from './components/NewsCarousel';
import { useState } from 'react';

function NewsSection() {
  const [chatInput, setChatInput] = useState('');

  const articles = [
    {
      id: '1',
      title: 'Detetive Resolve Mistério',
      source: 'The Times',
      date: '27 de Dezembro, 1889',
      excerpt: 'Holmes resolve caso complexo...',
      content: 'Artigo completo...',
      tags: ['Crime', 'Dedução'],
      image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800'
    }
  ];

  const handleAskLumen = (article) => {
    const question = `Analise o seguinte evento: ${article.title}. ${article.excerpt}`;
    setChatInput(question);
    
    // Navegar para o chat ou abrir chat modal
    // navigate('/chat');
    // ou setIsChatOpen(true);
  };

  return (
    <div>
      <NewsCarousel
        articles={articles}
        universe="Sherlock Holmes"
        onAskLumen={handleAskLumen}
      />

      {/* Chat Input (se não navegar) */}
      {chatInput && (
        <div className="mt-4 p-4 bg-[#FFD479]/10 rounded-lg">
          <p className="text-sm text-[#0B1E3D]/70 mb-2">
            Pronto para perguntar ao Lumen:
          </p>
          <p className="text-sm text-[#0B1E3D]">{chatInput}</p>
        </div>
      )}
    </div>
  );
}
```

---

### 6. Análise Completa de Personagem

```tsx
import { ConflictMatrix } from './components/ConflictMatrix';
import { MotivationAnalysis } from './components/MotivationAnalysis';
import { QuotesCarousel } from './components/QuotesCarousel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';

function CharacterAnalysis({ characterId }) {
  const data = getCharacterData(characterId); // Sua função de busca

  return (
    <Tabs defaultValue="motivation" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="motivation">Motivação</TabsTrigger>
        <TabsTrigger value="conflicts">Conflitos</TabsTrigger>
        <TabsTrigger value="quotes">Citações</TabsTrigger>
      </TabsList>

      <TabsContent value="motivation" className="space-y-4">
        <MotivationAnalysis
          motivations={data.motivations}
          characterName={data.name}
          summary={data.motivationSummary}
        />
      </TabsContent>

      <TabsContent value="conflicts" className="space-y-4">
        <ConflictMatrix
          conflicts={data.conflicts}
          characterName={data.name}
        />
      </TabsContent>

      <TabsContent value="quotes" className="space-y-4">
        <QuotesCarousel
          quotes={data.quotes}
          characterName={data.name}
        />
      </TabsContent>
    </Tabs>
  );
}
```

---

### 7. Widget de Curiosidades Auto-Rotativo

```tsx
import { CuriosityWidget } from './components/CuriosityWidget';
import { useEffect, useState } from 'react';

function CuriositySection() {
  const [viewedCuriosities, setViewedCuriosities] = useState<string[]>([]);

  const curiosities = [
    {
      id: '1',
      text: 'Sherlock Holmes nunca disse "Elementar, meu caro Watson"...',
      category: 'Fatos Literários'
    },
    // ... mais curiosidades
  ];

  const handleCuriosityClick = (curiosity) => {
    // Marcar como vista
    setViewedCuriosities(prev => [...prev, curiosity.id]);
    
    // Abrir chat com contexto
    openChatWithContext(curiosity.text);
    
    // Salvar estatística
    trackCuriosityView(curiosity.id);
  };

  // Carregar curiosidades vistas
  useEffect(() => {
    const viewed = localStorage.getItem('viewed-curiosities');
    if (viewed) {
      setViewedCuriosities(JSON.parse(viewed));
    }
  }, []);

  // Salvar quando mudar
  useEffect(() => {
    localStorage.setItem('viewed-curiosities', JSON.stringify(viewedCuriosities));
  }, [viewedCuriosities]);

  return (
    <div className="space-y-2">
      <CuriosityWidget
        curiosities={curiosities}
        onCuriosityClick={handleCuriosityClick}
      />
      
      {/* Contador */}
      <div className="text-xs text-center text-[#0B1E3D]/50">
        {viewedCuriosities.length} de {curiosities.length} curiosidades exploradas
      </div>
    </div>
  );
}
```

---

### 8. Comparador com Preview

```tsx
import { ElementComparator } from './components/ElementComparator';
import { useState } from 'react';

function ComparatorWithPreview() {
  const [comparisonResult, setComparisonResult] = useState(null);

  const element = {
    id: 'watson',
    name: 'Dr. John Watson',
    type: 'character',
    attributes: { ... },
    description: '...'
  };

  const availableElements = [
    { id: 'lestrade', name: 'Inspetor Lestrade', ... },
    { id: 'hudson', name: 'Mrs. Hudson', ... }
  ];

  const handleCompare = (el1, el2) => {
    // Gerar análise comparativa
    const result = {
      similarities: [
        'Ambos são leais a Holmes',
        'Participaram de múltiplos casos'
      ],
      differences: [
        'Watson é médico, Lestrade é policial',
        'Watson mora com Holmes, Lestrade não'
      ],
      conclusion: 'Enquanto Watson é o companheiro constante...'
    };
    
    setComparisonResult(result);
  };

  return (
    <div className="space-y-4">
      <ElementComparator
        element={element}
        availableElements={availableElements}
        onCompare={handleCompare}
      />

      {/* Preview do resultado */}
      {comparisonResult && (
        <div className="bg-gradient-to-br from-[#F8F4ED] to-white p-6 rounded-xl border border-[#FFD479]/30">
          <h3 className="text-sm text-[#0B1E3D] mb-4">
            Análise Comparativa
          </h3>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs text-[#FFD479] mb-2">Semelhanças</h4>
              <ul className="text-xs text-[#0B1E3D]/70 space-y-1">
                {comparisonResult.similarities.map((s, i) => (
                  <li key={i}>• {s}</li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs text-[#FFD479] mb-2">Diferenças</h4>
              <ul className="text-xs text-[#0B1E3D]/70 space-y-1">
                {comparisonResult.differences.map((d, i) => (
                  <li key={i}>• {d}</li>
                ))}
              </ul>
            </div>

            <div className="pt-3 border-t border-[#0B1E3D]/10">
              <p className="text-xs text-[#0B1E3D]/80 italic">
                {comparisonResult.conclusion}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### 9. Progresso com Gamificação

```tsx
import { UserProgress } from './components/UserProgress';
import { Award, Star, Zap } from 'lucide-react';
import { motion } from 'motion/react';

function ProgressWithAchievements() {
  const progressData = {
    universe: 'Sherlock Holmes',
    overallProgress: 65,
    storiesRead: { current: 3, total: 4 },
    charactersExplored: { current: 12, total: 15 },
    locationsVisited: { current: 8, total: 10 },
    conversationsHad: 47
  };

  const nextMilestone = {
    title: 'Explorador Dedicado',
    requirement: 'Alcance 75% de progresso',
    reward: 'Badge especial + Modo noturno',
    icon: Award,
    progress: 65,
    target: 75
  };

  return (
    <div className="space-y-4">
      <UserProgress progressData={progressData} />

      {/* Próximo Marco */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-[#FFD479]/20 to-[#FFD479]/10 rounded-xl border-2 border-[#FFD479] p-4"
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[#FFD479]/30 flex items-center justify-center">
            <nextMilestone.icon className="w-5 h-5 text-[#FFD479]" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm text-[#0B1E3D] mb-1">
              Próximo Marco: {nextMilestone.title}
            </h3>
            <p className="text-xs text-[#0B1E3D]/60 mb-2">
              {nextMilestone.requirement}
            </p>
            
            {/* Barra de progresso */}
            <div className="h-2 bg-white rounded-full overflow-hidden mb-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(nextMilestone.progress / nextMilestone.target) * 100}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-[#FFD479]"
              />
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-[#0B1E3D]/60">
                {nextMilestone.progress}% / {nextMilestone.target}%
              </span>
              <span className="text-[#FFD479]">
                🎁 {nextMilestone.reward}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
```

---

## 🎯 Dicas de Implementação

### Performance
- Use `useMemo` para dados pesados
- `useCallback` para funções em props
- `React.lazy` para componentes grandes
- Virtualize listas longas com `react-window`

### Acessibilidade
- Sempre adicione `aria-label` em botões sem texto
- Use `role` apropriado para elementos customizados
- Garanta navegação por teclado (Tab, Enter, Esc)
- Teste com leitores de tela

### Estado Global
- Use Context API para tema e preferências
- LocalStorage para persistência
- React Query para cache de dados da API

---

**Pronto para criar experiências incríveis! 🚀**
