import { Gift, Lock, Star, Zap, Crown, Award, Gem, Rocket } from "lucide-react";

const rewards = [
  { title: "Closer Rookie", description: "Fermez 10 deals", icon: Star, xpRequired: 500, unlocked: true, tier: "bronze" },
  { title: "Deal Hunter", description: "Fermez 25 deals en 1 mois", icon: Zap, xpRequired: 1500, unlocked: true, tier: "silver" },
  { title: "Revenue Master", description: "Générez €100K de revenue", icon: Award, xpRequired: 3000, unlocked: true, tier: "gold" },
  { title: "Closer Elite", description: "Top 3 du classement", icon: Crown, xpRequired: 4500, unlocked: false, tier: "platinum" },
  { title: "Diamant", description: "Série de 20 jours consécutifs", icon: Gem, xpRequired: 6000, unlocked: false, tier: "diamond" },
  { title: "Légende", description: "Atteignez tous les objectifs trimestriels", icon: Rocket, xpRequired: 10000, unlocked: false, tier: "legendary" },
];

const tierColors = {
  bronze: { bg: "bg-amber-900/20", border: "border-amber-700/30", text: "text-amber-500", glow: "" },
  silver: { bg: "bg-slate-400/10", border: "border-slate-400/30", text: "text-slate-300", glow: "" },
  gold: { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400", glow: "glow-primary" },
  platinum: { bg: "bg-primary/10", border: "border-primary/30", text: "text-primary", glow: "" },
  diamond: { bg: "bg-cyan-400/10", border: "border-cyan-400/30", text: "text-cyan-400", glow: "" },
  legendary: { bg: "bg-purple-500/10", border: "border-purple-500/30", text: "text-purple-400", glow: "" },
};

const currentXP = 3200;

const RewardsView = () => (
  <div className="space-y-6 animate-slide-up">
    <div>
      <h2 className="text-2xl font-bold">Récompenses</h2>
      <p className="text-muted-foreground text-sm mt-1">Débloquez des badges et récompenses</p>
    </div>

    {/* XP Bar */}
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">Votre Progression</span>
        <span className="font-mono text-primary font-bold">{currentXP} XP</span>
      </div>
      <div className="h-3 bg-secondary rounded-full overflow-hidden relative">
        <div className="h-full gradient-primary rounded-full transition-all duration-1000" style={{ width: `${(currentXP / 10000) * 100}%` }} />
        {/* Milestones */}
        {[500, 1500, 3000, 4500, 6000].map((xp) => (
          <div key={xp} className="absolute top-0 h-full w-px bg-border" style={{ left: `${(xp / 10000) * 100}%` }} />
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-muted-foreground">0</span>
        <span className="text-xs text-muted-foreground">10,000 XP</span>
      </div>
    </div>

    {/* Rewards Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {rewards.map((r, i) => {
        const tier = tierColors[r.tier as keyof typeof tierColors];
        return (
          <div
            key={i}
            className={`glass-card p-5 transition-all duration-300 ${
              r.unlocked
                ? `${tier.border} border hover:scale-[1.02] ${tier.glow}`
                : "opacity-60 hover:opacity-80"
            }`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-xl ${r.unlocked ? tier.bg : 'bg-muted'} flex items-center justify-center`}>
                {r.unlocked ? (
                  <r.icon size={22} className={tier.text} />
                ) : (
                  <Lock size={22} className="text-muted-foreground" />
                )}
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${r.unlocked ? '' : 'text-muted-foreground'}`}>{r.title}</h3>
                <p className="text-xs text-muted-foreground capitalize">{r.tier}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{r.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground">{r.xpRequired} XP requis</span>
              {r.unlocked ? (
                <span className="text-xs font-medium text-accent flex items-center gap-1">
                  <Star size={10} /> Débloqué
                </span>
              ) : (
                <span className="text-xs font-mono text-muted-foreground">
                  {Math.max(0, r.xpRequired - currentXP)} XP restants
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default RewardsView;
