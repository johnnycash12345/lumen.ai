export const timelineEvents = [
  {
    id: '1',
    year: '1881',
    title: 'Encontro de Holmes e Watson',
    description: 'John Watson retorna ferido da guerra no Afeganistão e é apresentado a Sherlock Holmes por um conhecido mútuo, iniciando uma das parcerias mais famosas da literatura.',
    category: 'Encontros',
    relatedCharacters: ['Sherlock Holmes', 'Dr. John Watson']
  },
  {
    id: '2',
    year: '1881',
    title: 'Mudança para Baker Street',
    description: 'Holmes e Watson decidem dividir o aluguel do apartamento 221B na Baker Street, que se tornaria o endereço mais famoso da ficção policial.',
    category: 'Locais',
    relatedCharacters: ['Sherlock Holmes', 'Dr. John Watson', 'Mrs. Hudson']
  },
  {
    id: '3',
    year: '1888',
    title: 'O Cão dos Baskervilles',
    description: 'Holmes investiga uma maldição ancestral que assombra a família Baskerville em Dartmoor, um dos seus casos mais complexos.',
    category: 'Casos',
    relatedCharacters: ['Sherlock Holmes', 'Dr. John Watson']
  },
  {
    id: '4',
    year: '1891',
    title: 'Confronto nas Cataratas de Reichenbach',
    description: 'Holmes enfrenta seu arqui-inimigo Professor Moriarty nas cataratas de Reichenbach, resultando na aparente morte de ambos.',
    category: 'Confrontos',
    relatedCharacters: ['Sherlock Holmes', 'Professor Moriarty']
  }
];

export const newsArticles = [
  {
    id: '1',
    title: 'Detetive Consultor Resolve Mistério do Carbúnculo Azul',
    source: 'The Times',
    date: '27 de Dezembro, 1889',
    excerpt: 'Um valioso carbúnculo azul, roubado da Condessa de Morcar, foi recuperado de forma extraordinária pelo Sr. Sherlock Holmes através de um ganso de Natal.',
    content: `LONDRES - Em um dos casos mais peculiares deste ano, o renomado detetive consultor Sherlock Holmes solucionou o roubo do famoso carbúnculo azul pertencente à Condessa de Morcar.

A joia, avaliada em milhares de libras, foi roubada do quarto de hotel da Condessa no Hotel Cosmopolitan no último dia 22. O caso parecia impossível até que Holmes, através de sua meticulosa observação, traçou o caminho da pedra através de uma série de eventos improváveis.

"O método foi elementar", declarou Holmes ao Times. "Segui o rastro de um simples ganso de Natal, que levou ao verdadeiro ladrão."

O Sr. James Ryder, funcionário do hotel, confessou o crime após ser confrontado com as evidências irrefutáveis apresentadas por Holmes. A joia foi devolvida à Condessa, que expressou sua profunda gratidão ao detetive.

Scotland Yard, representada pelo Inspetor Bradstreet, reconheceu a contribuição vital de Holmes para a resolução do caso.`,
    tags: ['Crime', 'Roubo', 'Investigação', 'Baker Street'],
    image: 'https://images.unsplash.com/photo-1585776245991-cf89dd7fc73a?w=800',
    year: '1889',
    relatedCharacters: ['Sherlock Holmes', 'Dr. John Watson', 'Inspetor Bradstreet'],
    relatedQuotes: [
      {
        text: 'I suppose that I am commuting a felony, but it is just possible that I am saving a soul.',
        character: 'Sherlock Holmes'
      },
      {
        text: 'It is a mercy that you are on the side of the force, and not against it, Mr. Holmes.',
        character: 'Inspetor Bradstreet'
      }
    ]
  },
  {
    id: '2',
    title: 'Misterioso Caso da Liga dos Cabeças Vermelhas Desvendado',
    source: 'The Strand Magazine',
    date: 'Outubro, 1890',
    excerpt: 'Sherlock Holmes expõe elaborado esquema criminoso disfarçado como associação filantrópica para homens ruivos.',
    content: `Um caso extraordinário de engenhosidade criminosa foi trazido à luz pelo célebre detetive Sr. Sherlock Holmes, envolvendo uma suposta organização chamada "Liga dos Cabeças Vermelhas".

O Sr. Jabez Wilson, um modesto penhorista, foi contratado pela tal liga para copiar a Enciclopédia Britânica, recebendo quatro libras semanais. Quando a liga subitamente se dissolveu, Wilson procurou Holmes para investigar.

Holmes descobriu que toda a elaborada farsa era uma cortina de fumaça para um ousado plano de roubo ao banco City and Suburban, situado ao lado da loja de penhores de Wilson.

O criminoso John Clay e seu cúmplice pretendiam cavar um túnel até o cofre do banco enquanto Wilson estava ocupado com suas "tarefas" para a liga.

Com a assistência de Scotland Yard, Holmes capturou os criminosos em flagrante. "Foi um esquema admirável em sua concepção", comentou Holmes, "mas falhou ao não considerar que alguém poderia perceber a conexão entre os eventos aparentemente não relacionados."`,
    tags: ['Engano', 'Roubo a Banco', 'Dedução', 'John Clay'],
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800',
    year: '1890',
    relatedCharacters: ['Sherlock Holmes', 'Dr. John Watson', 'John Clay'],
    relatedQuotes: [
      {
        text: 'My life is spent in one long effort to escape from the commonplaces of existence.',
        character: 'Sherlock Holmes'
      },
      {
        text: 'Crime is common. Logic is rare.',
        character: 'Sherlock Holmes'
      }
    ]
  },
  {
    id: '3',
    title: 'Cientista Brilhante Revelado como Mente Criminosa',
    source: 'The Daily Telegraph',
    date: 'Maio, 1891',
    excerpt: 'Professor James Moriarty, respeitado matemático, é exposto como líder de vasta organização criminosa por Sherlock Holmes.',
    content: `Em uma revelação chocante que abalou os círculos acadêmicos e policiais de Londres, o Professor James Moriarty, anteriormente respeitado por suas contribuições à matemática, foi identificado como a mente por trás de metade dos crimes não solucionados da capital.

O Sr. Sherlock Holmes, que vem investigando o professor há meses, apresentou evidências irrefutáveis de que Moriarty opera uma vasta rede criminosa com tentáculos em todo o império britânico.

"Ele é o Napoleão do crime", declarou Holmes. "Ele é o organizador de metade do que é mal e de quase toda a detecção do que não é detectado nesta grande cidade. Ele é um gênio, um filósofo, um pensador abstrato."

Scotland Yard montou uma operação para desmantelar a rede de Moriarty, mas o professor permanece à solta. Holmes alertou que Moriarty é "extremamente perigoso" e que qualquer confronto direto seria fatal.

A academia expressou choque com as revelações, com muitos colegas se recusando a acreditar que o brilhante matemático poderia ser capaz de tais atos.`,
    tags: ['Moriarty', 'Organização Criminosa', 'Revelação', 'Perigo'],
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800',
    year: '1891',
    relatedCharacters: ['Sherlock Holmes', 'Professor Moriarty', 'Dr. John Watson'],
    relatedQuotes: [
      {
        text: 'He is the Napoleon of crime, Watson. He is the organizer of half that is evil.',
        character: 'Sherlock Holmes'
      },
      {
        text: 'All that I have to say has already crossed your mind.',
        character: 'Professor Moriarty'
      }
    ]
  }
];

