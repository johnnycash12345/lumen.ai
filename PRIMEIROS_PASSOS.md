# 🚀 Primeiros Passos - Lumen

## Status do Projeto

✅ **Banco de Dados**: Totalmente configurado e operacional
- Todas as tabelas criadas (universes, characters, locations, events, objects, pages, user_roles, processing_jobs)
- Políticas RLS implementadas e ativas
- Função `has_role` configurada para verificação de permissões
- Autenticação configurada com auto-confirmação de email

✅ **Edge Functions**: Pronta para uso
- `process-pdf`: Processa PDFs e extrai entidades usando Deepseek AI

✅ **Usuário Admin**: Já existe um usuário administrador
- ID: `164c7296-1aeb-446c-b08e-c1f2cba38244`
- Role: admin

## Como Acessar o Admin

1. **Navegue para**: `http://localhost:8080/admin` (ou o URL da sua preview)

2. **Faça login** com as credenciais de administrador ou crie uma nova conta

3. **Após criar conta**: Um administrador precisa adicionar a role manualmente no banco:

```sql
INSERT INTO user_roles (user_id, role) 
VALUES ('SEU_USER_ID', 'admin');
```

## Estrutura do Projeto

### Frontend
- **React + TypeScript + Vite**
- **Tailwind CSS** para estilização
- **Shadcn UI** para componentes
- **Motion** para animações

### Backend (Lovable Cloud/Supabase)
- **Autenticação** com email/senha
- **Row Level Security (RLS)** em todas as tabelas
- **Edge Functions** para processamento de PDFs
- **Storage** para arquivos PDF

### Páginas Principais

1. **Home** (`/`) - Página inicial com exploração de universos
2. **Admin Dashboard** (`/admin`) - Painel administrativo
   - Overview com estatísticas
   - Lista de universos
   - Upload de PDFs
   - Configurações
   - Perfil

## Fluxo de Upload de PDF

1. Admin faz login
2. Navega para "Upload de PDF"
3. Seleciona arquivo PDF (máx 50MB)
4. Preenche título e descrição
5. Sistema processa:
   - Upload do arquivo para storage
   - Criação do registro de universo
   - Extração de texto com pdfplumber
   - Análise com Deepseek AI
   - Criação de entidades (personagens, locais, eventos, objetos)
   - Geração de páginas dinâmicas

## Variáveis de Ambiente

Já configuradas no arquivo `.env`:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `VITE_SUPABASE_PROJECT_ID`

## Secrets Configurados

- `DEEPSEEK_API_KEY` - Para análise de PDFs com IA
- `SUPABASE_SERVICE_ROLE_KEY` - Para operações privilegiadas
- `SUPABASE_URL` - URL do projeto Supabase
- `SUPABASE_ANON_KEY` - Chave anônima do Supabase

## Próximos Passos Recomendados

1. ✅ **Testar Login** - Acesse `/admin` e faça login
2. ⏳ **Upload de Teste** - Faça upload de um PDF pequeno
3. ⏳ **Verificar Extração** - Confira se as entidades foram extraídas corretamente
4. ⏳ **Explorar Interface** - Navegue pelos universos criados
5. ⏳ **Ajustar Design** - Customize cores e estilos conforme necessário

## Troubleshooting

### Build não funciona
- ✅ Verificar se todas as dependências estão instaladas: `npm install`
- ✅ Verificar se as variáveis de ambiente estão corretas no `.env`
- ✅ Limpar cache e rebuildar: `npm run build`

### Não consigo fazer login
- ✅ Verificar se o email foi confirmado (auto-confirmação está ativa)
- ✅ Verificar se o usuário tem a role `admin` na tabela `user_roles`

### Upload de PDF falha
- ✅ Verificar se `DEEPSEEK_API_KEY` está configurado
- ✅ Verificar logs da edge function `process-pdf`
- ✅ Verificar tamanho do arquivo (máx 50MB)

## Comandos Úteis

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview
```

## Suporte

Se precisar de ajuda:
1. Verifique os logs do console do navegador
2. Verifique os logs das edge functions no Lovable Cloud
3. Consulte a documentação do Supabase
4. Entre em contato com o suporte

---

**Boa sorte com o projeto Lumen! 🌟**
