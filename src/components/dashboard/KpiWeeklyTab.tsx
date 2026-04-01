const currentWeekObjectives = [
  { label: "Objectif R1", target: "10", current: "8 effectués", pct: 80 },
  { label: "Objectif Closes", target: "3", current: "2 closés", pct: 66 },
  { label: "Objectif CA", target: "4 000€", current: "1 800€", pct: 45 },
  { label: "Objectif Closing %", target: "35%", current: "Actuel 33%", pct: 94 },
];

const bilanData = [
  { label: "R1", obj: "10", real: "8", detail: "80% atteint", pct: 80 },
  { label: "Closes", obj: "3", real: "3", detail: "100% atteint", pct: 100 },
  { label: "CA", obj: "4 000€", real: "4 200€", detail: "Dépassé", pct: 105 },
  { label: "Closing %", obj: "35%", real: "37%", detail: "Dépassé", pct: 106 },
];

const getColor = (pct: number) => {
  if (pct >= 100) return "text-primary";
  if (pct >= 70) return "text-warning";
  return "text-muted-foreground";
};

const KpiWeeklyTab = () => {
  return (
    <div className="space-y-4">
      {/* Current week */}
      <div className="rounded-xl p-5 bg-card border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-foreground">Semaine 13 — Objectifs</h3>
            <p className="text-[13px] text-muted-foreground">24 – 31 mars 2026</p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full border border-primary/25 bg-primary/10 text-primary font-medium">
            En cours
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {currentWeekObjectives.map((o) => (
            <div key={o.label} className="rounded-[10px] p-3 bg-background">
              <span className="text-[10px] text-muted-foreground uppercase">{o.label}</span>
              <p className="text-lg font-bold text-foreground mt-0.5">{o.target}</p>
              <p className={`text-[11px] font-medium ${getColor(o.pct)}`}>
                {o.current} — {o.pct}%
              </p>
            </div>
          ))}
        </div>

        {/* Focus areas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div className="rounded-[10px] p-3 bg-background">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Focus 1</span>
            <p className="text-sm text-foreground mt-1">Améliorer mon taux de conversion R1 → R2</p>
          </div>
          <div className="rounded-[10px] p-3 bg-background">
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Focus 2</span>
            <p className="text-sm text-foreground mt-1">Traiter les objections prix sans baisser</p>
          </div>
        </div>
      </div>

      {/* Previous week review */}
      <div className="rounded-xl p-5 bg-card border border-border/50">
        <h3 className="text-base font-semibold text-foreground">Bilan — Semaine 12</h3>
        <p className="text-[13px] text-muted-foreground mt-0.5">17 – 23 mars 2026</p>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {bilanData.map((b) => (
            <div key={b.label} className="rounded-[10px] p-3" style={{ background: "#0F3020" }}>
              <span className="text-[10px] text-muted-foreground uppercase">{b.label}</span>
              <p className={`text-lg font-bold mt-0.5 ${getColor(b.pct)}`}>
                {b.real} / {b.obj}
              </p>
              <p className={`text-[11px] font-medium ${getColor(b.pct)}`}>{b.detail}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-[10px] p-3 bg-primary/10 border border-primary/25">
          <p className="text-[13px] font-bold text-primary">Félicitations cette semaine</p>
          <p className="text-[12px] text-foreground mt-1 leading-relaxed">
            Tu as augmenté ton cash collecté de +12% vs la semaine précédente.
            Ton taux de closing dépasse ton objectif pour la 2e semaine consécutive. 🚀
          </p>
        </div>
      </div>
    </div>
  );
};

export default KpiWeeklyTab;
