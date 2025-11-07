import { Search, Filter } from 'lucide-react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CatalogQuickFilterProps {
  value: string;
  onChange: (value: string) => void;
  onFilterChange?: (filter: string) => void;
}

export function CatalogQuickFilter({ value, onChange, onFilterChange }: CatalogQuickFilterProps) {
  return (
    <div className="space-y-2 mb-4">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0B1E3D]/40" />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar no catálogo..."
          className="pl-9 text-sm border-[#0B1E3D]/20 focus:border-[#FFD479]"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2">
        <Select onValueChange={onFilterChange}>
          <SelectTrigger className="h-8 text-xs border-[#0B1E3D]/20">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3 h-3" />
              <SelectValue placeholder="Filtrar" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="active">Personagens Ativos</SelectItem>
            <SelectItem value="cases-open">Casos Abertos</SelectItem>
            <SelectItem value="locations-main">Locais Principais</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
