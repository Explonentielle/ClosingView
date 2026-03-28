import { TrendingUp, Target, DollarSign, Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  { label: "Deals Closés", value: "147", change: "+12%", icon: Briefcase, gradient: "gradient-primary" },
  { label: "CA Total", value: "€284K", change: "+18%", icon: DollarSign, gradient: "gradient-primary" },
  { label: "Commissions", value: "€34K", change: "+22%", icon: TrendingUp, gradient: "gradient-accent" },
  { label: "% Objectif", value: "78%", change: "+8%", icon: Target, gradient: "gradient-primary" },
];

const recentActivity = [
  { name: "Sophie Martin", action: "a closé un deal de €12,500", time: "il y a 2min", avatar: "SM" },
  { name: "Lucas Bernard", action: "a atteint l'objectif mensuel", time: "il y a 15min", avatar: "LB" },
  { name: "Emma Dubois", action: "a débloqué 'Closer Elite'", time: "il y a 1h", avatar: "ED" },
  { name: "Thomas Petit", action: "a monté au rang #3", time: "il y a 2h", avatar: "TP" },
];

const weeklyData = [
  { day: "Lun", pct: 65 },
  { day: "Mar", pct: 82 },
  { day: "Mer", pct: 45 },
  { day: "Jeu", pct: 90 },
  { day: "Ven", pct: 73 },
];

const goalProgress = 78;

const DashboardView = () => (
  <div className="space-y-6 animate-slide-up">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold">Tableau de Bord</h2>
        <p className="text-muted-foreground text-sm mt-1">Vue d'ensemble de vos performances</p>
      </div>
      <div className="flex gap-2">
        <Link to="/deals/new" className="gradient-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
          Ajouter un deal <ArrowRight size={14} />
        </Link>
        <Link to="/deals" className="bg-secondary text-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-secondary/80 transition-colors">
          Voir les deals
        </Link>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div key={s.label} className="glass-card p-5 group hover:border-primary/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className={`w-10 h-10 rounded-lg ${s.gradient} flex items-center justify-center`}>
              <s.icon size={18} className="text-primary-foreground" />
            </div>
            <span className="text-primary text-xs font-semibold">{s.change}</span>
          </div>
          <p className="text-2xl font-bold">{s.value}</p>
          <p className="text-muted-foreground text-xs mt-1">{s.label}</p>
        </div>
      ))}
    </div>

    {/* Monthly Goal Progress */}
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold">Objectif Mensuel</h3>
          <p className="text-xs text-muted-foreground mt-0.5">€284K / €365K</p>
        </div>
        <span className="text-2xl font-bold text-primary">{goalProgress}%</span>
      </div>
      <div className="h-3 bg-secondary rounded-full overflow-hidden">
        <div className="h-full gradient-primary rounded-full transition-all duration-1000" style={{ width: `${goalProgress}%` }} />
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Activité Récente</h3>
          <Link to="/leaderboard" className="text-xs text-primary hover:underline">Voir tout</Link>
        </div>
        <div className="space-y-4">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-xs font-bold text-primary-foreground shrink-0">
                {a.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm"><span className="font-medium">{a.name}</span>{" "}<span className="text-muted-foreground">{a.action}</span></p>
                <p className="text-xs text-muted-foreground">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="font-semibold mb-4">Performance Hebdo</h3>
        <div className="space-y-3">
          {weeklyData.map(({ day, pct }) => (
            <div key={day} className="flex items-center gap-3">
              <span className="text-xs text-muted-foreground w-8">{day}</span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div className="h-full gradient-primary rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
              </div>
              <span className="text-xs text-muted-foreground w-8 text-right">{pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default DashboardView;