export const curiosities = [
  {
    id: '1',
    text: 'Sherlock Holmes nunca disse "Elementar, meu caro Watson" nas histórias originais de Conan Doyle.',
    category: 'Fatos Literários'
  },
  {
    id: '2',
    text: 'O endereço 221B Baker Street não existia quando Conan Doyle escreveu as histórias. Foi criado posteriormente.',
    category: 'Locais'
  },
  {
    id: '3',
    text: 'Holmes tocava violino para ajudar no seu processo de dedução, frequentemente por horas a fio.',
    category: 'Personalidade'
  },
  {
    id: '4',
    text: 'Watson foi ferido em duas localizações diferentes: ombro e perna, em diferentes histórias - uma inconsistência famosa.',
    category: 'Mistérios Canônicos'
  },
  {
    id: '5',
    text: 'Professor Moriarty aparece em apenas dois contos originais, mas se tornou o arqui-inimigo mais icônico.',
    category: 'Personagens'
  }
];

export const catalogElements = [
  {
    id: 'holmes',
    name: 'Sherlock Holmes',
    type: 'character' as const,
    description: 'Detetive consultor residente em 221B Baker Street. Conhecido por seu método científico de dedução e atenção extraordinária aos detalhes.',
    attributes: {
      'Profissão': 'Detetive Consultor',
      'Residência': '221B Baker Street',
      'Habilidades': 'Dedução, Química, Violino',
      'Primeira Aparição': 'A Study in Scarlet (1887)'
    }
  },
  {
    id: 'watson',
    name: 'Dr. John Watson',
    type: 'character' as const,
    description: 'Médico do exército reformado, biógrafo e melhor amigo de Sherlock Holmes. Narrador da maioria das aventuras.',
    attributes: {
      'Profissão': 'Médico',
      'Serviço Militar': 'Cirurgião do Exército',
      'Residência': '221B Baker Street',
      'Relacionamento': 'Melhor amigo e parceiro de Holmes'
    }
  },
  {
    id: 'moriarty',
    name: 'Professor James Moriarty',
    type: 'character' as const,
    description: 'Gênio matemático e arqui-inimigo de Holmes. Descrito como o "Napoleão do Crime", controla uma vasta rede criminosa.',
    attributes: {
      'Profissão': 'Professor de Matemática / Líder Criminoso',
      'Especialidade': 'Dinâmica de Asteroides',
      'Primeira Aparição': 'The Final Problem (1893)',
      'Status': 'Arqui-inimigo de Holmes'
    }
  },
  {
    id: 'lestrade',
    name: 'Inspetor Lestrade',
    type: 'character' as const,
    description: 'Inspetor da Scotland Yard que frequentemente solicita a ajuda de Holmes. Apesar de seu ceticismo inicial, respeita as habilidades do detetive.',
    attributes: {
      'Profissão': 'Inspetor de Polícia',
      'Afiliação': 'Scotland Yard',
      'Primeira Aparição': 'A Study in Scarlet (1887)',
      'Relacionamento': 'Parceiro profissional de Holmes'
    }
  },
  {
    id: 'mrs-hudson',
    name: 'Mrs. Hudson',
    type: 'character' as const,
    description: 'Proprietária e governanta de 221B Baker Street. Tolerante com as excentricidades de seus inquilinos e dedicada ao seu bem-estar.',
    attributes: {
      'Profissão': 'Proprietária/Governanta',
      'Residência': '221B Baker Street',
      'Primeira Aparição': 'A Study in Scarlet (1887)',
      'Relacionamento': 'Proprietária de Holmes e Watson'
    }
  },
  {
    id: 'baker-street',
    name: '221B Baker Street',
    type: 'location' as const,
    description: 'Residência e escritório de Sherlock Holmes e Dr. Watson. O endereço mais famoso da ficção policial.',
    attributes: {
      'Tipo': 'Apartamento',
      'Proprietária': 'Mrs. Hudson',
      'Localização': 'Londres, Inglaterra',
      'Características': 'Sala de estar, quarto, laboratório químico'
    }
  }
];

