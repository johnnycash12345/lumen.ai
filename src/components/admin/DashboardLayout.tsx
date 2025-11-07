import { ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import {
  LayoutDashboard,
  BookOpen,
  Upload,
  Settings as SettingsIcon,
  User as UserIcon,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/components/ui/utils';

interface DashboardLayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: any) => void;
  onLogout: () => void;
  user: User;
}

export function DashboardLayout({
  children,
  currentPage,
  onNavigate,
  onLogout,
  user,
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'universes', label: 'Universos', icon: BookOpen },
    { id: 'upload', label: 'Upload PDF', icon: Upload },
    { id: 'settings', label: 'Configurações', icon: SettingsIcon },
    { id: 'profile', label: 'Perfil', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen bg-[#F8F4ED] flex">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-64 bg-white border-r border-[#0B1E3D]/10 flex-col">
        <div className="p-6 border-b border-[#0B1E3D]/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FFD479] rounded-full flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[#0B1E3D]" />
            </div>
            <div>
              <h1 className="text-lg font-['Playfair_Display'] text-[#0B1E3D]">
                Lumen Admin
              </h1>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                currentPage === item.id
                  ? 'bg-[#FFD479] text-[#0B1E3D]'
                  : 'text-[#0B1E3D]/70 hover:bg-[#0B1E3D]/5'
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#0B1E3D]/10">
          <Button
            onClick={onLogout}
            variant="ghost"
            className="w-full justify-start text-[#0B1E3D]/70 hover:text-[#0B1E3D]"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </Button>
        </div>
      </aside>

      {/* Sidebar Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-64 bg-white flex flex-col">
            <div className="p-6 border-b border-[#0B1E3D]/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FFD479] rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-[#0B1E3D]" />
                </div>
                <h1 className="text-lg font-['Playfair_Display'] text-[#0B1E3D]">
                  Lumen Admin
                </h1>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="text-[#0B1E3D]/70 hover:text-[#0B1E3D]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    setSidebarOpen(false);
                  }}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    currentPage === item.id
                      ? 'bg-[#FFD479] text-[#0B1E3D]'
                      : 'text-[#0B1E3D]/70 hover:bg-[#0B1E3D]/5'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="p-4 border-t border-[#0B1E3D]/10">
              <Button
                onClick={onLogout}
                variant="ghost"
                className="w-full justify-start text-[#0B1E3D]/70 hover:text-[#0B1E3D]"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Sair
              </Button>
            </div>
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="bg-white border-b border-[#0B1E3D]/10 p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-[#0B1E3D]"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right">
              <p className="text-sm font-medium text-[#0B1E3D]">
                {user.email}
              </p>
              <p className="text-xs text-[#0B1E3D]/70">Administrador</p>
            </div>
            <div className="w-10 h-10 bg-[#FFD479] rounded-full flex items-center justify-center">
              <UserIcon className="w-5 h-5 text-[#0B1E3D]" />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
