# 🌌 Guia: Como Adicionar Novos Universos ao Lumen

## 📋 Checklist Geral

Para adicionar um novo universo (ex: Harry Potter, Star Wars), siga estes passos:

- [ ] 1. Criar dados do universo
- [ ] 2. Adicionar card na HomePage
- [ ] 3. Popular timeline
- [ ] 4. Criar notícias canônicas
- [ ] 5. Adicionar curiosidades
- [ ] 6. Popular catálogo
- [ ] 7. Criar dados detalhados de personagens
- [ ] 8. Configurar mapa de relações
- [ ] 9. Testar todas as funcionalidades

---

## 1️⃣ Criar Dados do Universo

### Arquivo: `/data/mockUniverseData.ts` (ou criar novo arquivo)

```typescript
// Harry Potter Example
export const harryPotterTimelineEvents = [
  {
    id: 'hp-1',
    year: '1991',
    title: 'Harry descobre ser um bruxo',
    description: 'No dia de seu aniversário de 11 anos, Harry Potter descobre que é um bruxo e recebe sua carta de Hogwarts.',
    category: 'Início',
    relatedCharacters: ['Harry Potter', 'Hagrid', 'Dumbledore']
  },
  {
    id: 'hp-2',
    year: '1991',
    title: 'Primeira viagem a Hogwarts',
    description: 'Harry embarca no Expresso de Hogwarts pela primeira vez e conhece Ron Weasley e Hermione Granger.',
    category: 'Amizades',
    relatedCharacters: ['Harry Potter', 'Ron Weasley', 'Hermione Granger']
  },
  // ... mais eventos
];

export const harryPotterNewsArticles = [
  {
    id: 'hp-news-1',
    title: 'O Menino Que Sobreviveu Retorna ao Mundo Bruxo',
    source: 'O Profeta Diário',
    date: '1 de Setembro, 1991',
    excerpt: 'Após anos de mistério, Harry Potter, o menino que sobreviveu à Maldição da Morte, foi visto entrando no Beco Diagonal.',
    content: `LONDRES - Em cenas que chocaram o mundo bruxo, Harry Potter, agora com 11 anos, foi avistado no Beco Diagonal acompanhado do guardião das chaves de Hogwarts, Rubeus Hagrid.

Potter, cuja derrota do Lorde das Trevas aos 15 meses de idade o tornou uma lenda viva, tem vivido entre trouxas desde aquela noite fatídica há 10 anos.

Testemunhas relatam que o jovem bruxo parecia maravilhado com o mundo mágico, visitando a Ollivander's para adquirir sua primeira varinha e a Floreios e Borrões para seus livros escolares.

"Foi emocionante vê-lo", disse Dedalus Diggle, que cumprimentou Potter no Caldeirão Furado. "Ele é exatamente como imaginávamos - humilde e surpreso com toda a atenção."

