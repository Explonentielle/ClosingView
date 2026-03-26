import { Trophy, Medal, Flame, TrendingUp, TrendingDown } from "lucide-react";

const leaders = [
  { rank: 1, name: "Sophie Martin", deals: 52, revenue: "€145K", streak: 12, trend: "up", avatar: "SM", xp: 4850 },
  { rank: 2, name: "Lucas Bernard", deals: 47, revenue: "€132K", streak: 8, trend: "up", avatar: "LB", xp: 4320 },
  { rank: 3, name: "Emma Dubois", deals: 43, revenue: "€118K", streak: 15, trend: "up", avatar: "ED", xp: 3980 },
  { rank: 4, name: "Thomas Petit", deals: 38, revenue: "€98K", streak: 5, trend: "down", avatar: "TP", xp: 3650 },
  { rank: 5, name: "Léa Moreau", deals: 35, revenue: "€92K", streak: 3, trend: "up", avatar: "LM", xp: 3420 },
  { rank: 6, name: "Hugo Laurent", deals: 31, revenue: "€84K", streak: 7, trend: "down", avatar: "HL", xp: 3100 },
  { rank: 7, name: "Chloé Roux", deals: 28, revenue: "€76K", streak: 2, trend: "up", avatar: "CR", xp: 2890 },
  { rank: 8, name: "Antoine Leroy", deals: 25, revenue: "€68K", streak: 4, trend: "up", avatar: "AL", xp: 2650 },
];

const rankStyle = (rank: number) => {
  if (rank === 1) return "gradient-primary text-primary-foreground";
  if (rank === 2) return "bg-secondary text-foreground";
  if (rank === 3) return "gradient-warm text-primary-foreground";
  return "bg-muted text-muted-foreground";
};

const LeaderboardView = () => (
  <div className="space-y-6 animate-slide-up">
    <div>
      <h2 className="text-2xl font-bold">Classement</h2>
      <p className="text-muted-foreground text-sm mt-1">Top performers de ce mois</p>
    </div>

    {/* Podium */}
    <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
      {[leaders[1], leaders[0], leaders[2]].map((l, i) => {
        const order = [2, 1, 3][i];
        const height = order === 1 ? "h-40" : order === 2 ? "h-32" : "h-28";
        return (
          <div key={l.rank} className="flex flex-col items-center">
            <div className={`w-14 h-14 rounded-full ${rankStyle(order)} flex items-center justify-center text-sm font-bold mb-2 ${order === 1 ? 'ring-2 ring-primary/50 glow-primary' : ''}`}>
              {l.avatar}
            </div>
            <p className="font-semibold text-sm text-center">{l.name}</p>
            <p className="text-xs text-muted-foreground font-mono">{l.xp} XP</p>
            <div className={`${height} w-full mt-3 ${rankStyle(order)} rounded-t-lg flex flex-col items-center justify-end pb-3`}>
              {order === 1 && <Trophy size={20} className="mb-1" />}
              <span className="text-2xl font-bold">#{order}</span>
            </div>
          </div>
        );
      })}
    </div>

    {/* Full list */}
    <div className="glass-card overflow-hidden">
      <div className="grid grid-cols-[3rem_1fr_5rem_5rem_4rem_4rem] gap-2 px-5 py-3 text-xs text-muted-foreground font-medium border-b border-border/50">
        <span>#</span><span>Agent</span><span>Deals</span><span>Revenue</span><span>Série</span><span>XP</span>
      </div>
      {leaders.map((l) => (
        <div key={l.rank} className="grid grid-cols-[3rem_1fr_5rem_5rem_4rem_4rem] gap-2 px-5 py-3 items-center hover:bg-secondary/50 transition-colors border-b border-border/20 last:border-0">
          <span className={`text-sm font-bold font-mono ${l.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
            {l.rank}
          </span>
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${rankStyle(l.rank)} flex items-center justify-center text-xs font-bold shrink-0`}>
              {l.avatar}
            </div>
            <span className="text-sm font-medium truncate">{l.name}</span>
            {l.trend === "up" ? <TrendingUp size={14} className="text-accent shrink-0" /> : <TrendingDown size={14} className="text-destructive shrink-0" />}
          </div>
          <span className="text-sm font-mono">{l.deals}</span>
          <span className="text-sm font-mono">{l.revenue}</span>
          <span className="text-sm font-mono flex items-center gap-1"><Flame size={12} className="text-amber-400" />{l.streak}</span>
          <span className="text-sm font-mono text-primary">{l.xp}</span>
        </div>
      ))}
    </div>
  </div>
);

export default LeaderboardView;
