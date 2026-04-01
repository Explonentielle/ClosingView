import { useState } from "react";

const bilanData = [
  { label: "R1", obj: 10, real: 8, pct: 80 },
  { label: "Closes", obj: 3, real: 3, pct: 100 },
  { label: "CA", obj: 4000, real: 4200, pct: 105, isCurrency: true },
  { label: "Closing %", obj: 35, real: 37, pct: 106, isSuffix: "%" },
];

const getColor = (pct: number) => {
  if (pct >= 100) return "text-primary";
  if (pct >= 70) return "text-warning";
  return "text-destructive";
};

const WeeklyNotebookTab = () => {
  const [objectives, setObjectives] = useState({
    r1: 12, closes: 4, ca: 5000, closingPct: 35, focus1: "", focus2: "",
  });

  return (
    <div className="space-y-4">
      {/* Current week objectives */}
      <div className="rounded-xl p-5 bg-card border border-border/50">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h3 className="text-base font-semibold text-foreground">Semaine 13 — Objectifs</h3>
            <p className="text-[13px] text-muted-foreground">24 – 31 mars 2026</p>
          </div>
          <span className="text-[11px] px-2.5 py-1 rounded-full border border-primary/25 bg-primary/10 text-primary font-medium">
            En cours
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {[
            { label: "Objectif R1", key: "r1" },
            { label: "Objectif Closes", key: "closes" },
            { label: "Objectif CA €", key: "ca" },
            { label: "Objectif Closing %", key: "closingPct" },
          ].map((f) => (
            <div key={f.key}>
              <label className="text-[11px] text-muted-foreground mb-1 block">{f.label}</label>
              <input
                type="number"
                min={0}
                value={objectives[f.key as keyof typeof objectives] || ""}
                onChange={(e) => setObjectives((prev) => ({ ...prev, [f.key]: Number(e.target.value) || 0 }))}
                className="w-full bg-background border border-border/50 text-foreground rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors"
              />
            </div>
          ))}
        </div>

        <div className="space-y-3 mt-3">
          <div>
            <label className="text-[11px] text-muted-foreground mb-1 block">Focus 1 de la semaine</label>
            <input
              type="text"
              value={objectives.focus1}
              onChange={(e) => setObjectives((prev) => ({ ...prev, focus1: e.target.value }))}
              placeholder="Ex: Améliorer mon taux de conversion R1 → R2"
              className="w-full bg-background border border-border/50 text-foreground rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground mb-1 block">Focus 2 de la semaine</label>
            <input
              type="text"
              value={objectives.focus2}
              onChange={(e) => setObjectives((prev) => ({ ...prev, focus2: e.target.value }))}
              placeholder="Ex: Traiter les objections prix sans baisser"
              className="w-full bg-background border border-border/50 text-foreground rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <button className="w-full mt-4 bg-primary text-primary-foreground font-bold py-2.5 rounded-lg hover:opacity-85 active:scale-[0.98] transition-all">
          Enregistrer mes objectifs
        </button>
      </div>

      {/* Previous week review */}
      <div className="rounded-xl p-5 bg-card border border-border/50">
        <h3 className="text-base font-semibold text-foreground">Bilan — Semaine 12</h3>
        <p className="text-[13px] text-muted-foreground mt-0.5">17 – 23 mars 2026</p>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {bilanData.map((b) => {
            const realStr = b.isCurrency ? `${b.real.toLocaleString()}€` : `${b.real}${b.isSuffix || ""}`;
            const objStr = b.isCurrency ? `${b.obj.toLocaleString()}€` : `${b.obj}${b.isSuffix || ""}`;
            const statusLabel = b.pct >= 100 ? (b.pct > 100 ? "Dépassé" : "100% atteint") : `${b.pct}% atteint`;
            return (
              <div key={b.label} className="rounded-[10px] p-3" style={{ background: "#0F3020" }}>
                <span className="text-[10px] text-muted-foreground uppercase">{b.label}</span>
                <p className={`text-lg font-bold mt-0.5 ${getColor(b.pct)}`}>
                  {realStr} / {objStr}
                </p>
                <p className={`text-[11px] font-medium ${getColor(b.pct)}`}>{statusLabel}</p>
              </div>
            );
          })}
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

export default WeeklyNotebookTab;
