import { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Auth } from "@/pages/Auth";
import { Dashboard } from "@/pages/Dashboard";
import { UniverseView } from "@/pages/UniverseView";
import { Navigation } from './components/Navigation';
import { HomePage } from './components/HomePage';
import { EnhancedUniversePage } from './components/EnhancedUniversePage';
import { AboutPage } from './components/AboutPage';
import { DocumentationPage } from './components/DocumentationPage';
import { ContactPage } from './components/ContactPage';
import { motion, AnimatePresence } from 'motion/react';

type Page = 'inicio' | 'universos' | 'sobre' | 'documentacao' | 'contato';

function MainApp() {
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState<Page>('inicio');
  const [selectedUniverse, setSelectedUniverse] = useState<string | null>(null);

  // Only show navigation on non-auth/dashboard pages
  const showNavigation = !location.pathname.startsWith('/auth') && 
                         !location.pathname.startsWith('/dashboard') && 
                         !location.pathname.startsWith('/universe/');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    setSelectedUniverse(null);
  };

  const handleSelectUniverse = (universeId: string) => {
    setSelectedUniverse(universeId);
    setCurrentPage('universos');
  };

  const handleBackFromUniverse = () => {
    setSelectedUniverse(null);
    setCurrentPage('inicio');
  };

  return (
    <>
      {showNavigation && <Navigation currentPage={currentPage} onNavigate={handleNavigate} />}
      
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/universe/:id" element={<UniverseView />} />
        <Route path="/" element={
          <div className="min-h-screen">
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
        } />
      </Routes>
      <Toaster />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <MainApp />
    </BrowserRouter>
  );
}

export default App;
