import { useState } from "react";
import DashboardTab from "./dashboard/DashboardTab";
import KpiDailyHistoryTab from "./dashboard/KpiDailyHistoryTab";
import KpiWeeklyTab from "./dashboard/KpiWeeklyTab";
import KpiDailyModal from "./dashboard/KpiDailyModal";
import KpiWeeklyModal from "./dashboard/KpiWeeklyModal";

const tabs = [
  { key: "dashboard", label: "Dashboard" },
  { key: "kpiDaily", label: "KPI Daily" },
  { key: "kpiWeekly", label: "KPI Weekly" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const DashboardView = () => {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showWeeklyModal, setShowWeeklyModal] = useState(false);

  return (
    <div className="animate-slide-up max-w-[1440px] mx-auto space-y-4">
      {/* Tab bar + action buttons */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        {/* Tabs */}
        <div className="flex gap-1 p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === t.key
                  ? "bg-primary/15 text-primary border border-primary/25"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Action buttons — only on Dashboard tab */}
        {activeTab === "dashboard" && (
          <div className="flex gap-2">
            <button
              onClick={() => setShowDailyModal(true)}
              className="flex items-center gap-2.5 px-[18px] py-[10px] rounded-[10px] bg-card border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 hover:border-primary transition-all"
            >
              <span className="w-[18px] h-[18px] rounded-[5px] bg-primary/15 flex items-center justify-center text-[11px] font-bold text-primary">
                D
              </span>
              KPI Daily
            </button>
            <button
              onClick={() => setShowWeeklyModal(true)}
              className="flex items-center gap-2.5 px-[18px] py-[10px] rounded-[10px] bg-card border border-warning/30 text-warning text-sm font-medium hover:bg-warning/10 hover:border-warning transition-all"
            >
              <span className="w-[18px] h-[18px] rounded-[5px] bg-warning/15 flex items-center justify-center text-[11px] font-bold text-warning">
                W
              </span>
              KPI Weekly
            </button>
          </div>
        )}
      </div>

      {/* Tab content */}
      <div key={activeTab} className="animate-fade-in">
        {activeTab === "dashboard" && <DashboardTab />}
        {activeTab === "kpiDaily" && <KpiDailyHistoryTab />}
        {activeTab === "kpiWeekly" && <KpiWeeklyTab />}
      </div>

      {/* Modals */}
      <KpiDailyModal open={showDailyModal} onClose={() => setShowDailyModal(false)} />
      <KpiWeeklyModal open={showWeeklyModal} onClose={() => setShowWeeklyModal(false)} />
    </div>
  );
};

export default DashboardView;
