# 📚 Sistema Completo de Upload e Extração de PDFs - Lumen

## Status da Implementação

### ✅ Concluído
- Edge function robusta `process-pdf-complete` com retry logic
- Validações de arquivo (tipo, tamanho)
- Chunking com overlap de 200 caracteres
- Extração de entidades com Deepseek AI
- Consolidação e remoção de duplicatas
- Inserção no banco de dados Supabase
- Tratamento de erros em cada fase
- Logging detalhado de cada etapa

### 📋 Fluxo Completo Implementado

```
1. Upload do PDF → Storage do Supabase
2. Criar registro Universe → Tabela `universes`
3. Criar Processing Job → Tabela `processing_jobs`
4. Edge Function processa automaticamente:
   ├─ Validação do conteúdo
   ├─ Chunking com overlap
   ├─ Extração com Deepseek (com retry)
   ├─ Consolidação de duplicatas
   ├─ Inserção no banco
   └─ Atualização de status
```

## Como Usar

### 1. Acessar Admin Dashboard
```
http://localhost:8080/admin
```

### 2. Fazer Upload de PDF
1. Clique em "Upload de PDF" no menu lateral
2. Selecione um arquivo PDF (máx 50MB)
3. Preencha o título (obrigatório)
4. Preencha a descrição (opcional)
5. Clique em "Processar PDF"

### 3. Monitorar Processamento
- O sistema mostra progresso em tempo real
- Aguarde 2-5 minutos para conclusão
- Verifique na lista de universos quando completar

## Estrutura de Dados Extraídos

### Personagens (Characters)
```typescript
{
  name: string,
  aliases: string[],
  description: string,
  role: "PROTAGONIST" | "ANTAGONIST" | "SUPPORTING" | "MINOR",
  abilities: string[],
  personality: string,
  occupation: string
}
```

### Locais (Locations)
```typescript
{
  name: string,
  aliases: string[],
  description: string,
  type: "CITY" | "BUILDING" | "MAGICAL_PLACE" | "COUNTRY" | "REGION",
  country: string | null,
  significance: string
}
```

### Eventos (Events)
```typescript
{
  name: string,
  description: string,
  date: string | null,
  location: string | null,
  significance: "MAJOR" | "MINOR",
  involved_characters: string[]
}
```

### Objetos (Objects)
```typescript
{
  name: string,
  aliases: string[],
  description: string,
  type: "MAGICAL_ITEM" | "WEAPON" | "ARTIFACT" | "TOOL" | "BOOK",
  owner: string | null,
  powers: string,
  significance: string
}
```

## Configuração de Secrets

### Deepseek API Key
Já configurado como `DEEPSEEK_API_KEY` nos secrets do Supabase.

Para verificar:
```bash
# Na UI do Lovable Cloud
Settings → Backend → Secrets
```

## Edge Functions

### `process-pdf-complete`
**Localização:** `supabase/functions/process-pdf-complete/index.ts`

**Funcionalidades:**
- ✅ Validação de conteúdo
- ✅ Chunking com overlap
- ✅ Retry logic (3 tentativas)
- ✅ Consolidação de duplicatas
- ✅ Logging detalhado
- ✅ Tratamento de erros por chunk
- ✅ Progresso em tempo real

**Configuração:**
```toml
[functions.process-pdf-complete]
verify_jwt = true
```

## Banco de Dados

### Tabelas Principais

#### `universes`
```sql
- id: uuid (PK)
- title: text
- description: text
- processing_status: text ('pending', 'processing', 'completed', 'failed')
- pdf_path: text
- user_id: uuid (FK)
- created_at: timestamp
- updated_at: timestamp
```

#### `processing_jobs`
```sql
- id: uuid (PK)
- universe_id: uuid (FK)
- status: text ('PROCESSING', 'COMPLETED', 'COMPLETED_WITH_ERRORS', 'FAILED')
- progress: integer (0-100)
- error_message: text
- created_at: timestamp
- updated_at: timestamp
```

#### `characters`
```sql
- id: uuid (PK)
- universe_id: uuid (FK)
- name: text
- description: text
- role: text
- importance: text
- created_at: timestamp
```

#### `locations`, `events`, `objects`
Estruturas similares com campos específicos.

## Tratamento de Erros

### Níveis de Erro

