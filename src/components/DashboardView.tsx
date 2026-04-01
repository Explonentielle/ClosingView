import { useState } from "react";
import DashboardTab from "./dashboard/DashboardTab";
import KpiJournalierTab from "./dashboard/KpiJournalierTab";
import WeeklyNotebookTab from "./dashboard/WeeklyNotebookTab";

const tabs = [
  { key: "dashboard", label: "Dashboard" },
  { key: "kpi", label: "KPI Journalier" },
  { key: "weekly", label: "Weekly Notebook" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const DashboardView = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");

  return (
    <div className="animate-slide-up max-w-[1440px] mx-auto space-y-4">
      {/* Tab bar */}
      <div className="flex gap-1 bg-card rounded-xl p-1 border border-border/50 w-fit">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === t.key
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div key={activeTab} className="animate-fade-in">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "kpi" && <KpiJournalierTab />}
        {activeTab === "weekly" && <WeeklyNotebookTab />}
      </div>
    </div>
  );
};

export default DashboardView;
