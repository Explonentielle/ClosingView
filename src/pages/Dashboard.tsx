import { useState, useMemo } from "react";
import { Calendar } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import ObjectiveBar from "@/components/dashboard/ObjectiveBar";
import InteractiveChart from "@/components/dashboard/InteractiveChart";
import { Range, statsData, closingRateData, commissionsData, monthLabels, objectives } from "@/data/mocks";

const RANGES: Range[] = ["7j", "30j", "3m", "1a"];

const Dashboard = () => {
  const [range, setRange] = useState<Range>("30j");
  const d = statsData[range];

  const commAvg = useMemo(() => Math.round(commissionsData.reduce((s, v) => s + v, 0) / commissionsData.length), []);
  const trendComm = 18;

  return (
    <div className="animate-fade-in space-y-5 max-w-[1280px]">
      {/* Filtres temporels */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex border-hair rounded-[10px] overflow-hidden" style={{ borderColor: "#2a3a50" }}>
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className="px-3.5 h-8 text-[11px] font-bold transition-150"
              style={{
                background: range === r ? "#0EFF9C" : "transparent",
                color: range === r ? "#0D1117" : "#8892a0",
              }}
            >
              {r}
            </button>
          ))}
          <button
            className="px-2.5 h-8 flex items-center justify-center border-l-[0.5px]"
            style={{ borderColor: "#2a3a50", color: "#8892a0" }}
            title="Date personnalisée"
          >
            <Calendar size={13} />
          </button>
        </div>
      </div>

      {/* 4 KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard label="Cash généré"  value={d.cash}        badge={{ text: `+${d.cashTrend}%`, tone: "green", dir: "up" }} />
        <KpiCard label="Nb. closes"   value={String(d.closes)} sub="ce mois" />
        <KpiCard label="Taux closing" value={d.taux}        badge={{ text: `${d.closingTrend}pt`, tone: "yellow", dir: "down" }} />
        <KpiCard label="Commissions"  value={d.commissions} sub="20% comm." valueColor="#0EFF9C" />
      </div>

      {/* 3 Objectifs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {objectives.map((o) => (
          <ObjectiveBar
            key={o.label}
            label={o.label}
            pct={o.pct}
            display={o.display}
            color={o.color as "green" | "yellow" | "blue"}
          />
        ))}
      </div>

      {/* 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <InteractiveChart
          title="Taux de Closing"
          data={closingRateData}
          color="#0EFF9C"
          badgeFormatter={(avg, hv) =>
            hv !== undefined ? `${hv}%` : `Moy. ${Math.round(avg)}%`
          }
          monthLabels={monthLabels}
          activeMonthIndex={4}
        />
        <InteractiveChart
          title="Commissions"
          data={commissionsData}
          color="#EFB027"
          badgeFormatter={(_, hv) =>
            hv !== undefined ? `${hv.toLocaleString("fr-FR")}€` : `+${trendComm}%`
          }
          monthLabels={monthLabels}
          activeMonthIndex={4}
        />
      </div>
    </div>
  );
};

export default Dashboard;
