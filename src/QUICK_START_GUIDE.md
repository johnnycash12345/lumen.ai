# 🚀 Guia Rápido - Lumen

## 📂 Estrutura do Projeto

```
/components
├── 📱 Páginas Principais
│   ├── HomePage.tsx              # Home com notícias e curiosidades
│   ├── EnhancedUniversePage.tsx  # Página do universo (3 colunas)
│   ├── CharacterDetailPage.tsx   # Detalhe de personagem
│   ├── JourneyPage.tsx           # Progresso do usuário
│   ├── AboutPage.tsx             # Sobre o projeto
│   ├── DocumentationPage.tsx     # Documentação técnica
│   └── ContactPage.tsx           # Contato
│
├── 🎯 Componentes de Análise
│   ├── ConflictMatrix.tsx        # Matriz de conflitos
│   ├── MotivationAnalysis.tsx    # Análise de motivações
│   ├── QuotesCarousel.tsx        # Citações famosas
│   ├── ElementComparator.tsx     # Comparador de elementos
│   └── Timeline.tsx              # Linha do tempo
│
├── 💬 Componentes de Interação
│   ├── ChatMessage.tsx           # Mensagem do chat (com typing)
│   ├── CharacterPerspectiveMode  # Modo roleplay
│   ├── GlobalChat.tsx            # Chat global
│   └── RelevanceVoting.tsx       # Sistema de votação
│
├── 📰 Componentes de Conteúdo
│   ├── NewsCarousel.tsx          # Carrossel de notícias
│   ├── CuriosityWidget.tsx       # Widget de curiosidades
│   ├── RelationshipMap.tsx       # Mapa de relações
│   ├── UserProgress.tsx          # Progresso do usuário
│   └── ResearchNotes.tsx         # Sistema de notas
│
├── 🎨 Componentes de UI
│   ├── Navigation.tsx            # Navegação principal
│   ├── UniverseCard.tsx          # Card de universo
│   ├── CatalogDrawer.tsx         # Drawer do catálogo
│   ├── MobileUniverseTabs.tsx    # Abas mobile
│   ├── TypingEffect.tsx          # Efeito de digitação
│   ├── LoadingDots.tsx           # Dots de carregamento
│   └── ui/                       # Componentes Shadcn
│
└── /data
    └── mockUniverseData.ts       # Todos os dados mockados
```

## 🎯 Como Usar os Componentes

### 1. Timeline Interativa

```tsx
import { Timeline } from './components/Timeline';
import { timelineEvents } from './data/mockUniverseData';

<Timeline
  events={timelineEvents}
  filterBy="Sherlock Holmes"  // Opcional: filtrar por personagem
  onEventClick={(event) => {
    console.log('Evento clicado:', event.title);
  }}
/>
```

**Recursos:**
- Desktop: Scroll horizontal com dots animados
- Mobile: Swipe entre cards
- Filtros automáticos por personagem

### 2. Carrossel de Notícias

```tsx
import { NewsCarousel } from './components/NewsCarousel';
import { newsArticles } from './data/mockUniverseData';

<NewsCarousel
  articles={newsArticles}
  universe="Sherlock Holmes"
  onAskLumen={(article) => {
    // Abrir chat com contexto do artigo
  }}
/>
```

**Recursos:**
- Modal com artigo completo
- Botão "Pergunte ao Lumen" integrado
- Tags de categorias clicáveis

### 3. Modo Perspectiva de Personagem

```tsx
import { CharacterPerspectiveMode } from './components/CharacterPerspectiveMode';

<CharacterPerspectiveMode
  characterName="Dr. John Watson"
  characterAvatar="/path/to/avatar.jpg"  // Opcional
  isActive={isPerspectiveActive}
  onActivate={() => setIsPerspectiveActive(true)}
  onDeactivate={() => setIsPerspectiveActive(false)}
/>
```

**Recursos:**
- Feedback visual com cor personalizada
- Animação de ativação/desativação
- Avatar do personagem (opcional)

### 4. Análise de Motivações

```tsx
import { MotivationAnalysis } from './components/MotivationAnalysis';

<MotivationAnalysis
  motivations={[
    { name: 'Lealdade', percentage: 40, color: '#FFD479' },
    { name: 'Aventura', percentage: 35, color: '#0B1E3D' },
    { name: 'Justiça', percentage: 25, color: '#d4a574' }
  ]}
  characterName="Dr. Watson"
  summary="Watson é movido principalmente por sua lealdade..."
/>
```

**Recursos:**
- Gráficos circulares animados
- Barras de progresso alternativas
- Resumo textual da IA

### 5. Matriz de Conflitos

```tsx
import { ConflictMatrix } from './components/ConflictMatrix';

<ConflictMatrix
  conflicts={[
    {
      name: 'vs. Professor Moriarty',
      intensity: 85,
      description: 'Apoio incondicional a Holmes...'
    }
  ]}
  characterName="Dr. Watson"
/>
```

