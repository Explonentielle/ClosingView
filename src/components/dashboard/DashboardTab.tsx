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
const firstDayOffset = 6;
const totalDays = 31;

const weeklyData = [
  { label: "S1", value: "2 000€", active: true },
  { label: "S2", value: "2 400€", active: true },
  { label: "S3", value: "1 800€", active: true },
  { label: "S4", value: "0€", active: false },
];

const DashboardTab = () => {
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOffset; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <div className="space-y-3">
      {/* Section A — KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {kpis.map((k) => (
          <div
            key={k.label}
            className={`rounded-[10px] p-4 bg-card border ${k.highlight ? "border-primary border-2" : "border-border/50"}`}
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

      {/* Section B — Calendar + Score */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_200px] gap-3">
        {/* Calendar */}
        <div className="rounded-xl p-5 bg-card border border-border/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-foreground">Mars 2026</h3>
            <span className="text-[11px] text-primary font-medium">7 400€ — 6 jours actifs</span>
          </div>
          <div className="grid grid-cols-7 gap-1 mb-1">
            {weekDays.map((d, i) => (
              <div key={i} className="text-center text-[10px] font-medium text-muted-foreground py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((day, i) => {
              if (day === null) return <div key={i} />;
              const deal = calendarDeals[day];
              const isToday = day === 31;
              return (
                <div
                  key={i}
                  className={`rounded-lg text-center py-1.5 px-0.5 ${isToday ? "border border-primary" : ""}`}
                  style={{
                    background: deal ? "#0F3020" : "hsl(var(--muted))",
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
          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm" style={{ background: "#0F3020" }} />
              <span className="text-[10px] text-muted-foreground">Deal closé</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-muted" />
              <span className="text-[10px] text-muted-foreground">Pas de close</span>
            </div>
          </div>
        </div>

        {/* Score Column */}
        <div className="flex flex-col gap-3">
          <div className="rounded-xl p-4 bg-card border border-border/50">
            <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">CloseOne Score</span>
            <p className="text-4xl font-bold text-primary mt-1">68</p>
            <div className="h-1.5 rounded-full mt-2 bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: "68%" }} />
            </div>
            <p className="text-[11px] text-primary mt-1.5 font-bold">Closer Confirmé</p>
          </div>
          <div className="rounded-xl p-4 bg-card border border-border/50">
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

      {/* Section C — Commissions */}
      <div className="rounded-xl p-5 bg-card border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">Avance des commissions mensuelles</h3>
          <span className="text-sm font-bold text-primary">740€ / 2 000€</span>
        </div>

        {/* Bar 1 — Commissions */}
        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-[11px] text-primary">Commissions collectées</span>
            <span className="text-[11px] text-primary font-semibold">740€</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: "37%" }} />
          </div>
        </div>

        {/* Bar 2 — Super Green Goal */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-[11px] text-warning">Super Green Goal</span>
            <span className="text-[11px] text-warning font-semibold">3 000€</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div className="h-full rounded-full bg-warning transition-all duration-700" style={{ width: "25%" }} />
          </div>
        </div>

        {/* Daily Summary */}
        <div className="rounded-[10px] p-3 bg-background">
          <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase">Résumé du jour — 31 mars</span>
          <div className="grid grid-cols-5 gap-2 mt-2">
            {[
              { label: "R1 Plan.", value: "4" },
              { label: "R1 Eff.", value: "3" },
              { label: "R2 Plan.", value: "2" },
              { label: "R2 Eff.", value: "1" },
              { label: "Closes", value: "1" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
                <div className="text-base font-bold text-foreground">{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
