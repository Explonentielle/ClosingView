import { useState } from "react";
import { Search, Plus, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

type DealStatus = "En cours" | "Gagné" | "Perdu";
type VenteType = "Full Pay" | "Split Pay";

interface Deal {
  id: number;
  prenom: string;
  montantContracte: number;
  montantCollecte: number;
  typeVente: VenteType;
  delai: number;
  status: DealStatus;
  date: string;
  infopreneur: string;
  niche: string;
}

const mockDeals: Deal[] = [
  { id: 1, prenom: "Sophie", montantContracte: 3000, montantCollecte: 1800, typeVente: "Split Pay", delai: 3, status: "Gagné", date: "2026-03-31", infopreneur: "Alex Hormozi FR", niche: "Business & Scaling" },
  { id: 2, prenom: "Marc", montantContracte: 2500, montantCollecte: 2500, typeVente: "Full Pay", delai: 0, status: "Gagné", date: "2026-03-28", infopreneur: "Alex Hormozi FR", niche: "Business & Scaling" },
  { id: 3, prenom: "Léa", montantContracte: 2000, montantCollecte: 1700, typeVente: "Split Pay", delai: 3, status: "Gagné", date: "2026-03-28", infopreneur: "Alex Hormozi FR", niche: "Business & Scaling" },
  { id: 4, prenom: "Thomas", montantContracte: 1500, montantCollecte: 0, typeVente: "Full Pay", delai: 5, status: "Perdu", date: "2026-03-25", infopreneur: "Marie Coaching", niche: "Développement personnel" },
  { id: 5, prenom: "Julie", montantContracte: 2000, montantCollecte: 2000, typeVente: "Full Pay", delai: 1, status: "Gagné", date: "2026-03-22", infopreneur: "Marie Coaching", niche: "Développement personnel" },
  { id: 6, prenom: "Antoine", montantContracte: 3500, montantCollecte: 1200, typeVente: "Split Pay", delai: 2, status: "En cours", date: "2026-03-20", infopreneur: "Alex Hormozi FR", niche: "Business & Scaling" },
  { id: 7, prenom: "Emma", montantContracte: 1800, montantCollecte: 1800, typeVente: "Full Pay", delai: 0, status: "Gagné", date: "2026-03-18", infopreneur: "Pierre Fitness Pro", niche: "Fitness & Santé" },
  { id: 8, prenom: "Lucas", montantContracte: 2200, montantCollecte: 0, typeVente: "Full Pay", delai: 4, status: "En cours", date: "2026-03-15", infopreneur: "Marie Coaching", niche: "Développement personnel" },
];

const statusColor: Record<DealStatus, string> = {
  "En cours": "bg-[rgba(59,130,246,0.15)] text-[#3B82F6]",
  "Gagné": "bg-[rgba(0,194,122,0.15)] text-[#00C27A]",
  "Perdu": "bg-[rgba(248,113,113,0.15)] text-destructive",
};

const DealsView = () => {
  const [deals] = useState(mockDeals);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<DealStatus | "Tous">("Tous");
  const [filterType, setFilterType] = useState<VenteType | "Tous">("Tous");
  const [sortBy, setSortBy] = useState<"montantContracte" | "montantCollecte" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = deals
    .filter((d) => filterStatus === "Tous" || d.status === filterStatus)
    .filter((d) => filterType === "Tous" || d.typeVente === filterType)
    .filter((d) => d.prenom.toLowerCase().includes(search.toLowerCase()) || d.infopreneur.toLowerCase().includes(search.toLowerCase()));

  const sorted = sortBy
    ? [...filtered].sort((a, b) => sortDir === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy])
    : filtered;

  const toggleSort = (col: "montantContracte" | "montantCollecte") => {
    if (sortBy === col) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Deals</h2>
          <p className="text-muted-foreground text-sm mt-1">Tous vos deals commerciaux</p>
        </div>
        <Link to="/deals/new" className="bg-primary text-primary-foreground px-4 py-2.5 rounded-[10px] text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0">
          <Plus size={16} /> Rentrer un deal
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par prénom ou infopreneur..."
            className="w-full h-10 rounded-[10px] border border-border/50 bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["Tous", "En cours", "Gagné", "Perdu"] as const).map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? "bg-primary/15 text-primary border border-primary/25" : "text-muted-foreground hover:text-foreground"}`}>
              {s}
            </button>
          ))}
          <div className="w-px bg-border/50 mx-1" />
          {(["Tous", "Full Pay", "Split Pay"] as const).map((s) => (
            <button key={s} onClick={() => setFilterType(s)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${filterType === s ? "bg-warning/15 text-warning border border-warning/25" : "text-muted-foreground hover:text-foreground"}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border/50 rounded-[12px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">Prénom</th>
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium cursor-pointer select-none" onClick={() => toggleSort("montantContracte")}>
                  <span className="flex items-center gap-1">Contracté <ArrowUpDown size={12} /></span>
                </th>
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium cursor-pointer select-none" onClick={() => toggleSort("montantCollecte")}>
                  <span className="flex items-center gap-1">Collecté <ArrowUpDown size={12} /></span>
                </th>
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">Type</th>
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">Délai</th>
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">Statut</th>
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d) => (
                <tr key={d.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium">{d.prenom}</td>
                  <td className="px-5 py-3.5">{d.montantContracte.toLocaleString("fr-FR")}€</td>
                  <td className="px-5 py-3.5 text-primary">{d.montantCollecte.toLocaleString("fr-FR")}€</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs ${d.typeVente === "Full Pay" ? "text-primary" : "text-warning"}`}>{d.typeVente}</span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{d.delai}j</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[d.status]}`}>{d.status}</span>
                  </td>
                  <td className="px-5 py-3.5 text-muted-foreground">{d.date}</td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={7} className="text-center py-12 text-muted-foreground">Aucun deal trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DealsView;