export const watsonDetailedData = {
  conflicts: [
    {
      name: 'vs. Professor Moriarty',
      intensity: 85,
      description: 'Apoio incondicional a Holmes no confronto final contra o "Napoleão do Crime".'
    },
    {
      name: 'vs. Seus próprios limites',
      intensity: 45,
      description: 'Luta constante entre seu desejo de aventura e sua necessidade de estabilidade.'
    },
    {
      name: 'vs. Incompreensão pública',
      intensity: 30,
      description: 'Frustração quando seus relatos são criticados ou mal interpretados.'
    }
  ],
  motivations: [
    {
      name: 'Lealdade',
      percentage: 40,
      color: '#FFD479'
    },
    {
      name: 'Aventura',
      percentage: 35,
      color: '#0B1E3D'
    },
    {
      name: 'Justiça',
      percentage: 25,
      color: '#d4a574'
    }
  ],
  motivationSummary: 'Dr. Watson é movido principalmente por sua lealdade inabalável a Sherlock Holmes, seguida por seu desejo de aventura após anos de monotonia pós-guerra. Sua busca por justiça completa o trio de motivações que definem suas ações.',
  quotes: [
    {
      text: 'You are the one fixed point in a changing age.',
      source: 'His Last Bow',
      context: 'Watson expressa sua admiração e constância em relação a Holmes durante um período de grandes mudanças políticas e sociais na véspera da Primeira Guerra Mundial.',
      chapter: 'Capítulo Final'
    },
    {
      text: 'I am lost without my Boswell.',
      source: 'A Scandal in Bohemia',
      context: 'Holmes refere-se a Watson como seu biógrafo essencial, comparando-o a James Boswell, o famoso biógrafo de Samuel Johnson.',
      chapter: 'Parte I'
    },
    {
      text: 'The game is afoot!',
      source: 'The Adventure of the Abbey Grange',
      context: 'Watson relata a famosa exclamação de Holmes ao início de um novo caso, capturando a energia e entusiasmo que define suas aventuras.',
      chapter: 'Início da Investigação'
    }
  ]
};

export const lestradeDetailedData = {
  conflicts: [
    {
      name: 'vs. Métodos não ortodoxos',
      intensity: 60,
      description: 'Frustração constante com os métodos pouco convencionais de Holmes.'
    },
    {
      name: 'vs. Orgulho profissional',
      intensity: 55,
      description: 'Luta entre admitir que precisa de ajuda e manter sua reputação na Scotland Yard.'
    },
    {
      name: 'vs. Burocracia',
      intensity: 40,
      description: 'Conflito entre seguir procedimentos oficiais e obter resultados rápidos.'
    }
  ]
};

export const userProgressData = {
  universe: 'Sherlock Holmes',
  overallProgress: 65,
  storiesRead: { current: 3, total: 4 },
  charactersExplored: { current: 12, total: 15 },
  locationsVisited: { current: 8, total: 10 },
  conversationsHad: 47
};

export const sampleResearchNotes = [
  {
    id: '1',
    title: 'Análise do Carbúnculo Azul',
    content: 'Este caso demonstra a genialidade de Holmes ao rastrear uma joia roubada através de uma série de eventos aparentemente não relacionados. A dedução do ganso foi particularmente brilhante.',
    tags: ['Casos', 'Dedução', 'Roubo'],
    createdAt: new Date('2024-10-15')
  },
  {
    id: '2',
    title: 'Relação Holmes-Watson',
    content: 'A dinâmica entre Holmes e Watson é fascinante. Watson serve não apenas como narrador, mas como contraponto emocional ao racionalismo extremo de Holmes.',
    tags: ['Personagens', 'Análise', 'Relacionamentos'],
    createdAt: new Date('2024-10-20')
  }
];
