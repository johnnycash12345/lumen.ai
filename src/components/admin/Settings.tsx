import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

export function Settings() {
  return (
    <div>
      <h1 style={{ fontFamily: 'Playfair Display, serif' }} className="text-3xl text-[#0B1E3D] mb-8">
        Configurações
      </h1>

      <div className="max-w-2xl space-y-6">
        <Card className="p-6 bg-white">
          <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-xl text-[#0B1E3D] mb-4">
            Configurações de Upload
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="max-size" className="text-[#0B1E3D]">
                Tamanho Máximo de Arquivo (MB)
              </Label>
              <Input
                id="max-size"
                type="number"
                defaultValue="50"
                className="mt-1"
                disabled
              />
            </div>
            <div>
              <Label htmlFor="allowed-types" className="text-[#0B1E3D]">
                Tipos de Arquivo Permitidos
              </Label>
              <Input
                id="allowed-types"
                defaultValue="PDF"
                className="mt-1"
                disabled
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-xl text-[#0B1E3D] mb-4">
            Configurações de IA
          </h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="ai-model" className="text-[#0B1E3D]">
                Modelo de IA
              </Label>
              <Input
                id="ai-model"
                defaultValue="deepseek-chat"
                className="mt-1"
                disabled
              />
              <p className="text-xs text-[#0B1E3D]/70 mt-1">
                Deepseek é usado por custo-benefício durante o MVP
              </p>
            </div>
            <div>
              <Label htmlFor="temperature" className="text-[#0B1E3D]">
                Temperatura (0-1)
              </Label>
              <Input
                id="temperature"
                type="number"
                defaultValue="0.3"
                step="0.1"
                min="0"
                max="1"
                className="mt-1"
                disabled
              />
              <p className="text-xs text-[#0B1E3D]/70 mt-1">
                0.3 para extração de dados mais determinística
              </p>
            </div>
            <div>
              <Label htmlFor="max-tokens" className="text-[#0B1E3D]">
                Max Tokens
              </Label>
              <Input
                id="max-tokens"
                type="number"
                defaultValue="4000"
                className="mt-1"
                disabled
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white">
          <h2 style={{ fontFamily: 'Playfair Display, serif' }} className="text-xl text-[#0B1E3D] mb-4">
            Sistema
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="maintenance" className="text-[#0B1E3D]">
                Modo de Manutenção
              </Label>
              <p className="text-sm text-[#0B1E3D]/70">
                Desativa uploads durante manutenção
              </p>
            </div>
            <Switch id="maintenance" disabled />
          </div>
        </Card>
      </div>
    </div>
  );
}