O Profeta Diário tentou entrevistar o jovem Potter, mas Hagrid manteve os repórteres à distância, insistindo que o garoto merecia privacidade antes de começar em Hogwarts.`,
    tags: ['Harry Potter', 'Retorno', 'Beco Diagonal', 'Hogwarts'],
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800'
  },
  // ... mais notícias
];

export const harryPotterCuriosities = [
  {
    id: 'hp-c1',
    text: 'A cicatriz de Harry Potter tem formato de raio porque representa a Maldição da Morte que Voldemort usou contra ele.',
    category: 'Símbolos'
  },
  {
    id: 'hp-c2',
    text: 'Hermione Granger originalmente deveria ter dentes da frente grandes, mas Emma Watson se recusou a usar próteses.',
    category: 'Adaptações'
  },
  // ... mais curiosidades
];

export const harryPotterCatalogElements = [
  {
    id: 'harry-potter',
    name: 'Harry James Potter',
    type: 'character' as const,
    description: 'O Menino Que Sobreviveu. Órfão criado por trouxas, Harry descobre aos 11 anos que é um bruxo famoso no mundo mágico por ter derrotado Lord Voldemort quando bebê.',
    attributes: {
      'Casa de Hogwarts': 'Grifinória',
      'Varinha': 'Azevinho e pena de fênix, 28cm',
      'Patrono': 'Cervo',
      'Posição no Quadribol': 'Apanhador',
      'Primeira Aparição': 'Harry Potter e a Pedra Filosofal (1997)'
    }
  },
  {
    id: 'hermione-granger',
    name: 'Hermione Jean Granger',
    type: 'character' as const,
    description: 'Bruxa nascida trouxa, Hermione é a aluna mais brilhante de sua geração. Conhecida por sua inteligência, lealdade e coragem.',
    attributes: {
      'Casa de Hogwarts': 'Grifinória',
      'Varinha': 'Videira e corda de coração de dragão, 27,3cm',
      'Patrono': 'Lontra',
      'Especialidade': 'Feitiços e Magia Teórica',
      'Primeira Aparição': 'Harry Potter e a Pedra Filosofal (1997)'
    }
  },
  {
    id: 'hogwarts',
    name: 'Castelo de Hogwarts',
    type: 'location' as const,
    description: 'Escola de Magia e Bruxaria de Hogwarts, fundada há mais de mil anos pelos quatro bruxos mais poderosos da época.',
    attributes: {
      'Localização': 'Escócia',
      'Fundadores': 'Godric Gryffindor, Helga Hufflepuff, Rowena Ravenclaw, Salazar Slytherin',
      'Número de Casas': '4',
      'Diretor': 'Alvo Dumbledore',
      'Características': '142 escadarias, salas que mudam de lugar'
    }
  }
];

// Dados detalhados de Harry Potter
export const harryPotterDetailedData = {
  conflicts: [
    {
      name: 'vs. Lord Voldemort',
      intensity: 100,
      description: 'A conexão profética e mágica entre Harry e Voldemort define o destino de ambos.'
    },
    {
      name: 'vs. Dursleys',
      intensity: 60,
      description: 'Anos de abuso e negligência dos tios trouxas que o criaram.'
    },
    {
      name: 'vs. Seus próprios medos',
      intensity: 70,
      description: 'Harry luta constantemente contra o medo de se tornar como Voldemort.'
    }
  ],
  motivations: [
    {
      name: 'Amor e Amizade',
      percentage: 45,
      color: '#FFD479'
    },
    {
      name: 'Justiça',
      percentage: 35,
      color: '#DC2626'
    },
    {
      name: 'Proteção',
      percentage: 20,
      color: '#0B1E3D'
    }
  ],
  motivationSummary: 'Harry é impulsionado principalmente pelo amor aos seus amigos e pela necessidade de proteger aqueles que não podem se defender. Sua busca por justiça, especialmente em relação à morte de seus pais, o motiva em sua luta contra Voldemort.',
  quotes: [
    {
      text: 'It takes a great deal of bravery to stand up to our enemies, but just as much to stand up to our friends.',
      source: 'Harry Potter e a Pedra Filosofal',
      context: 'Dumbledore elogia Neville Longbottom por ter a coragem de confrontar seus amigos quando necessário.',
      chapter: 'O Homem com Duas Faces'
    },
    {
      text: 'We\'ve all got both light and dark inside us. What matters is the part we choose to act on.',
      source: 'Harry Potter e a Ordem da Fênix',
      context: 'Sirius Black aconselha Harry sobre a natureza humana e a importância das escolhas.',
      chapter: 'O Único a Quem Ele Sempre Temeu'
    }
  ]
};
```

---

## 2️⃣ Adicionar Card na HomePage

### Arquivo: `/components/HomePage.tsx`

```typescript
const universes = [
  // ... universos existentes
  {
    id: 'harry-potter',
    title: 'Harry Potter',
    description: 'O mundo bruxo aguarda. Explore Hogwarts, magias e o destino do Menino Que Sobreviveu.',
    icon: Sparkles, // ou Wand se criar ícone personalizado
  },
];
```

