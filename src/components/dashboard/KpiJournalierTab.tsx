import { useState } from "react";

const fields = [
  { key: "r1Plan", label: "R1 Planifiés" },
  { key: "r1Eff", label: "R1 Effectués" },
  { key: "r2Plan", label: "R2 Planifiés" },
  { key: "r2Eff", label: "R2 Effectués" },
  { key: "closes", label: "Closes" },
  { key: "cash", label: "Cash collecté €" },
];

const KpiJournalierTab = () => {
  const [values, setValues] = useState<Record<string, number>>({
    r1Plan: 0, r1Eff: 0, r2Plan: 0, r2Eff: 0, closes: 0, cash: 0,
  });
  const [showSummary, setShowSummary] = useState(false);

  const handleChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: Number(val) || 0 }));
  };

  const closingRate = values.r1Eff > 0 ? Math.round((values.closes / values.r1Eff) * 100) : 0;

  const getMessage = () => {
    if (values.closes > 0) return "🔥 Bonne journée ! Tu as closé.";
    if (values.r1Eff >= values.r1Plan && values.r1Plan > 0) return "✅ Discipline parfaite aujourd'hui.";
    if (values.r1Eff < values.r1Plan) return "⚠️ Pense à replanifier demain.";
    return "Remplis tes KPIs pour générer ton résumé.";
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl p-5 bg-card border border-border/50">
        <h3 className="text-base font-semibold text-foreground">KPI du jour</h3>
        <p className="text-[13px] text-muted-foreground mt-0.5">Mardi 31 mars 2026</p>

        <div className="grid grid-cols-2 gap-3 mt-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-[11px] text-muted-foreground mb-1 block">{f.label}</label>
              <input
                type="number"
                min={0}
                value={values[f.key] || ""}
                onChange={(e) => handleChange(f.key, e.target.value)}
                className="w-full bg-background border border-border/50 text-foreground rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors"
                placeholder="0"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowSummary(true)}
          className="w-full mt-4 bg-primary text-primary-foreground font-bold py-2.5 rounded-lg hover:opacity-85 active:scale-[0.98] transition-all"
        >
          Générer le résumé du jour
        </button>
      </div>

      {showSummary && (
        <div className="rounded-xl p-5 border border-primary/25 animate-fade-in" style={{ background: "#0F3020" }}>
          <span className="text-xs font-medium tracking-wider text-primary uppercase">Résumé de ta journée</span>
          <div className="mt-3 space-y-1.5 text-sm text-foreground">
            <p>R1 : <span className="font-bold">{values.r1Eff}/{values.r1Plan}</span> effectués</p>
            <p>R2 : <span className="font-bold">{values.r2Eff}/{values.r2Plan}</span> effectués</p>
            <p>Closes : <span className="font-bold">{values.closes}</span></p>
            <p>Cash : <span className="font-bold text-primary">{values.cash}€</span></p>
            <p>Taux de closing : <span className="font-bold">{closingRate}%</span></p>
          </div>
          <p className="mt-3 text-sm font-bold text-primary">{getMessage()}</p>
        </div>
      )}
    </div>
  );
};

export default KpiJournalierTab;
