import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const fields = [
  { key: "r1Plan", label: "R1 Planifiés" },
  { key: "r1Eff", label: "R1 Effectués" },
  { key: "r2Plan", label: "R2 Planifiés" },
  { key: "r2Eff", label: "R2 Effectués" },
  { key: "closes", label: "Closes" },
  { key: "cash", label: "Cash collecté €" },
];

const KpiDailyModal = ({ open, onClose }: Props) => {
  const [values, setValues] = useState<Record<string, number>>({
    r1Plan: 0, r1Eff: 0, r2Plan: 0, r2Eff: 0, closes: 0, cash: 0,
  });
  const [showSummary, setShowSummary] = useState(false);

  const handleChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: Number(val) || 0 }));
  };

  const closingRate = values.r1Eff > 0 ? Math.round((values.closes / values.r1Eff) * 100) : 0;

  const getMessage = () => {
    if (values.closes > 0) return "🔥 Bonne journée — tu as closé.";
    if (values.r1Eff >= values.r1Plan && values.r1Plan > 0) return "✅ Discipline parfaite aujourd'hui.";
    if (values.r1Eff < values.r1Plan) return "⚠️ Pense à replanifier demain.";
    return "📋 Journée de préparation.";
  };

  const handleSave = () => {
    onClose();
    setShowSummary(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70" />
      <div
        className="relative w-full max-w-[460px] bg-card border border-border/50 rounded-2xl p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <X size={14} />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-5">
          <span className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center text-sm font-bold text-primary">
            D
          </span>
          <div>
            <h3 className="text-[15px] font-bold text-foreground">KPI Daily</h3>
            <p className="text-xs text-muted-foreground">Mardi 31 mars 2026</p>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-3">
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

        {/* Summary block */}
        {showSummary && (
          <div className="mt-4 rounded-[10px] p-4 border border-primary/25 animate-fade-in" style={{ background: "#0F3020" }}>
            <span className="text-[10px] font-medium tracking-wider text-primary uppercase">Résumé de ta journée</span>
            <p className="text-sm text-foreground mt-2">
              R1 : <span className="font-bold">{values.r1Eff}/{values.r1Plan}</span> — 
              R2 : <span className="font-bold">{values.r2Eff}/{values.r2Plan}</span> — 
              Closes : <span className="font-bold">{values.closes}</span> — 
              Cash : <span className="font-bold text-primary">{values.cash}€</span> — 
              Taux : <span className="font-bold">{closingRate}%</span>
            </p>
            <p className="mt-2 text-sm font-bold text-primary">{getMessage()}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={() => setShowSummary(true)}
            className="flex-1 py-2.5 rounded-[10px] border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-all"
          >
            Voir le résumé
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-2.5 rounded-[10px] bg-primary text-primary-foreground text-sm font-bold hover:opacity-85 active:scale-[0.98] transition-all"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

export default KpiDailyModal;