**Recursos:**
- Barras de intensidade com gradientes
- Animações suaves ao carregar
- Cores baseadas na intensidade

### 6. Notas de Pesquisa

```tsx
import { ResearchNotes } from './components/ResearchNotes';

<ResearchNotes
  notes={researchNotes}
  onSaveNote={(note) => {
    // Salvar nova nota
  }}
  onDeleteNote={(noteId) => {
    // Deletar nota
  }}
  onExportNotes={() => {
    // Exportar todas as notas
  }}
/>
```

**Recursos:**
- Editor com título, conteúdo e tags
- Sistema de tags dinâmico
- Exportação em .txt

### 7. Progresso do Usuário

```tsx
import { UserProgress } from './components/UserProgress';
import { userProgressData } from './data/mockUniverseData';

<UserProgress progressData={userProgressData} />
```

**Recursos:**
- Barra de progresso geral
- Estatísticas detalhadas
- Contador de conversas

## 🎨 Customização de Cores

Para alterar as cores do tema, edite os valores em `data/mockUniverseData.ts`:

```typescript
// Cores principais
const primaryBlue = '#0B1E3D';
const accentGold = '#FFD479';
const backgroundCream = '#F8F4ED';

// Gradientes
const goldGradient = 'linear-gradient(90deg, #FFD479 0%, #d4a574 100%)';
```

## 📱 Breakpoints Responsivos

O projeto usa os seguintes breakpoints:

```css
sm: 640px   /* Tablets pequenos */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop pequeno */
xl: 1280px  /* Desktop grande */
```

**Exemplo de uso:**
```tsx
<div className="text-sm sm:text-base lg:text-lg">
  {/* Texto responsivo */}
</div>
```

## 🔄 Fluxo de Navegação

```
HomePage
  ↓ Clicar em Universo
EnhancedUniversePage (3 colunas)
  ↓ Clicar em Personagem
CharacterDetailPage
  ↓ Ativar Modo Perspectiva
Volta para Chat com modo ativo
```

## 💾 Estrutura de Dados

### Evento da Timeline
```typescript
{
  id: string;
  year: string;
  title: string;
  description: string;
  category: string;
  relatedCharacters?: string[];
}
```

### Artigo de Notícia
```typescript
{
  id: string;
  title: string;
  source: string;
  date: string;
  excerpt: string;
  content: string;
  tags: string[];
  image?: string;
}
```

### Elemento do Catálogo
```typescript
{
  id: string;
  name: string;
  type: 'character' | 'location' | 'object';
  description: string;
  attributes: Record<string, string>;
}
```

## 🎭 Adicionando Novos Personagens

1. **Adicionar ao catálogo** (`mockUniverseData.ts`):
```typescript
{
  id: 'new-character',
  name: 'Novo Personagem',
  type: 'character',
  description: 'Descrição...',
  attributes: {
    'Profissão': 'Detetive',
    'Primeira Aparição': 'Livro 1'
  }
}
```

2. **Adicionar dados detalhados**:
```typescript
export const newCharacterDetailedData = {
  conflicts: [...],
  motivations: [...],
  quotes: [...]
};
```

3. **Atualizar timeline** com eventos relacionados

## 🚀 Deployment

### Build de Produção
```bash
npm run build
```

### Preview Local
```bash
npm run preview
```

## 🐛 Troubleshooting

### Animações não funcionam
- Verifique se `motion/react` está instalado
- Confirme que o componente está envolto em `<AnimatePresence>`

### Tabs mobile não aparecem
- Verifique o breakpoint: `lg:hidden` para mobile
- Confirme que `MobileUniverseTabs` está renderizado

### Drawer não abre
- Verifique estado `isOpen`
- Confirme que o backdrop está renderizado
- Verifique z-index (deve ser 40-50)

## 📚 Recursos Úteis

- **Motion/React**: https://motion.dev/docs/react-quick-start
- **Shadcn/ui**: https://ui.shadcn.com/
- **Tailwind CSS**: https://tailwindcss.com/docs

## 🎯 Checklist de Teste

Antes de deploy, teste:

- [ ] Todas as páginas carregam corretamente
- [ ] Navegação mobile funciona
- [ ] Timeline é navegável em mobile e desktop
- [ ] Modo perspectiva ativa corretamente
- [ ] Notas podem ser criadas e exportadas
- [ ] Carrossel de notícias funciona
- [ ] Comparador abre e compara elementos
- [ ] Votação registra votos
- [ ] Animações são suaves
- [ ] Responsividade em todos os breakpoints

---

**Dúvidas?** Consulte o `IMPLEMENTATION_CHECKLIST.md` para lista completa de features!