---

## 3️⃣ Configurar Mapa de Relações

```typescript
const harryPotterCharacters = [
  { id: 'harry', name: 'Harry', x: 200, y: 150 },
  { id: 'ron', name: 'Ron', x: 120, y: 100 },
  { id: 'hermione', name: 'Hermione', x: 280, y: 100 },
  { id: 'voldemort', name: 'Voldemort', x: 200, y: 50 },
  { id: 'dumbledore', name: 'Dumbledore', x: 200, y: 250 }
];

const harryPotterRelationships = [
  { from: 'harry', to: 'ron', type: 'friendship' as const, strength: 1.0 },
  { from: 'harry', to: 'hermione', type: 'friendship' as const, strength: 1.0 },
  { from: 'harry', to: 'voldemort', type: 'rivalry' as const, strength: 1.0 },
  { from: 'harry', to: 'dumbledore', type: 'professional' as const, strength: 0.9 }
];
```

---

## 4️⃣ Atualizar EnhancedUniversePage

### Arquivo: `/components/EnhancedUniversePage.tsx`

Adicione uma estrutura condicional baseada no `universeId`:

```typescript
export function EnhancedUniversePage({ universeId, onBack }: EnhancedUniversePageProps) {
  // Carregar dados baseados no universo
  const universeData = useMemo(() => {
    switch(universeId) {
      case 'sherlock':
        return {
          timeline: timelineEvents,
          news: newsArticles,
          curiosities: curiosities,
          catalog: catalogElements,
          categories: sherlockCategories,
          characters: sherlockCharacters,
          relationships: sherlockRelationships
        };
      case 'harry-potter':
        return {
          timeline: harryPotterTimelineEvents,
          news: harryPotterNewsArticles,
          curiosities: harryPotterCuriosities,
          catalog: harryPotterCatalogElements,
          categories: harryPotterCategories,
          characters: harryPotterCharacters,
          relationships: harryPotterRelationships
        };
      default:
        return null;
    }
  }, [universeId]);

  // ... resto do componente usando universeData
}
```

---

## 5️⃣ Criar Progresso Específico

```typescript
export const harryPotterProgressData = {
  universe: 'Harry Potter',
  overallProgress: 45,
  storiesRead: { current: 3, total: 7 },  // 7 livros
  charactersExplored: { current: 15, total: 30 },
  locationsVisited: { current: 8, total: 15 },
  conversationsHad: 32
};
```

---

## 6️⃣ Adicionar Ícone Personalizado (Opcional)

### Para ícones específicos, crie um componente SVG:

```typescript
// components/icons/WandIcon.tsx
export function WandIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
      <path 
        d="M21 3l-3 3M6 18l-3 3m12-12l-3 3m-6 6l-3 3M15 6l3-3m-9 9l-3 3" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      <circle cx="12" cy="12" r="2" fill="currentColor" />
    </svg>
  );
}
```

---

## 7️⃣ Criar Categorias do Universo

```typescript
const harryPotterCategories = [
  {
    id: 'characters',
    name: 'Personagens',
    icon: User,
    items: ['Harry Potter', 'Hermione Granger', 'Ron Weasley', 'Alvo Dumbledore', 'Lord Voldemort']
  },
  {
    id: 'locations',
    name: 'Locais',
    icon: MapPin,
    items: ['Castelo de Hogwarts', 'Beco Diagonal', 'Ministério da Magia', 'Floresta Proibida']
  },
  {
    id: 'spells',
    name: 'Feitiços',
    icon: Sparkles,
    items: ['Expecto Patronum', 'Expelliarmus', 'Wingardium Leviosa', 'Avada Kedavra']
  },
  {
    id: 'objects',
    name: 'Objetos Mágicos',
    icon: Package,
    items: ['Pedra Filosofal', 'Capa da Invisibilidade', 'Varinha das Varinhas', 'Mapa do Maroto']
  }
];
```

