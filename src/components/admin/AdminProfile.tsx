import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { User } from '@supabase/supabase-js';
import { UserIcon, Mail, Calendar, Shield } from 'lucide-react';

interface AdminProfileProps {
  user: User;
}

export function AdminProfile({ user }: AdminProfileProps) {
  return (
    <div>
      <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#0B1E3D] mb-8">
        Perfil do Administrador
      </h1>

      <div className="max-w-2xl">
        <Card className="p-8 bg-white">
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-[#0B1E3D]/10">
            <div className="w-20 h-20 bg-[#FFD479] rounded-full flex items-center justify-center">
              <UserIcon className="w-10 h-10 text-[#0B1E3D]" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-2xl text-[#0B1E3D]">
                {user.email}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <Shield className="w-4 h-4 text-[#FFD479]" />
                <p className="text-sm text-[#0B1E3D]/70">Administrador</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <Label className="text-[#0B1E3D] flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input value={user.email || ''} disabled className="mt-1" />
            </div>

            <div>
              <Label className="text-[#0B1E3D] flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Conta Criada em
              </Label>
              <Input
                value={new Date(user.created_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
                disabled
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-[#0B1E3D] flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                ID do Usuário
              </Label>
              <Input value={user.id} disabled className="mt-1 font-mono text-xs" />
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#0B1E3D]/10">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => alert('Funcionalidade em desenvolvimento')}
            >
              Alterar Senha
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
