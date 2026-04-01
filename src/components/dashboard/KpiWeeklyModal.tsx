import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
}

const fields = [
  { key: "r1", label: "Objectif R1" },
  { key: "closes", label: "Objectif Closes" },
  { key: "ca", label: "Objectif CA €" },
  { key: "closingPct", label: "Objectif Closing %" },
];

const KpiWeeklyModal = ({ open, onClose }: Props) => {
  const [values, setValues] = useState<Record<string, number>>({
    r1: 0, closes: 0, ca: 0, closingPct: 0,
  });
  const [focus1, setFocus1] = useState("");
  const [focus2, setFocus2] = useState("");

  const handleChange = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: Number(val) || 0 }));
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
          <span className="w-7 h-7 rounded-lg bg-warning/15 flex items-center justify-center text-sm font-bold text-warning">
            W
          </span>
          <div>
            <h3 className="text-[15px] font-bold text-foreground">KPI Weekly</h3>
            <p className="text-xs text-muted-foreground">Semaine 13 — 24 au 31 mars 2026</p>
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

        {/* Focus fields */}
        <div className="space-y-3 mt-3">
          <div>
            <label className="text-[11px] text-muted-foreground mb-1 block">Focus 1</label>
            <input
              type="text"
              value={focus1}
              onChange={(e) => setFocus1(e.target.value)}
              placeholder="Ex: Améliorer mon taux de conversion R1 → R2"
              className="w-full bg-background border border-border/50 text-foreground rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground mb-1 block">Focus 2</label>
            <input
              type="text"
              value={focus2}
              onChange={(e) => setFocus2(e.target.value)}
              placeholder="Ex: Traiter les objections prix sans baisser"
              className="w-full bg-background border border-border/50 text-foreground rounded-lg px-3 py-2 text-sm focus:border-primary focus:outline-none transition-colors placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Save */}
        <button
          onClick={onClose}
          className="w-full mt-5 py-2.5 rounded-[10px] bg-warning text-primary-foreground text-sm font-bold hover:opacity-85 active:scale-[0.98] transition-all"
        >
          Enregistrer mes objectifs
        </button>
      </div>
    </div>
  );
};

export default KpiWeeklyModal;
