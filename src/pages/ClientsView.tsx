import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Search, Users, Eye } from "lucide-react";

interface Client {
  id: string;
  name: string;
  niche: string;
  status: "Actif" | "Inactif";
  challenges: number;
}

const mockClients: Client[] = [
  { id: "1", name: "Alex Hormozi FR", niche: "Business & Scaling", status: "Actif", challenges: 3 },
  { id: "2", name: "Marie Coaching", niche: "Développement personnel", status: "Actif", challenges: 2 },
  { id: "3", name: "Pierre Fitness Pro", niche: "Fitness & Santé", status: "Inactif", challenges: 1 },
];

const niches = ["Business & Scaling", "Développement personnel", "Fitness & Santé", "Immobilier", "Trading & Finance", "E-commerce", "Autre"];

const ClientsView = () => {
  const [clients, setClients] = useState(mockClients);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", niche: niches[0], status: "Actif" as const });

  const filtered = clients.filter(
    (c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.niche.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!newClient.name.trim()) return;
    setClients([
      ...clients,
      { id: String(Date.now()), name: newClient.name, niche: newClient.niche, status: newClient.status, challenges: 0 },
    ]);
    setNewClient({ name: "", niche: niches[0], status: "Actif" });
    setShowModal(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Mes Clients</h2>
          <p className="text-muted-foreground text-sm mt-1">Gérez vos infopreneurs et leurs challenges</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-primary-foreground px-4 py-2.5 rounded-[10px] text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2 shrink-0"
        >
          <Plus size={16} /> Ajouter un client
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher un client ou une niche..."
          className="w-full h-10 rounded-[10px] border border-border/50 bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Client Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((client) => (
          <div key={client.id} className="bg-card border border-border/50 rounded-[10px] p-5 hover:scale-[1.02] transition-transform">
            <div className="flex items-start justify-between mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users size={18} className="text-primary" />
              </div>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                  client.status === "Actif" ? "bg-primary/15 text-primary" : "bg-muted/30 text-muted-foreground"
                }`}
              >
                {client.status}
              </span>
            </div>
            <h3 className="font-semibold text-foreground mb-1">{client.name}</h3>
            <span className="text-[11px] text-muted-foreground bg-background px-2 py-0.5 rounded-full">{client.niche}</span>
            <p className="text-xs text-muted-foreground mt-3">{client.challenges} challenge{client.challenges > 1 ? "s" : ""}</p>
            <Link
              to={`/clients/${client.id}`}
              className="mt-4 w-full flex items-center justify-center gap-2 h-9 rounded-lg border border-border/50 text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            >
              <Eye size={14} /> Voir la fiche
            </Link>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground">Aucun client trouvé</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/70" />
          <div
            className="relative bg-card border border-border/50 rounded-2xl p-6 w-full max-w-[460px] mx-4 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              ×
            </button>
            <h3 className="text-[15px] font-bold mb-4">Ajouter un client</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">Nom de l'infopreneur</label>
                <input
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  className="w-full h-10 rounded-lg border border-border/50 bg-background px-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  placeholder="Ex: Alex Hormozi FR"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">Niche</label>
                <select
                  value={newClient.niche}
                  onChange={(e) => setNewClient({ ...newClient, niche: e.target.value })}
                  className="w-full h-10 rounded-lg border border-border/50 bg-background px-3 text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                >
                  {niches.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground block mb-1">Statut</label>
                <div className="flex gap-2">
                  {(["Actif", "Inactif"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setNewClient({ ...newClient, status: s })}
                      className={`flex-1 h-10 rounded-lg text-sm font-medium transition-all ${
                        newClient.status === s
                          ? s === "Actif" ? "bg-primary/15 text-primary border border-primary/30" : "bg-muted/30 text-muted-foreground border border-border/50"
                          : "bg-background border border-border/50 text-muted-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleAdd}
                className="w-full h-10 rounded-[10px] bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientsView;