1. **Erro Fatal** - Para todo o processamento
   - API Deepseek não disponível
   - Banco de dados inacessível
   - Arquivo corrompido

2. **Erro de Chunk** - Continua processando outros chunks
   - Timeout no Deepseek
   - JSON inválido retornado
   - Erro de parsing

3. **Erro de Inserção** - Registra mas continua
   - Violação de constraint
   - Dados inválidos

### Logs de Erro

Todos os erros são registrados em:
- Console da edge function (ver logs no Lovable Cloud)
- Campo `error_message` na tabela `processing_jobs`
- Status final: `COMPLETED_WITH_ERRORS` se houver erros não-fatais

## Monitoramento

### Ver Logs da Edge Function
```bash
# No Lovable Cloud UI
Backend → Edge Functions → process-pdf-complete → Logs
```

### Verificar Status de Jobs
```sql
SELECT 
  pj.status,
  pj.progress,
  pj.error_message,
  u.title,
  pj.created_at,
  pj.updated_at
FROM processing_jobs pj
JOIN universes u ON u.id = pj.universe_id
ORDER BY pj.created_at DESC;
```

### Estatísticas de Extração
```sql
SELECT 
  u.title,
  COUNT(DISTINCT c.id) as characters,
  COUNT(DISTINCT l.id) as locations,
  COUNT(DISTINCT e.id) as events,
  COUNT(DISTINCT o.id) as objects
FROM universes u
LEFT JOIN characters c ON c.universe_id = u.id
LEFT JOIN locations l ON l.universe_id = u.id
LEFT JOIN events e ON e.universe_id = u.id
LEFT JOIN objects o ON o.universe_id = u.id
WHERE u.processing_status = 'completed'
GROUP BY u.id, u.title;
```

## Performance

### Tempo Esperado de Processamento

| Tamanho do PDF | Páginas | Tempo Estimado |
|----------------|---------|----------------|
| Pequeno        | 50-100  | 1-2 minutos   |
| Médio          | 100-300 | 2-5 minutos   |
| Grande         | 300-500 | 5-10 minutos  |

### Otimizações Implementadas

1. **Chunking com Overlap**: Evita perda de contexto entre chunks
2. **Retry Logic**: Até 3 tentativas com backoff exponencial
3. **Processamento Paralelo**: Múltiplos chunks podem ser processados
4. **Deduplicação Inteligente**: Fuzzy matching para consolidar entidades

## Troubleshooting

### Problema: Edge Function timeout
**Solução:** O timeout padrão é 60s. Se o PDF for muito grande, a edge function pode timeout.
**Ação:** Dividir o PDF em partes menores ou aumentar o timeout na configuração.

### Problema: Deepseek retorna JSON inválido
**Solução:** O sistema tenta fazer parsing com fallback para extrair JSON de markdown.
**Ação:** Se persistir, verificar o prompt ou ajustar a temperatura do modelo.

### Problema: Muitas duplicatas após extração
**Solução:** O sistema já faz deduplicação, mas pode precisar de ajustes no algoritmo.
**Ação:** Melhorar o fuzzy matching ou adicionar mais regras de consolidação.

### Problema: Entidades não extraídas
**Solução:** Verificar se o texto do PDF foi corretamente extraído.
**Ação:** Testar com PDFs diferentes ou ajustar o prompt do Deepseek.

## Próximas Melhorias (Roadmap)

### Alta Prioridade
- [ ] Extração de relacionamentos entre personagens
- [ ] Detecção automática de capítulos
- [ ] Validação de PDF (mínimo de páginas, texto extraível)
- [ ] Dashboard de monitoramento em tempo real

### Média Prioridade
- [ ] Suporte a múltiplos idiomas
- [ ] Exportação de dados extraídos (JSON, CSV)
- [ ] Edição manual de entidades extraídas
- [ ] Merge de universos

### Baixa Prioridade
- [ ] OCR para PDFs de imagem
- [ ] Suporte a outros formatos (EPUB, MOBI)
- [ ] API pública para consulta de dados
- [ ] Integração com Neo4j para grafos

## Suporte

Para problemas ou dúvidas:
1. Verificar logs da edge function
2. Consultar esta documentação
3. Verificar os exemplos de uso
4. Contatar o suporte técnico

---

**Última atualização:** Novembro 2025
**Versão:** 1.0.0
