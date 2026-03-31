import { useState } from "react";
import { Phone, PhoneForwarded, Clock, Trophy, DollarSign, Percent } from "lucide-react";

const kpis = [
  { label: "CALLS R1", value: "18", sub: "+3 ce mois", subColor: "text-primary", icon: Phone, highlight: false },
  { label: "CALLS R2", value: "9", sub: "50% conv. R1", subColor: "text-muted-foreground", icon: PhoneForwarded, highlight: false },
  { label: "FOLLOW UP", value: "4", sub: "En attente", subColor: "text-muted-foreground", icon: Clock, highlight: false },
  { label: "CLOSES", value: "6", sub: "Record mois", subColor: "text-primary", icon: Trophy, highlight: false },
  { label: "CASH COLLECTÉ", value: "7 400€", sub: "Comm: 740€", subColor: "text-muted-foreground", icon: DollarSign, highlight: false },
  { label: "CLOSING %", value: "33%", sub: "Top 20%", subColor: "text-primary", icon: Percent, highlight: true },
];

const calendarDeals: Record<number, number> = {
  3: 800, 5: 1200, 10: 1500, 14: 900, 17: 1800, 31: 300,
};

const weekDays = ["L", "M", "M", "J", "V", "S", "D"];

// March 2026 starts on Sunday (day 0), so offset = 6 (Sun at end of week in Mon-start grid)
const firstDayOffset = 6; // March 1, 2026 is Sunday → index 6 in Mon-start week
const totalDays = 31;

const weeklyData = [
  { label: "S1", value: "2 000€", active: true },
  { label: "S2", value: "2 400€", active: true },
  { label: "S3", value: "1 800€", active: true },
  { label: "S4", value: "0€", active: false },
];

const quotes = [
  "The deal is won before the call.",
  "Chaque non t'approche d'un oui.",
  "La tonalité fait le closing.",
  "Prépare tes objections la veille.",
  "Un closer ne vend pas, il résout.",
];

const cumulativePoints = [
  { x: 0, y: 0 },
  { x: 3, y: 800 },
  { x: 5, y: 2000 },
  { x: 10, y: 3500 },
  { x: 14, y: 4400 },
  { x: 17, y: 6200 },
  { x: 31, y: 7400 },
];

const DashboardView = () => {
  const [_q] = useState(0);

  // Build calendar grid cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  // SVG chart helpers
  const chartW = 800;
  const chartH = 160;
  const maxY = 7400;
  const toX = (day: number) => (day / 31) * chartW;
  const toY = (val: number) => chartH - (val / maxY) * (chartH - 20);
  const pathD = cumulativePoints.map((p, i) => `${i === 0 ? "M" : "L"}${toX(p.x)},${toY(p.y)}`).join(" ");
  const areaD = `${pathD} L${toX(31)},${chartH} L0,${chartH} Z`;

  return (
    <div className="space-y-3 animate-slide-up max-w-[1440px] mx-auto">
      {/* Section 1 — KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {kpis.map((k) => (
          <div
            key={k.label}
            className="rounded-[10px] p-4"
            style={{
              background: "#111827",
              border: k.highlight ? "2px solid hsl(var(--primary))" : "0.5px solid #1e2530",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <k.icon size={13} className="text-muted-foreground" />
              <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">{k.label}</span>
            </div>
            <p className={`text-2xl font-bold ${k.label === "CASH COLLECTÉ" ? "text-primary text-xl" : "text-foreground"}`}>
              {k.value}
            </p>
            <p className={`text-[11px] mt-0.5 ${k.subColor}`}>{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Section 2 — Calendar + Score */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-3">
        {/* Calendar */}
        <div className="rounded-[12px] p-5" style={{ background: "#111827", border: "0.5px solid #1e2530" }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">Mars 2026</h3>
            <span className="text-[11px] text-primary font-medium">7 400€ — 6 jours actifs</span>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map((d, i) => (
              <div key={i} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={i} />;
              const deal = calendarDeals[day];
              const isToday = day === 31;
              return (
                <div
                  key={i}
                  className="rounded-lg text-center py-1.5 px-0.5"
                  style={{
                    background: deal ? "#0F3020" : "#1a1f2e",
                    border: isToday ? "1px solid hsl(var(--primary))" : "none",
                    minHeight: 40,
                  }}
                >
                  <div className={`text-[10px] ${deal ? "text-primary" : "text-muted-foreground"}`}>{day}</div>
                  <div className={`text-[10px] font-medium ${deal ? "text-primary" : "text-muted-foreground"}`}>
                    {deal ? `${deal}€` : "0€"}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: "#0F3020" }} />
              <span className="text-[10px] text-muted-foreground">Deal closé</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: "#1a1f2e" }} />
              <span className="text-[10px] text-muted-foreground">Pas de close</span>
            </div>
          </div>
        </div>

        {/* Score Column */}
        <div className="flex flex-col gap-3">
          {/* CloseOne Score */}
          <div className="rounded-[12px] p-4" style={{ background: "#111827", border: "0.5px solid #1e2530" }}>
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">CloseOne Score</span>
            <p className="text-4xl font-bold text-primary mt-1">68</p>
            <div className="h-1.5 rounded-full mt-2" style={{ background: "#1e2530" }}>
              <div className="h-full rounded-full bg-primary" style={{ width: "68%" }} />
            </div>
            <p className="text-[11px] text-primary mt-1.5">Closer Confirmé</p>
          </div>

          {/* Per Week */}
          <div className="rounded-[12px] p-4" style={{ background: "#111827", border: "0.5px solid #1e2530" }}>
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">Par Semaine</span>
            <div className="mt-2 space-y-1.5">
              {weeklyData.map((w) => (
                <div key={w.label} className="flex justify-between">
                  <span className="text-[11px] text-muted-foreground">{w.label}</span>
                  <span className={`text-[11px] font-semibold ${w.active ? "text-primary" : "text-muted-foreground"}`}>{w.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 3 — Cumulative Cash Chart */}
      <div className="rounded-[12px] p-5" style={{ background: "#111827", border: "0.5px solid #1e2530" }}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-semibold text-foreground">Cash collecté cumulé</h3>
          <span className="text-lg font-bold text-primary">7 400€</span>
        </div>
        <svg viewBox={`0 0 ${chartW} ${chartH}`} className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(155,100%,50%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(155,100%,50%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaD} fill="url(#areaGrad)" />
          <path d={pathD} fill="none" stroke="hsl(155,100%,50%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          {cumulativePoints.slice(1).map((p, i) => (
            <circle key={i} cx={toX(p.x)} cy={toY(p.y)} r="3" fill="hsl(155,100%,50%)" />
          ))}
        </svg>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">1 mars</span>
          <span className="text-[10px] text-muted-foreground">15 mars</span>
          <span className="text-[10px] text-muted-foreground">31 mars</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
