import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { Eye, EyeOff, BookOpen } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
          },
        });

        if (error) throw error;
        toast.success('Conta criada com sucesso! Verifique seu email.');
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Verificar se usuário tem role admin
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', data.user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (roleError) throw roleError;

        if (!roleData) {
          await supabase.auth.signOut();
          toast.error('Acesso negado. Apenas administradores podem acessar.');
          return;
        }

        toast.success('Login realizado com sucesso!');
        onLoginSuccess();
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao processar solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F4ED] p-4">
      <Card className="w-full max-w-md p-8 bg-white shadow-lg">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#FFD479] rounded-full flex items-center justify-center mb-4">
            <BookOpen className="w-8 h-8 text-[#0B1E3D]" />
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#0B1E3D] mb-2">
            Lumen Admin
          </h1>
          <p className="text-sm text-[#0B1E3D]/70">
            {isSignUp ? 'Criar nova conta de administrador' : 'Acesse o dashboard administrativo'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <Label htmlFor="email" className="text-[#0B1E3D]">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="admin@lumen.com"
            />
          </div>

          <div>
            <Label htmlFor="password" className="text-[#0B1E3D]">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-1 pr-10"
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B1E3D]/50 hover:text-[#0B1E3D]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#0B1E3D] hover:bg-[#0B1E3D]/90 text-white"
          >
            {isLoading ? 'Processando...' : isSignUp ? 'Criar Conta' : 'Entrar'}
          </Button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-sm text-[#0B1E3D]/70 hover:text-[#0B1E3D] transition-colors"
          >
            {isSignUp ? 'Já tem uma conta? Entrar' : 'Criar nova conta'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#0B1E3D]/10">
          <p className="text-xs text-[#0B1E3D]/50 text-center">
            ⚠️ Acesso restrito apenas para administradores durante a fase MVP
          </p>
        </div>
      </Card>
    </div>
  );
}
