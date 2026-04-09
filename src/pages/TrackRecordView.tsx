import { Zap, Shield } from "lucide-react";
import CloseScoreRadar from "@/components/dashboard/CloseScoreRadar";
import { getScoreInfo } from "@/components/dashboard/CloseScoreCard";

const profile = {
  name: "Julien De Bonnières",
  initials: "JDB",
  role: "Senior Closer",
  experience: "3 ans de closing",
  city: "Paris, France",
  closeScore: 82,
  tauxClosing: 33,
  cashGenere: 68500,
  panierMoyen: 2450,
  delaiMoyen: 2.4,
  cashContracte: 68500,
  cashCollecte: 52100,
  fullPayPct: 65,
};

const scoreInfo = getScoreInfo(profile.closeScore);

const nichePerf = [
  { niche: "Business & Scaling", ca: 42000, taux: 35 },
  { niche: "Développement personnel", ca: 18000, taux: 30 },
  { niche: "Fitness & Santé", ca: 8500, taux: 28 },
];

const challenges = [
  { client: "Alex Hormozi FR", label: "Challenge Mars", closes: 6, cash: 7400 },
  { client: "Alex Hormozi FR", label: "Challenge Janvier", closes: 4, cash: 5200 },
  { client: "Marie Coaching", label: "Challenge Février", closes: 3, cash: 3800 },
];

const TrackRecordView = () => (
  <div className="min-h-screen bg-background">
    {/* Header */}
    <header className="border-b border-border/50 bg-card/60 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap size={16} className="text-primary-foreground" />
          </div>
          <span className="font-bold">
            <span className="text-foreground">Close</span>
            <span className="text-primary">One</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Shield size={14} className="text-primary" />
          Track Record Vérifié
        </div>
      </div>
    </header>

    <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
      {/* Profile */}
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground">
          {profile.initials}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          <p className="text-muted-foreground text-sm">{profile.role} · {profile.experience}</p>
          <p className="text-muted-foreground text-xs">{profile.city}</p>
        </div>
      </div>

      {/* Close Score + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
        <div className="bg-card border border-border/50 rounded-[12px] p-6">
          <CloseScoreRadar />
        </div>
        <div className="bg-card border border-border/50 rounded-[12px] p-6 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-medium tracking-wider text-muted-foreground uppercase mb-2">Close Score</span>
          <p className="text-5xl font-bold text-primary">{Math.min(profile.closeScore, 95)}</p>
          <p className="text-sm font-semibold text-primary mt-1">{scoreInfo.label}</p>
          <p className="text-lg mt-1">{scoreInfo.icon}</p>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Taux closing", value: `${profile.tauxClosing}%` },
          { label: "Cash généré", value: `${(profile.cashGenere / 1000).toFixed(1)}K€` },
          { label: "Panier moyen", value: `${profile.panierMoyen}€` },
          { label: "Délai moyen", value: `${profile.delaiMoyen}j` },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border/50 rounded-[10px] p-4 text-center">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">{s.label}</p>
            <p className="text-xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Cash bars */}
      <div className="bg-card border border-border/50 rounded-[12px] p-5">
        <h3 className="text-base font-semibold mb-4">Cash contracté vs collecté</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Contracté</span>
              <span className="font-semibold">{profile.cashContracte.toLocaleString("fr-FR")}€</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: "100%" }} />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Collecté</span>
              <span className="font-semibold text-primary">{profile.cashCollecte.toLocaleString("fr-FR")}€</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary/60 rounded-full" style={{ width: `${Math.round(profile.cashCollecte / profile.cashContracte * 100)}%` }} />
            </div>
          </div>
        </div>
        {/* Full / Split */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
            <span>Full Pay {profile.fullPayPct}%</span>
            <span>Split Pay {100 - profile.fullPayPct}%</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden flex">
            <div className="h-full bg-primary" style={{ width: `${profile.fullPayPct}%` }} />
            <div className="h-full bg-warning" style={{ width: `${100 - profile.fullPayPct}%` }} />
          </div>
        </div>
      </div>

      {/* Niche */}
      <div>
        <h3 className="text-base font-semibold mb-3">Performances par niche</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {nichePerf.map((n) => (
            <div key={n.niche} className="bg-card border border-border/50 rounded-[10px] p-4">
              <p className="text-[11px] text-muted-foreground mb-2">{n.niche}</p>
              <p className="text-lg font-bold text-primary">{n.ca.toLocaleString("fr-FR")}€</p>
              <p className="text-[11px] text-muted-foreground">Taux : {n.taux}%</p>
            </div>
          ))}
        </div>
      </div>

      {/* Challenges */}
      <div>
        <h3 className="text-base font-semibold mb-3">Historique challenges</h3>
        <div className="space-y-2">
          {challenges.map((c, i) => (
            <div key={i} className="bg-card border border-border/50 rounded-[10px] p-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{c.label}</p>
                <p className="text-[11px] text-muted-foreground">{c.client}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">{c.cash.toLocaleString("fr-FR")}€</p>
                <p className="text-[11px] text-muted-foreground">{c.closes} closes</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-6 border-t border-border/50">
        <p className="text-[11px] text-muted-foreground">
          Données vérifiées par CloseOne.io — Impossible d'envoyer un faux track record.
        </p>
      </div>
    </div>
  </div>
);

export default TrackRecordView;