---

## 8️⃣ Modo Perspectiva Personalizado

Adicione cores específicas do universo para o modo perspectiva:

```typescript
const characterPerspectiveColors = {
  'harry-potter': {
    'harry-potter': '#DC2626',      // Vermelho Grifinória
    'hermione-granger': '#FFD479',  // Dourado
    'ron-weasley': '#F59E0B',       // Laranja Weasley
    'dumbledore': '#8B5CF6',        // Roxo sábio
    'voldemort': '#059669'          // Verde Sonserina
  },
  'sherlock': {
    'watson': '#0B1E3D',
    'mrs-hudson': '#DDEEFF',
    'lestrade': '#4A5B6C'
  }
};
```

---

## 9️⃣ Testes a Realizar

Após adicionar o universo, teste:

### Desktop
- [ ] Card aparece na home
- [ ] Clique navega corretamente
- [ ] Timeline carrega os eventos
- [ ] Notícias aparecem no carrossel
- [ ] Curiosidades rotacionam
- [ ] Catálogo mostra categorias corretas
- [ ] Mapa de relações renderiza
- [ ] Detalhes de personagem funcionam
- [ ] Modo perspectiva ativa

### Mobile
- [ ] Abas funcionam (Catálogo/Chat/Referências)
- [ ] Swipe na timeline
- [ ] Drawer do catálogo abre
- [ ] Touch em todos os elementos

---

## 🎨 Personalização Visual por Universo

### Paleta de Cores Sugeridas

#### Harry Potter
```css
--primary: #740001 (Grifinória)
--accent: #D3A625 (Dourado)
--background: #F4E7D7 (Pergaminho)
```

#### Star Wars
```css
--primary: #000000 (Espaço)
--accent: #FFE81F (Amarelo Sabre)
--background: #1A1A2E (Galáxia)
```

#### O Senhor dos Anéis
```css
--primary: #2D5016 (Verde Condado)
--accent: #C19A6B (Ouro Anel)
--background: #F5F3EE (Mapa)
```

---

## 📚 Exemplo Completo: Star Wars

```typescript
// data/starWarsData.ts
export const starWarsTimelineEvents = [
  {
    id: 'sw-1',
    year: '32 BBY',
    title: 'A Ameaça Fantasma',
    description: 'Qui-Gon Jinn e Obi-Wan Kenobi descobrem o jovem Anakin Skywalker em Tatooine.',
    category: 'Descoberta',
    relatedCharacters: ['Anakin Skywalker', 'Qui-Gon Jinn', 'Obi-Wan Kenobi']
  },
  // ... mais eventos
];

export const starWarsNewsArticles = [
  {
    id: 'sw-news-1',
    title: 'Jovem Piloto Destrói Estrela da Morte',
    source: 'Rede de Notícias da Aliança Rebelde',
    date: '0 DBY',
    excerpt: 'Um piloto desconhecido identificado como Luke Skywalker destruiu a arma definitiva do Império.',
    content: `...`,
    tags: ['Rebelião', 'Estrela da Morte', 'Vitória'],
    image: 'https://images.unsplash.com/photo-1579566346927-c68383817a25?w=800'
  }
];
```

---

## 🚀 Checklist Final

Antes de considerar o universo completo:

- [ ] Mínimo de 5 eventos na timeline
- [ ] Pelo menos 3 artigos de notícias
- [ ] 5+ curiosidades
- [ ] 10+ elementos no catálogo
- [ ] Dados detalhados de 2-3 personagens principais
- [ ] Mapa de relações com 5+ personagens
- [ ] Progresso do usuário configurado
- [ ] Testes em mobile e desktop
- [ ] Cores personalizadas (opcional)
- [ ] Ícones específicos (opcional)

---

**Pronto!** Seu novo universo está integrado ao Lumen! 🎉
