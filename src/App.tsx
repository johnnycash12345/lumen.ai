import { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { EnhancedUniversePage } from './components/EnhancedUniversePage';
import { AboutPage } from './components/AboutPage';
import { DocumentationPage } from './components/DocumentationPage';
import { ContactPage } from './components/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { Toaster } from './components/ui/sonner';
import { motion, AnimatePresence } from 'motion/react';

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
      
      <AnimatePresence mode="wait">
        {currentPage === 'inicio' && !selectedUniverse && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <HomePage onSelectUniverse={handleSelectUniverse} />
          </motion.div>
        )}

        {currentPage === 'universos' && selectedUniverse && (
          <motion.div
            key="universe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EnhancedUniversePage 
              universeId={selectedUniverse} 
              onBack={handleBackFromUniverse}
            />
          </motion.div>
        )}

        {currentPage === 'sobre' && (
          <motion.div
            key="about"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AboutPage />
          </motion.div>
        )}

        {currentPage === 'documentacao' && (
          <motion.div
            key="documentation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <DocumentationPage />
          </motion.div>
        )}

        {currentPage === 'contato' && (
          <motion.div
            key="contact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ContactPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
