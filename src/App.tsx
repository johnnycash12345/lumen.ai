import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Auth } from "@/pages/Auth";
import { Dashboard } from "@/pages/Dashboard";
import { UniverseView } from "@/pages/UniverseView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/universe/:id" element={<UniverseView />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
