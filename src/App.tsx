import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import DashboardView from "./components/DashboardView";
import DealsView from "./components/DealsView";
import AddDeal from "./pages/AddDeal";
import ClientsView from "./pages/ClientsView";
import ClientDetailView from "./pages/ClientDetailView";
import ChallengeView from "./pages/ChallengeView";
import StatsView from "./pages/StatsView";
import ProfilView from "./pages/ProfilView";
import TrackRecordView from "./pages/TrackRecordView";
import SettingsView from "./pages/SettingsView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/track/:id" element={<TrackRecordView />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="clients" element={<ClientsView />} />
            <Route path="clients/:id" element={<ClientDetailView />} />
            <Route path="challenges/:id" element={<ChallengeView />} />
            <Route path="deals" element={<DealsView />} />
            <Route path="deals/new" element={<AddDeal />} />
            <Route path="stats" element={<StatsView />} />
            <Route path="profil" element={<ProfilView />} />
            <Route path="settings" element={<SettingsView />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
