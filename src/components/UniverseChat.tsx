import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageCircle, Send, Loader2, Sparkles, User, Bot } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UniverseChatProps {
  universeId: string;
}

export const UniverseChat = ({ universeId }: UniverseChatProps) => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '0',
    role: 'assistant',
    content: 'Olá! Sou seu guia enciclopédico deste universo. Faça qualquer pergunta sobre personagens, locais, eventos ou objetos!',
    timestamp: new Date(),
  }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchUniverseContext = async () => {
    try {
      // Buscar todas as entidades do universo para usar como contexto
      const [charsRes, locsRes, eventsRes, objsRes] = await Promise.all([
        supabase
          .from('characters')
          .select('name, description, role, importance')
          .eq('universe_id', universeId)
          .limit(20),
        supabase
          .from('locations')
          .select('name, description, type')
          .eq('universe_id', universeId)
          .limit(20),
        supabase
          .from('events')
          .select('name, description, timeline_order')
          .eq('universe_id', universeId)
          .limit(20),
        supabase
          .from('objects')
          .select('name, description, significance')
          .eq('universe_id', universeId)
          .limit(20),
      ]);

      // Formatar contexto
      let context = '';

      if (charsRes.data && charsRes.data.length > 0) {
        context += '\n## Personagens:\n';
        charsRes.data.forEach(char => {
          context += `\n**${char.name}**`;
          if (char.role) context += ` (${char.role})`;
          if (char.description) context += `\n${char.description}`;
          context += '\n';
        });
      }

      if (locsRes.data && locsRes.data.length > 0) {
        context += '\n## Locais:\n';
        locsRes.data.forEach(loc => {
          context += `\n**${loc.name}**`;
          if (loc.type) context += ` (${loc.type})`;
          if (loc.description) context += `\n${loc.description}`;
          context += '\n';
        });
      }

      if (eventsRes.data && eventsRes.data.length > 0) {
        context += '\n## Eventos:\n';
        eventsRes.data.forEach(event => {
          context += `\n**${event.name}**`;
          if (event.description) context += `\n${event.description}`;
          context += '\n';
        });
      }

      if (objsRes.data && objsRes.data.length > 0) {
        context += '\n## Objetos:\n';
        objsRes.data.forEach(obj => {
          context += `\n**${obj.name}**`;
          if (obj.significance) context += ` (${obj.significance})`;
          if (obj.description) context += `\n${obj.description}`;
          context += '\n';
        });
      }

      return context || 'Nenhuma informação disponível sobre o universo.';
    } catch (error) {
      console.error('Erro ao buscar contexto:', error);
      return 'Erro ao carregar contexto do universo.';
    }
  };

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: question,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Buscar contexto do universo
      const context = await fetchUniverseContext();

      // Chamar edge function
      const { data, error } = await supabase.functions.invoke('universe-chat', {
        body: { question, context }
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.answer,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error: any) {
      console.error('Erro no chat:', error);
      toast.error(error.message || 'Erro ao processar pergunta');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua pergunta. Tente novamente.',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[700px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Chat Enciclopédico
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Faça perguntas sobre o universo e receba respostas detalhadas
        </CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
        {/* Messages Area */}
        <ScrollArea className="flex-1 pr-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                )}
                
                <div
                  className={`max-w-[80%] rounded-lg p-4 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {message.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm">{message.content}</p>
                  )}
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {message.role === 'user' && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <User className="h-5 w-5 text-primary-foreground" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Consultando enciclopédia...
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Faça uma pergunta sobre o universo..."
            disabled={loading}
            className="flex-1"
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            size="icon"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Powered by Deepseek AI • Respostas baseadas no contexto do universo
        </p>
      </CardContent>
    </Card>
  );
};
