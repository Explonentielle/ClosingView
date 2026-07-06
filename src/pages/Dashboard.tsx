import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import KpiCard from "@/components/dashboard/KpiCard";
import ObjectiveBar from "@/components/dashboard/ObjectiveBar";
import InteractiveChart from "@/components/dashboard/InteractiveChart";
import DatePickerFilter from "@/components/dashboard/DatePickerFilter";
import StreakBanner from "@/components/dashboard/StreakBanner";
import { Range, monthLabels, objectives } from "@/data/mocks";
import { useUserStats } from "@/hooks/useUserStats";
import { aggregateStatsData, defaultChartData } from "@/lib/data";
import { responsiveClass } from "@/lib/responsive";
import * as S from './Dashboard.styles';

const RANGES: Range[] = ["7j", "30j", "3m", "1a"];

const Dashboard = () => {
  const [range, setRange] = useState<Range>("30j");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const isCustom = !!(customRange?.from && customRange?.to);

  const { stats, loading, error } = useUserStats();
  const d = aggregateStatsData(stats, range);

  const commAvg = useMemo(() => {
    const data = defaultChartData.commissions;
    return Math.round(data.reduce((s, v) => s + v, 0) / data.length);
  }, []);
  const trendComm = 18;

  if (error) {
    return (
      <div className="animate-fade-in max-w-[1280px] p-4 rounded-lg bg-red-500/10 border border-red-500/50">
        <p className="text-red-400">Erreur lors du chargement des stats: {error}</p>
      </div>
    );
  }

  return (
    <div className={`animate-fade-in space-y-5 ${responsiveClass.mainContainer}`}>
      {loading && (
        <div className="p-3 sm:p-4 rounded-lg bg-blue-500/10 border border-blue-500/50">
          <p className="text-blue-400 text-[12px] sm:text-[13px]">Chargement de vos stats...</p>
        </div>
      )}
      <StreakBanner />

      {/* Filtres temporels */}
      <div className="flex items-center gap-2 flex-wrap">
        <div
          className="flex border-hair rounded-[10px] overflow-hidden"
          style={S.rangeContainer(isCustom)}
        >
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => !isCustom && setRange(r)}
              className="px-2 sm:px-3.5 h-7 sm:h-8 text-[10px] sm:text-[11px] font-bold transition-150"
              style={S.rangeButtonStyle(!isCustom && range === r, isCustom)}
            >
              {r}
            </button>
          ))}
        </div>
        <DatePickerFilter onRangeSelect={setCustomRange} />
      </div>

      {/* 4 KPI */}
      <div className={responsiveClass.gridCols1to4}>
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
          data={defaultChartData.closingRate}
          color="#0EFF9C"
          badgeFormatter={(avg, hv) =>
            hv !== undefined ? `${hv}%` : `Moy. ${Math.round(avg)}%`
          }
          monthLabels={monthLabels}
          activeMonthIndex={4}
        />
        <InteractiveChart
          title="Commissions"
          data={defaultChartData.commissions}
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
