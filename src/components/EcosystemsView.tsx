import { useState } from "react";
import { Search, X, Users, TrendingUp, ExternalLink, ChevronRight, Calendar, Target, Trophy } from "lucide-react";

interface Ecosystem {
  id: number;
  name: string;
  type: "Écosystème" | "Infopreneur";
  theme: string;
  logo: string;
  description: string;
  closers: number;
  avgCommission: string;
  partner: boolean;
  challengeActive: boolean;
}

const ecosystems: Ecosystem[] = [
  { id: 1, name: "ScaleUp Academy", type: "Écosystème", theme: "SaaS B2B", logo: "SA", description: "Écosystème leader pour les closers SaaS. Formations, leads qualifiés et communauté active.", closers: 45, avgCommission: "12%", partner: true, challengeActive: true },
  { id: 2, name: "CloserPro", type: "Infopreneur", theme: "Coaching", logo: "CP", description: "Réseau de closers spécialisés dans le coaching et le développement personnel.", closers: 32, avgCommission: "15%", partner: true, challengeActive: false },
  { id: 3, name: "Digital Empire", type: "Écosystème", theme: "E-commerce", logo: "DE", description: "Plateforme e-commerce avec une communauté de closers dédiée au high-ticket.", closers: 28, avgCommission: "10%", partner: false, challengeActive: true },
  { id: 4, name: "LeadMachine", type: "Infopreneur", theme: "Marketing", logo: "LM", description: "Spécialiste du marketing digital avec des offres high-ticket exclusives.", closers: 19, avgCommission: "18%", partner: false, challengeActive: false },
  { id: 5, name: "FinanceFlow", type: "Écosystème", theme: "Finance", logo: "FF", description: "Écosystème finance et investissement. Produits premium pour closers expérimentés.", closers: 22, avgCommission: "14%", partner: true, challengeActive: true },
  { id: 6, name: "HealthPeak", type: "Infopreneur", theme: "Santé", logo: "HP", description: "Réseau santé et bien-être avec des programmes de coaching premium.", closers: 15, avgCommission: "16%", partner: false, challengeActive: false },
];

interface Challenge {
  id: number;
  name: string;
  ecosystem: string;
  startDate: string;
  endDate: string;
  objective: string;
  status: "En cours" | "Terminé" | "À venir";
  participants: number;
}

const challenges: Challenge[] = [
  { id: 1, name: "Sprint Q1", ecosystem: "ScaleUp Academy", startDate: "1 Jan", endDate: "31 Mar", objective: "50 deals closés", status: "En cours", participants: 28 },
  { id: 2, name: "Marathon Closer", ecosystem: "CloserPro", startDate: "15 Fév", endDate: "15 Mar", objective: "€100K de CA", status: "Terminé", participants: 42 },
  { id: 3, name: "Top Performer", ecosystem: "Digital Empire", startDate: "1 Avr", endDate: "30 Avr", objective: "Taux closing > 40%", status: "À venir", participants: 15 },
  { id: 4, name: "Commission Race", ecosystem: "FinanceFlow", startDate: "1 Mar", endDate: "31 Mar", objective: "€15K commissions", status: "En cours", participants: 19 },
];

const challengeStatusStyle: Record<string, string> = {
  "En cours": "bg-primary/10 text-primary",
  "Terminé": "bg-muted text-muted-foreground",
  "À venir": "bg-amber-400/10 text-amber-400",
};

const EcosystemsView = () => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Ecosystem | null>(null);

  const filtered = ecosystems.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase()) || e.theme.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-slide-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Écosystèmes & Challenges</h2>
          <p className="text-muted-foreground text-sm mt-1">Explorez les opportunités et participez aux challenges</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full h-10 rounded-lg border border-input bg-secondary/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((eco) => (
          <div key={eco.id} className="glass-card p-5 hover:border-primary/30 transition-all duration-300 group cursor-pointer" onClick={() => setSelected(eco)}>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
                {eco.logo}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm truncate">{eco.name}</h3>
                <p className="text-xs text-muted-foreground">{eco.type} · {eco.theme}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {eco.partner && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">Partenaire</span>}
              {eco.challengeActive && <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-400/10 text-amber-400">Challenge actif</span>}
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><Users size={12} /> {eco.closers}</span>
                <span className="flex items-center gap-1"><TrendingUp size={12} /> {eco.avgCommission}</span>
              </div>
              <button className="text-xs text-primary font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Voir <ChevronRight size={12} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Challenges Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Challenges</h3>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
          {challenges.map((ch) => (
            <div key={ch.id} className="glass-card p-5 min-w-[280px] snap-start shrink-0 hover:border-primary/30 transition-all">
              <div className="flex items-center justify-between mb-3">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${challengeStatusStyle[ch.status]}`}>{ch.status}</span>
                <Trophy size={16} className="text-muted-foreground" />
              </div>
              <h4 className="font-semibold text-sm mb-1">{ch.name}</h4>
              <p className="text-xs text-muted-foreground mb-3">{ch.ecosystem}</p>
              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Calendar size={12} /> {ch.startDate} → {ch.endDate}</div>
                <div className="flex items-center gap-2"><Target size={12} /> {ch.objective}</div>
                <div className="flex items-center gap-2"><Users size={12} /> {ch.participants} participants</div>
              </div>
              {ch.status === "À venir" && (
                <button className="mt-4 w-full h-9 rounded-lg gradient-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity">
                  Participer
                </button>
              )}
              {ch.status === "En cours" && (
                <button className="mt-4 w-full h-9 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors">
                  Voir le classement
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Ecosystem Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="glass-card p-6 w-full max-w-lg animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                  {selected.logo}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{selected.name}</h3>
                  <p className="text-xs text-muted-foreground">{selected.type} · {selected.theme}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
            </div>
            <p className="text-sm text-muted-foreground mb-5">{selected.description}</p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Closers actifs</p>
                <p className="text-xl font-bold mt-1">{selected.closers}</p>
              </div>
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Commission moy.</p>
                <p className="text-xl font-bold mt-1 text-primary">{selected.avgCommission}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex-1 h-10 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
                Rejoindre
              </button>
              <button className="h-10 px-4 rounded-lg bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors flex items-center gap-2">
                <ExternalLink size={14} /> Site
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EcosystemsView;
