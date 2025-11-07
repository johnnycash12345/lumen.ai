import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AdminLogin } from './AdminLogin';
import { DashboardLayout } from '@/components/admin/DashboardLayout';
import { DashboardOverview } from '@/components/admin/DashboardOverview';
import { UniversesList } from '@/components/admin/UniversesList';
import { UploadPDF } from '@/components/admin/UploadPDF';
import { Settings } from '@/components/admin/Settings';
import { AdminProfile } from '@/components/admin/AdminProfile';
import { User } from '@supabase/supabase-js';
import { toast } from 'sonner';

type Page = 'dashboard' | 'universes' | 'upload' | 'settings' | 'profile';

export function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await verifyAdmin(session.user);
        } else {
          setUser(null);
          setIsAdmin(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await verifyAdmin(session.user);
      }
    } catch (error: any) {
      toast.error('Erro ao verificar autenticação');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyAdmin = async (user: User) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (error) {
      console.error('Error verifying admin:', error);
      setIsAdmin(false);
      setUser(null);
      return;
    }

    if (data) {
      setUser(user);
      setIsAdmin(true);
    } else {
      setUser(null);
      setIsAdmin(false);
      await supabase.auth.signOut();
      toast.error('Acesso negado. Apenas administradores podem acessar.');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setIsAdmin(false);
    toast.success('Logout realizado com sucesso');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F4ED]">
        <div className="text-[#0B1E3D]">Carregando...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <AdminLogin onLoginSuccess={() => setIsLoading(false)} />;
  }

  return (
    <DashboardLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
      onLogout={handleLogout}
      user={user}
    >
      {currentPage === 'dashboard' && <DashboardOverview />}
      {currentPage === 'universes' && <UniversesList />}
      {currentPage === 'upload' && <UploadPDF />}
      {currentPage === 'settings' && <Settings />}
      {currentPage === 'profile' && <AdminProfile user={user} />}
    </DashboardLayout>
  );
}
