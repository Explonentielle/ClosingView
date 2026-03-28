import { useState } from "react";
import { Search, Plus, ArrowUpDown } from "lucide-react";
import { Link } from "react-router-dom";

type DealStatus = "En cours" | "Gagné" | "Perdu";

interface Deal {
  id: number;
  name: string;
  client: string;
  amount: number;
  commission: number;
  status: DealStatus;
}

const mockDeals: Deal[] = [
  { id: 1, name: "Contrat SaaS Premium", client: "TechCorp", amount: 24000, commission: 2400, status: "Gagné" },
  { id: 2, name: "Licence Enterprise", client: "DataFlow", amount: 18500, commission: 1850, status: "Gagné" },
  { id: 3, name: "Consulting Pack", client: "StartupXYZ", amount: 8000, commission: 960, status: "En cours" },
  { id: 4, name: "Formation Équipe", client: "MegaRetail", amount: 12000, commission: 1200, status: "En cours" },
  { id: 5, name: "Setup Infrastructure", client: "CloudNine", amount: 35000, commission: 3500, status: "Gagné" },
  { id: 6, name: "Migration Cloud", client: "OldSchool Inc", amount: 15000, commission: 1500, status: "Perdu" },
  { id: 7, name: "Audit Sécurité", client: "SecureBank", amount: 22000, commission: 2640, status: "En cours" },
  { id: 8, name: "API Integration", client: "FinTechPro", amount: 9500, commission: 950, status: "Gagné" },
];

const statusColor: Record<DealStatus, string> = {
  "En cours": "bg-primary/10 text-primary",
  "Gagné": "bg-accent/10 text-accent",
  "Perdu": "bg-destructive/10 text-destructive",
};

const DealsView = () => {
  const [deals] = useState(mockDeals);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<DealStatus | "Tous">("Tous");
  const [sortBy, setSortBy] = useState<"amount" | "commission" | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = deals
    .filter((d) => filterStatus === "Tous" || d.status === filterStatus)
    .filter((d) => d.name.toLowerCase().includes(search.toLowerCase()) || d.client.toLowerCase().includes(search.toLowerCase()));

  const sorted = sortBy
    ? [...filtered].sort((a, b) => sortDir === "desc" ? b[sortBy] - a[sortBy] : a[sortBy] - b[sortBy])
    : filtered;

  const toggleSort = (col: "amount" | "commission") => {
    if (sortBy === col) setSortDir(sortDir === "desc" ? "asc" : "desc");
    else { setSortBy(col); setSortDir("desc"); }
  };

  const totalCA = deals.filter(d => d.status === "Gagné").reduce((s, d) => s + d.amount, 0);
  const totalComm = deals.filter(d => d.status === "Gagné").reduce((s, d) => s + d.commission, 0);

  return (
    <div className="space-y-6 animate-slide-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Deals</h2>
          <p className="text-muted-foreground text-sm mt-1">Gérez tous vos deals commerciaux</p>
        </div>
        <Link to="/deals/new" className="gradient-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0">
          <Plus size={16} /> Ajouter un Deal
        </Link>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Total Deals</p>
          <p className="text-xl font-bold mt-1">{deals.length}</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">CA Gagné</p>
          <p className="text-xl font-bold mt-1 text-primary">€{(totalCA / 1000).toFixed(0)}K</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Commissions</p>
          <p className="text-xl font-bold mt-1 text-primary">€{(totalComm / 1000).toFixed(1)}K</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-xs text-muted-foreground">Taux de closing</p>
          <p className="text-xl font-bold mt-1">{deals.length ? Math.round((deals.filter(d => d.status === "Gagné").length / deals.length) * 100) : 0}%</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un deal ou client..."
            className="w-full h-10 rounded-lg border border-input bg-secondary/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        <div className="flex gap-2">
          {(["Tous", "En cours", "Gagné", "Perdu"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${filterStatus === s ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">Deal</th>
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">Client</th>
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium cursor-pointer select-none" onClick={() => toggleSort("amount")}>
                  <span className="flex items-center gap-1">Montant <ArrowUpDown size={12} /></span>
                </th>
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium cursor-pointer select-none" onClick={() => toggleSort("commission")}>
                  <span className="flex items-center gap-1">Commission <ArrowUpDown size={12} /></span>
                </th>
                <th className="text-left px-5 py-3 text-xs text-muted-foreground font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d) => (
                <tr key={d.id} className="border-b border-border/20 last:border-0 hover:bg-secondary/30 transition-colors">
                  <td className="px-5 py-3.5 font-medium">{d.name}</td>
                  <td className="px-5 py-3.5 text-muted-foreground">{d.client}</td>
                  <td className="px-5 py-3.5">€{d.amount.toLocaleString("fr-FR")}</td>
                  <td className="px-5 py-3.5 text-primary">€{d.commission.toLocaleString("fr-FR")}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColor[d.status]}`}>{d.status}</span>
                  </td>
                </tr>
              ))}
              {sorted.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-muted-foreground">Aucun deal trouvé</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DealsView;
