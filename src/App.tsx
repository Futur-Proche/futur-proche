import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";

import Index from "./pages/Index";
import Communaute from "./pages/Communaute";
import Evenements from "./pages/Evenements";
import EvenementDetail from "./pages/EvenementDetail";
import EvenementSuccess from "./pages/EvenementSuccess";
import Ressources from "./pages/Ressources";
import RessourceDetail from "./pages/RessourceDetail";
import Partenaires from "./pages/Partenaires";
import APropos from "./pages/APropos";
import Candidater from "./pages/Candidater";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Carte from "./pages/Carte";
import NotFound from "./pages/NotFound";

import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCandidatures from "./pages/admin/AdminCandidatures";
import AdminMembres from "./pages/admin/AdminMembres";
import AdminEvenements from "./pages/admin/AdminEvenements";
import AdminRessources from "./pages/admin/AdminRessources";

import MembreLayout from "./components/membre/MembreLayout";
import MembreDashboard from "./pages/membre/MembreDashboard";
import MembreProfil from "./pages/membre/MembreProfil";
import MembreAnnuaire from "./pages/membre/MembreAnnuaire";
import MembreEvenements from "./pages/membre/MembreEvenements";
import MembreRessources from "./pages/membre/MembreRessources";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public */}
            <Route path="/" element={<Index />} />
            <Route path="/communaute" element={<Communaute />} />
            <Route path="/evenements" element={<Evenements />} />
            <Route path="/evenements/:slug" element={<EvenementDetail />} />
            <Route path="/evenements/:slug/success" element={<EvenementSuccess />} />
            <Route path="/ressources" element={<Ressources />} />
            <Route path="/partenaires" element={<Partenaires />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/candidater" element={<Candidater />} />
            <Route path="/carte" element={<Carte />} />
            <Route path="/login" element={<Login />} />
            <Route path="/mot-de-passe-oublie" element={<ForgotPassword />} />
            <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />


            {/* Admin */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminLayout /></ProtectedRoute>}>
              <Route index element={<AdminDashboard />} />
              <Route path="candidatures" element={<AdminCandidatures />} />
              <Route path="membres" element={<AdminMembres />} />
              <Route path="evenements" element={<AdminEvenements />} />
              <Route path="ressources" element={<AdminRessources />} />
            </Route>

            {/* Espace membre */}
            <Route path="/espace-membre" element={<ProtectedRoute><MembreLayout /></ProtectedRoute>}>
              <Route index element={<MembreDashboard />} />
              <Route path="profil" element={<MembreProfil />} />
              <Route path="annuaire" element={<MembreAnnuaire />} />
              <Route path="evenements" element={<MembreEvenements />} />
              <Route path="ressources" element={<MembreRessources />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
