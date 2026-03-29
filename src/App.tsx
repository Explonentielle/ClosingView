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
import MapView from "./components/MapView";
import GoalsView from "./components/GoalsView";
import LeaderboardView from "./components/LeaderboardView";
import RewardsView from "./components/RewardsView";
import EcosystemsView from "./components/EcosystemsView";
import SettingsView from "./pages/SettingsView";
import ProfileView from "./pages/ProfileView";
import ClimbView from "./pages/ClimbView";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardView />} />
            <Route path="deals" element={<DealsView />} />
            <Route path="deals/new" element={<AddDeal />} />
            <Route path="map" element={<MapView />} />
            <Route path="goals" element={<GoalsView />} />
            <Route path="leaderboard" element={<LeaderboardView />} />
            <Route path="rewards" element={<RewardsView />} />
            <Route path="ecosystems" element={<EcosystemsView />} />
            <Route path="settings" element={<SettingsView />} />
            <Route path="profile" element={<ProfileView />} />
            <Route path="climb" element={<ClimbView />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
