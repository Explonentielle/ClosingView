import { useState, useMemo, useEffect } from "react";
import { DateRange } from "react-day-picker";
import KpiCard from "@/components/dashboard/KpiCard";
import ObjectiveBar from "@/components/dashboard/ObjectiveBar";
import InteractiveChart from "@/components/dashboard/InteractiveChart";
import DatePickerFilter from "@/components/dashboard/DatePickerFilter";
import StreakBanner from "@/components/dashboard/StreakBanner";
import DailyEntriesHistory from "@/components/dashboard/DailyEntriesHistory";
import { Range, monthLabels } from "@/data/mocks";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { getChartData, getDashboardStats, getDailyEntriesHistory } from "@/services";
import type { DailyEntryHistoryRow } from "@/services";
import { responsiveClass } from "@/lib/responsive";
import * as S from './Dashboard.styles';

const RANGES: Range[] = ["7j", "30j", "3m", "1a"];
const RANGE_DAYS: Record<Range, number> = { "7j": 7, "30j": 30, "3m": 90, "1a": 365 };

const Dashboard = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [range, setRange] = useState<Range>("30j");
  const [customRange, setCustomRange] = useState<DateRange | undefined>();
  const isCustom = !!(customRange?.from && customRange?.to);

  const [d, setD] = useState({ closes: 0, taux: '0%', cash: '0€', commissions: '0€', commRatePct: 20, cashTrend: 0, closingTrend: 0 });
  const [loading, setLoading] = useState(true);
  const targetCash = profile?.target_cash_monthly ?? 15000;
  const targetCloses = profile?.target_closes_monthly ?? 10;

  const [chartData, setChartData] = useState({ closingRateData: [] as number[], commissionsData: [] as number[] });
  const [chartsLoading, setChartsLoading] = useState(true);

  const [entriesHistory, setEntriesHistory] = useState<DailyEntryHistoryRow[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      setChartsLoading(true);
      setHistoryLoading(true);

      const days = RANGE_DAYS[range];
      const rangeOverride = isCustom && customRange?.from && customRange?.to
        ? { from: customRange.from, to: customRange.to }
        : undefined;

      // Fetch dashboard KPI stats
      const stats = await getDashboardStats(user.id, days, rangeOverride);
      setD({
        closes: stats.closes,
        taux: `${stats.taux}%`,
        cash: `${stats.cash.toLocaleString('fr-FR')}€`,
        commissions: `${stats.commissions.toLocaleString('fr-FR')}€`,
        commRatePct: stats.cash > 0 ? Math.round((stats.commissions / stats.cash) * 100) : 20,
        cashTrend: stats.cashTrend,
        closingTrend: stats.closingTrend,
      });

      // Fetch chart data
      const chartDataResult = await getChartData(user.id, days, rangeOverride);
      setChartData(chartDataResult);
      setChartsLoading(false);

      // Fetch daily entries history
      const history = await getDailyEntriesHistory(user.id, days, rangeOverride);
      setEntriesHistory(history);
      setHistoryLoading(false);

      setLoading(false);
    };

    fetchData();
  }, [user, range, isCustom, customRange]);

  const commAvg = useMemo(() => {
    const data = chartData.commissionsData;
    if (data.length === 0) return 0;
    return Math.round(data.reduce((s, v) => s + v, 0) / data.length);
  }, [chartData]);

  const trendComm = useMemo(() => {
    const data = chartData.commissionsData;
    if (data.length < 2) return 0;
    const recent = data[data.length - 1];
    const prev = data[Math.max(0, data.length - 8)];
    return prev > 0 ? Math.round(((recent - prev) / prev) * 100) : 0;
  }, [chartData]);


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
        <KpiCard label="Commissions"  value={d.commissions} sub={`${d.commRatePct}% comm.`} valueColor="#0EFF9C" />
      </div>

      {/* 3 Objectifs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <ObjectiveBar
          label="Cash généré"
          pct={Math.min(100, (d.cash.replace(/[^\d]/g, '') ? parseInt(d.cash.replace(/[^\d]/g, '')) / targetCash * 100 : 0))}
          display={`${d.cash}`}
          color="green"
        />
        <ObjectiveBar
          label="Taux closing"
          pct={Math.min(100, parseInt(d.taux) || 0)}
          display={`${d.taux}`}
          color="yellow"
        />
        <ObjectiveBar
          label="Nb. closes"
          pct={Math.min(100, (d.closes / targetCloses) * 100)}
          display={`${d.closes}/${targetCloses}`}
          color="blue"
        />
      </div>

      {/* 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {chartsLoading ? (
          <>
            <div className="p-4 text-center text-blue-400">Chargement des graphiques...</div>
            <div className="p-4 text-center text-blue-400">Chargement des graphiques...</div>
          </>
        ) : chartData.closingRateData.length === 0 ? (
          <>
            <div className="p-12 text-center rounded-[12px]" style={{ background: "#0a0f1a", borderColor: "#2a3a50", border: "1px solid #2a3a50" }}>
              <p style={{ color: "#8892a0", fontSize: "14px" }}>Aucune donnée pour le moment</p>
              <p style={{ color: "#6b7a99", fontSize: "12px", marginTop: "4px" }}>Saisissez une journée pour voir les graphiques</p>
            </div>
            <div className="p-12 text-center rounded-[12px]" style={{ background: "#0a0f1a", borderColor: "#2a3a50", border: "1px solid #2a3a50" }}>
              <p style={{ color: "#8892a0", fontSize: "14px" }}>Aucune donnée pour le moment</p>
              <p style={{ color: "#6b7a99", fontSize: "12px", marginTop: "4px" }}>Saisissez une journée pour voir les graphiques</p>
            </div>
          </>
        ) : chartData.closingRateData.length === 1 ? (
          <>
            <div className="p-12 text-center rounded-[12px]" style={{ background: "#0a0f1a", borderColor: "#2a3a50", border: "1px solid #2a3a50" }}>
              <p style={{ color: "#8892a0", fontSize: "14px" }}>Besoin de plus de données</p>
              <p style={{ color: "#6b7a99", fontSize: "12px", marginTop: "4px" }}>Ajoutez des saisies pour au moins 2 jours différents</p>
            </div>
            <div className="p-12 text-center rounded-[12px]" style={{ background: "#0a0f1a", borderColor: "#2a3a50", border: "1px solid #2a3a50" }}>
              <p style={{ color: "#8892a0", fontSize: "14px" }}>Besoin de plus de données</p>
              <p style={{ color: "#6b7a99", fontSize: "12px", marginTop: "4px" }}>Ajoutez des saisies pour au moins 2 jours différents</p>
            </div>
          </>
        ) : (
          <>
            <InteractiveChart
              title="Taux de Closing"
              data={chartData.closingRateData}
              color="#0EFF9C"
              badgeFormatter={(avg, hv) =>
                hv !== undefined ? `${hv} closes` : `Moy. ${Math.round(avg)} closes`
              }
              monthLabels={monthLabels}
              activeMonthIndex={chartData.closingRateData.length - 1}
            />
            <InteractiveChart
              title="Commissions"
              data={chartData.commissionsData}
              color="#EFB027"
              badgeFormatter={(_, hv) =>
                hv !== undefined ? `${Math.round(hv).toLocaleString("fr-FR")}€` : `+${trendComm}%`
              }
              monthLabels={monthLabels}
              activeMonthIndex={chartData.commissionsData.length - 1}
            />
          </>
        )}
      </div>

      <DailyEntriesHistory entries={entriesHistory} loading={historyLoading} />
    </div>
  );
};

export default Dashboard;
