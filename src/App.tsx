import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { EnhancedUniversePage } from './components/EnhancedUniversePage';
import { AboutPage } from './components/AboutPage';
import { DocumentationPage } from './components/DocumentationPage';
import { ContactPage } from './components/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Toaster } from './components/ui/sonner';

type Page = 'inicio' | 'universos' | 'sobre' | 'documentacao' | 'contato' | 'admin';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('inicio');
  const [selectedUniverse, setSelectedUniverse] = useState<string | null>(null);

  // Check for /admin route on mount
  useEffect(() => {
    const path = window.location.pathname;
    if (path === '/admin') {
      setCurrentPage('admin');
    }
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    setSelectedUniverse(null);
    
    // Update URL for admin
    if (page === 'admin') {
      window.history.pushState({}, '', '/admin');
    } else {
      window.history.pushState({}, '', '/');
    }
  };

  const handleSelectUniverse = (universeId: string) => {
    setSelectedUniverse(universeId);
    setCurrentPage('universos');
  };

  const handleBackFromUniverse = () => {
    setSelectedUniverse(null);
    setCurrentPage('inicio');
  };

  // Render admin dashboard without navigation
  if (currentPage === 'admin') {
    return (
      <>
        <AdminDashboard />
        <Toaster />
      </>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
      <Toaster />
      
      <div className="animate-fade-in">
        {currentPage === 'inicio' && !selectedUniverse && (
          <HomePage onSelectUniverse={handleSelectUniverse} />
        )}

        {currentPage === 'universos' && selectedUniverse && (
          <EnhancedUniversePage 
            universeId={selectedUniverse} 
            onBack={handleBackFromUniverse}
          />
        )}

        {currentPage === 'sobre' && (
          <AboutPage />
        )}

        {currentPage === 'documentacao' && (
          <DocumentationPage />
        )}

        {currentPage === 'contato' && (
          <ContactPage />
        )}
      </div>
    </div>
  );
}

export default App;
