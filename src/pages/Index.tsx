import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import DashboardView from "@/components/DashboardView";
import MapView from "@/components/MapView";
import GoalsView from "@/components/GoalsView";
import LeaderboardView from "@/components/LeaderboardView";
import RewardsView from "@/components/RewardsView";
import DealsView from "@/components/DealsView";
import EcosystemsView from "@/components/EcosystemsView";

const views: Record<string, React.FC> = {
  dashboard: DashboardView,
  deals: DealsView,
  map: MapView,
  goals: GoalsView,
  leaderboard: LeaderboardView,
  rewards: RewardsView,
  ecosystems: EcosystemsView,
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const ActiveView = views[activeTab] || DashboardView;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 overflow-y-auto p-6 lg:p-8">
        <ActiveView />
      </main>
    </div>
  );
};

export default Index;
