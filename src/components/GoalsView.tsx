import { Target, CheckCircle2, Clock, AlertCircle } from "lucide-react";

const goals = [
  { title: "Closer 50 deals ce mois", progress: 78, current: 39, target: 50, deadline: "8 jours", status: "on-track" },
  { title: "Atteindre €500K de revenue", progress: 57, current: 284, target: 500, unit: "K€", deadline: "22 jours", status: "at-risk" },
  { title: "Recruter 5 nouveaux agents", progress: 60, current: 3, target: 5, deadline: "15 jours", status: "on-track" },
  { title: "NPS client > 85", progress: 94, current: 88, target: 85, deadline: "Atteint!", status: "completed" },
  { title: "Réduire le cycle de vente à 14j", progress: 45, current: 21, target: 14, unit: "jours", deadline: "30 jours", status: "behind" },
  { title: "Formation équipe complétée", progress: 100, current: 34, target: 34, deadline: "Atteint!", status: "completed" },
];

const statusConfig = {
  "on-track": { icon: Clock, color: "text-primary", bg: "bg-primary/10", label: "En bonne voie" },
  "at-risk": { icon: AlertCircle, color: "text-amber-400", bg: "bg-amber-400/10", label: "À risque" },
  "behind": { icon: AlertCircle, color: "text-destructive", bg: "bg-destructive/10", label: "En retard" },
  "completed": { icon: CheckCircle2, color: "text-accent", bg: "bg-accent/10", label: "Atteint" },
};

const GoalsView = () => (
  <div className="space-y-6 animate-slide-up">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Objectifs</h2>
        <p className="text-muted-foreground text-sm mt-1">Suivez vos objectifs en temps réel</p>
      </div>
      <button className="gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
        + Nouvel Objectif
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {goals.map((g, i) => {
        const config = statusConfig[g.status as keyof typeof statusConfig];
        const StatusIcon = config.icon;
        return (
          <div key={i} className="glass-card p-5 hover:border-primary/30 transition-all duration-300 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-sm">{g.title}</h3>
                <div className={`inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-full text-xs ${config.bg} ${config.color}`}>
                  <StatusIcon size={12} />
                  {config.label}
                </div>
              </div>
              <Target size={18} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">{g.current}/{g.target} {g.unit || ""}</span>
                <span className="font-mono font-semibold">{g.progress}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    g.status === "completed" ? "gradient-accent" : g.status === "behind" ? "bg-destructive" : "gradient-primary"
                  }`}
                  style={{ width: `${Math.min(g.progress, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock size={10} /> {g.deadline}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default GoalsView;
