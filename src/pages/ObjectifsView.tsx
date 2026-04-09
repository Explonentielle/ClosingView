import { useState } from "react";
import { DollarSign, Percent, Target, TrendingUp, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Objectif {
  id: number;
  icon: typeof DollarSign;
  title: string;
  target: string;
  status: "en-cours" | "atteint" | "non-atteint";
}

const initialObjectifs: Objectif[] = [
  { id: 1, icon: DollarSign, title: "Atteindre 15 000€ de cash collecté", target: "15 000€", status: "en-cours" },
  { id: 2, icon: Percent, title: "Maintenir un taux de closing > 30%", target: "30%", status: "atteint" },
  { id: 3, icon: Target, title: "Closer 10 deals ce mois", target: "10 deals", status: "non-atteint" },
];

const statusConfig = {
  "en-cours": { label: "En cours", cls: "bg-warning/15 text-warning border border-warning/30" },
  "atteint": { label: "Validé", cls: "bg-primary/15 text-primary border border-primary/30" },
  "non-atteint": { label: "Non atteint", cls: "bg-destructive/15 text-destructive border border-destructive/30" },
};

const ObjectifsView = () => {
  const [objectifs, setObjectifs] = useState(initialObjectifs);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", target: "" });

  const atteints = objectifs.filter((o) => o.status === "atteint").length;
  const inputClass =
    "w-full h-11 rounded-lg border border-border bg-background px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors";

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.target) return;
    setObjectifs([
      ...objectifs,
      { id: Date.now(), icon: TrendingUp, title: form.title, target: form.target, status: "en-cours" },
    ]);
    setForm({ title: "", target: "" });
    setShowModal(false);
    toast.success("Objectif ajouté !");
  };

  return (
    <div className="space-y-4 animate-slide-up max-w-[1440px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">Objectifs du mois</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Avril 2026</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] px-3 py-1.5 rounded-full bg-primary/15 text-primary border border-primary/30 font-medium">
            {objectifs.length} objectifs saisis
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus size={14} /> Ajouter un objectif
          </button>
        </div>
      </div>

      {/* Objectifs list */}
      <div className="space-y-3">
        {objectifs.map((obj) => {
          const Icon = obj.icon;
          const st = statusConfig[obj.status];
          return (
            <div
              key={obj.id}
              className="rounded-[10px] p-4 bg-card border border-border/50 flex items-center gap-4 hover:border-primary/20 transition-colors"
            >
              <div className="w-10 h-10 rounded-[10px] bg-background flex items-center justify-center shrink-0">
                <Icon size={18} className="text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{obj.title}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">Cible : {obj.target}</p>
              </div>
              <span className={`text-[11px] font-medium px-3 py-1 rounded-full shrink-0 ${st.cls}`}>{st.label}</span>
            </div>
          );
        })}
      </div>

      {/* Summary */}
      <div className="rounded-[10px] p-4 bg-primary/10 border border-primary/20">
        <p className="text-sm text-primary font-medium">
          {atteints} objectif{atteints > 1 ? "s" : ""} atteint{atteints > 1 ? "s" : ""} sur {objectifs.length} — +{atteints * 3} pts au Close Score ce mois
        </p>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setShowModal(false)}>
          <div
            className="rounded-2xl p-6 bg-card border border-border/50 w-full max-w-[460px] animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[15px] font-bold text-foreground">Nouvel objectif</h3>
              <button onClick={() => setShowModal(false)} className="w-7 h-7 rounded-lg bg-background flex items-center justify-center text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
            </div>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-[11px] text-muted-foreground mb-1.5 block uppercase tracking-wider">Intitulé</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Closer 10 deals" className={inputClass} required />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground mb-1.5 block uppercase tracking-wider">Valeur cible</label>
                <input value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} placeholder="Ex: 15 000€ ou 30%" className={inputClass} required />
              </div>
              <button type="submit" className="w-full h-11 rounded-[10px] bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                Créer l'objectif
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectifsView;
