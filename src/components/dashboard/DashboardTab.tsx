import { Phone, PhoneForwarded, Clock, Trophy, DollarSign, Percent } from "lucide-react";

const kpis = [
  { label: "CALLS R1", value: "18", sub: "+3 ce mois", subColor: "text-primary", icon: Phone, highlight: false },
  { label: "CALLS R2", value: "9", sub: "50% conv. R1", subColor: "text-muted-foreground", icon: PhoneForwarded, highlight: false },
  { label: "FOLLOW UP", value: "4", sub: "En attente", subColor: "text-muted-foreground", icon: Clock, highlight: false },
  { label: "CLOSES", value: "6", sub: "Record mois", subColor: "text-primary", icon: Trophy, highlight: false },
  { label: "CASH COLLECTÉ", value: "7 400€", sub: "Comm: 740€", subColor: "text-muted-foreground", icon: DollarSign, highlight: false },
  { label: "CLOSING %", value: "33%", sub: "Top 20%", subColor: "text-primary", icon: Percent, highlight: true },
];

const DashboardTab = () => {
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

      {/* Section B — Commissions */}
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
              { label: "R1 Plan.", value: "4", color: "text-foreground" },
              { label: "R1 Eff.", value: "3", color: "text-primary" },
              { label: "R2 Plan.", value: "2", color: "text-foreground" },
              { label: "R2 Eff.", value: "1", color: "text-primary" },
              { label: "Closes", value: "1", color: "text-primary" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-[10px] text-muted-foreground">{s.label}</div>
                <div className={`text-base font-bold ${s.color}`}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardTab;
