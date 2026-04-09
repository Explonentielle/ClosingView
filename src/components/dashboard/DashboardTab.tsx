import { useState } from "react";
import { Phone, PhoneForwarded, Clock, Trophy, DollarSign, Percent, Plus, Target, TrendingUp, CheckCircle2, AlertCircle } from "lucide-react";
import CloseScoreCard from "./CloseScoreCard";

const kpis = [
  { label: "CALLS R1", value: "18", sub: "+3 ce mois", subColor: "text-primary", icon: Phone, highlight: false },
  { label: "CALLS R2", value: "9", sub: "50% conv. R1", subColor: "text-muted-foreground", icon: PhoneForwarded, highlight: false },
  { label: "FOLLOW UP", value: "4", sub: "En attente", subColor: "text-muted-foreground", icon: Clock, highlight: false },
  { label: "CLOSES", value: "6", sub: "Record mois", subColor: "text-primary", icon: Trophy, highlight: false },
  { label: "CASH COLLECTÉ", value: "7 400€", sub: "Comm: 740€ · C2 du Close Score", subColor: "text-muted-foreground", icon: DollarSign, highlight: false },
  { label: "CLOSING %", value: "33%", sub: "Top 20% · C1 du Close Score", subColor: "text-primary", icon: Percent, highlight: true },
];

interface Objectif {
  id: string;
  label: string;
  target: string;
  progress: number;
  status: "En cours" | "Atteint" | "Non atteint";
}

const initialObjectifs: Objectif[] = [
  { id: "1", label: "Cash collecté mensuel", target: "10 000€", progress: 74, status: "En cours" },
  { id: "2", label: "Nombre de closes", target: "10", progress: 60, status: "En cours" },
  { id: "3", label: "Taux de closing", target: "35%", progress: 94, status: "Atteint" },
];

const statusStyle: Record<string, string> = {
  "En cours": "bg-muted/30 text-muted-foreground",
  "Atteint": "bg-primary/15 text-primary",
  "Non atteint": "bg-destructive/15 text-destructive",
};

const statusIcon: Record<string, typeof CheckCircle2> = {
  "En cours": Target,
  "Atteint": CheckCircle2,
  "Non atteint": AlertCircle,
};

const DashboardTab = () => {
  const [objectifs, setObjectifs] = useState(initialObjectifs);
  const [showObjModal, setShowObjModal] = useState(false);
  const [newObj, setNewObj] = useState({ label: "", target: "" });

  const addObjectif = () => {
    if (!newObj.label.trim() || !newObj.target.trim() || objectifs.length >= 4) return;
    setObjectifs([...objectifs, { id: String(Date.now()), label: newObj.label, target: newObj.target, progress: 0, status: "En cours" }]);
    setNewObj({ label: "", target: "" });
    setShowObjModal(false);
  };

  return (
    <div className="space-y-3">
      {/* Section A — KPI Cards + Close Score */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3">
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

        {/* Close Score */}
        <CloseScoreCard score={82} />
      </div>

      {/* Section B — Commissions */}
      <div className="rounded-xl p-5 bg-card border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">Avance des commissions mensuelles</h3>
          <span className="text-sm font-bold text-primary">740€ / 2 000€</span>
        </div>

        <div className="mb-3">
          <div className="flex justify-between mb-1">
            <span className="text-[11px] text-primary">Commissions collectées</span>
            <span className="text-[11px] text-primary font-semibold">740€</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: "37%" }} />
          </div>
        </div>

        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-[11px] text-warning">Super Green Goal</span>
            <span className="text-[11px] text-warning font-semibold">3 000€</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div className="h-full rounded-full bg-warning transition-all duration-700" style={{ width: "25%" }} />
          </div>
        </div>

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

      {/* Section C — Objectifs mensuels */}
      <div className="rounded-xl p-5 bg-card border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-foreground">Mes objectifs du mois</h3>
          {objectifs.length < 4 && (
            <button onClick={() => setShowObjModal(true)} className="text-xs text-primary flex items-center gap-1 hover:underline">
              <Plus size={14} /> Ajouter un objectif
            </button>
          )}
          {objectifs.length >= 4 && (
            <span className="text-[10px] text-muted-foreground">Maximum atteint (4/4)</span>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {objectifs.map((obj) => {
            const Icon = statusIcon[obj.status];
            return (
              <div key={obj.id} className="bg-background border border-border/50 rounded-[10px] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={14} className={obj.status === "Atteint" ? "text-primary" : obj.status === "Non atteint" ? "text-destructive" : "text-muted-foreground"} />
                    <span className="text-sm font-medium">{obj.label}</span>
                  </div>
                  <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full ${statusStyle[obj.status]}`}>{obj.status}</span>
                </div>
                <p className="text-lg font-bold text-primary mb-2">{obj.target}</p>
                <div className="h-1.5 rounded-full bg-muted">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${
                      obj.status === "Atteint" ? "bg-primary" : obj.status === "Non atteint" ? "bg-destructive" : "bg-primary/60"
                    }`}
                    style={{ width: `${Math.min(obj.progress, 100)}%` }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">{obj.progress}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Objectif modal */}
      {showObjModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowObjModal(false)}>
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative bg-card border border-border/50 rounded-2xl p-6 w-full max-w-[400px] mx-4 animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowObjModal(false)} className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">×</button>
            <h3 className="text-[15px] font-bold mb-4">Ajouter un objectif</h3>
            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">Intitulé</label>
                <input value={newObj.label} onChange={(e) => setNewObj({ ...newObj, label: e.target.value })} placeholder="Ex: Cash collecté mensuel" className="w-full h-10 rounded-lg border border-border/50 bg-background px-3 text-sm focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[10px] text-muted-foreground block mb-1">Valeur cible</label>
                <input value={newObj.target} onChange={(e) => setNewObj({ ...newObj, target: e.target.value })} placeholder="Ex: 15 000€" className="w-full h-10 rounded-lg border border-border/50 bg-background px-3 text-sm focus:outline-none focus:border-primary" />
              </div>
              <button onClick={addObjectif} className="w-full h-10 rounded-[10px] bg-primary text-primary-foreground font-semibold text-sm">Ajouter</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardTab;
