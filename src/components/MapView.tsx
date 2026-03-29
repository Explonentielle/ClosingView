import { MapPin, Phone, Mail, Search, ZoomIn, ZoomOut, User } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import CloserBadge, { getBadgesForCA } from "@/components/CloserBadge";

interface Closer {
  id: number;
  name: string;
  role: string;
  city: string;
  sectors: string[];
  available: boolean;
  avatar: string;
  deals: number;
  revenue: string;
  ca: number;
  email: string;
  phone: string;
}

const closers: Closer[] = [
  { id: 1, name: "Sophie Martin", role: "Senior Closer", city: "Paris", sectors: ["SaaS", "B2B"], available: true, avatar: "SM", deals: 52, revenue: "€145K", ca: 145000, email: "sophie@closeone.io", phone: "+33 6 12 34 56 78" },
  { id: 2, name: "Lucas Bernard", role: "Closer", city: "Lyon", sectors: ["E-commerce"], available: true, avatar: "LB", deals: 47, revenue: "€132K", ca: 132000, email: "lucas@closeone.io", phone: "+33 6 23 45 67 89" },
  { id: 3, name: "Emma Dubois", role: "Senior Closer", city: "Marseille", sectors: ["Finance", "Assurance"], available: false, avatar: "ED", deals: 43, revenue: "€118K", ca: 118000, email: "emma@closeone.io", phone: "+33 6 34 56 78 90" },
  { id: 4, name: "Thomas Petit", role: "Closer", city: "Bordeaux", sectors: ["Coaching"], available: true, avatar: "TP", deals: 38, revenue: "€98K", ca: 98000, email: "thomas@closeone.io", phone: "+33 6 45 67 89 01" },
  { id: 5, name: "Léa Moreau", role: "Closer", city: "Lille", sectors: ["Marketing", "SaaS"], available: true, avatar: "LM", deals: 35, revenue: "€92K", ca: 92000, email: "lea@closeone.io", phone: "+33 6 56 78 90 12" },
  { id: 6, name: "Hugo Laurent", role: "Junior Closer", city: "Toulouse", sectors: ["Santé"], available: false, avatar: "HL", deals: 31, revenue: "€84K", ca: 84000, email: "hugo@closeone.io", phone: "+33 6 67 89 01 23" },
  { id: 7, name: "Chloé Roux", role: "Closer", city: "Nantes", sectors: ["B2B", "Tech"], available: true, avatar: "CR", deals: 28, revenue: "€76K", ca: 76000, email: "chloe@closeone.io", phone: "+33 6 78 90 12 34" },
  { id: 8, name: "Antoine Leroy", role: "Closer", city: "Strasbourg", sectors: ["Finance"], available: true, avatar: "AL", deals: 25, revenue: "€68K", ca: 68000, email: "antoine@closeone.io", phone: "+33 6 89 01 23 45" },
];

const cityPositions: Record<string, { x: number; y: number }> = {
  Paris: { x: 48, y: 28 },
  Lyon: { x: 52, y: 55 },
  Marseille: { x: 55, y: 74 },
  Bordeaux: { x: 28, y: 58 },
  Lille: { x: 50, y: 10 },
  Toulouse: { x: 34, y: 72 },
  Nantes: { x: 22, y: 40 },
  Strasbourg: { x: 68, y: 28 },
};

const MapView = () => {
  const [selected, setSelected] = useState<Closer | null>(null);
  const [search, setSearch] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterAvail, setFilterAvail] = useState<"all" | "available" | "unavailable">("all");
  const [zoom, setZoom] = useState(1);

  const filtered = closers.filter((c) => {
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.city.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterCity && c.city !== filterCity) return false;
    if (filterAvail === "available" && !c.available) return false;
    if (filterAvail === "unavailable" && c.available) return false;
    return true;
  });

  const cities = [...new Set(closers.map((c) => c.city))];

  const handleContact = (type: "phone" | "email") => {
    if (!selected) return;
    if (type === "phone") toast.success(`Appel vers ${selected.phone}`, { description: selected.name });
    else toast.success(`Email envoyé à ${selected.email}`, { description: selected.name });
  };

  const isElite = (c: Closer) => c.ca >= 50000;

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold">Carte des Closers</h2>
        <p className="text-muted-foreground text-sm mt-1">Localisez les closers disponibles</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher par nom ou ville..." className="w-full h-10 rounded-lg border border-input bg-secondary/50 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)} className="h-10 rounded-lg border border-input bg-secondary/50 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
          <option value="">Toutes les villes</option>
          {cities.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex gap-1.5">
          {(["all", "available", "unavailable"] as const).map((v) => (
            <button key={v} onClick={() => setFilterAvail(v)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${filterAvail === v ? "gradient-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
              {v === "all" ? "Tous" : v === "available" ? "Dispo" : "Indispo"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Map */}
        <div className="lg:col-span-2 glass-card p-6 relative overflow-hidden" style={{ minHeight: 450 }}>
          <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
            <button onClick={() => setZoom(Math.min(zoom + 0.2, 2))} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><ZoomIn size={14} /></button>
            <button onClick={() => setZoom(Math.max(zoom - 0.2, 0.6))} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"><ZoomOut size={14} /></button>
            <button onClick={() => setZoom(1)} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors text-xs font-bold">1x</button>
          </div>

          <div style={{ transform: `scale(${zoom})`, transformOrigin: "center", transition: "transform 0.3s ease" }} className="w-full h-full">
            <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 p-6 opacity-15">
              <path d="M45 5 L55 8 L62 15 L60 25 L65 35 L60 45 L65 55 L60 65 L55 75 L45 80 L35 75 L28 65 L25 55 L30 45 L28 35 L32 25 L38 15 Z" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" />
            </svg>

            {filtered.map((c) => {
              const pos = cityPositions[c.city];
              if (!pos) return null;
              const elite = isElite(c);
              return (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className={`absolute transition-all duration-300 group ${selected?.id === c.id ? "scale-150 z-10" : "hover:scale-125"}`}
                  style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
                >
                  <div
                    className={`w-4 h-4 rounded-full ${c.available ? (elite ? "bg-yellow-400" : "bg-primary") : "bg-muted-foreground/50"} ${c.available ? "animate-pulse-glow" : ""}`}
                    style={elite && c.available ? { boxShadow: "0 0 12px #FFD70080, 0 0 24px #FFD70040" } : undefined}
                  />
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-card px-2 py-0.5 rounded border border-border">
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar detail */}
        <div className="space-y-4">
          {selected ? (
            <div className="glass-card p-5 space-y-4 animate-slide-up">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                  {selected.avatar}
                </div>
                <div>
                  <h3 className="font-bold">{selected.name}</h3>
                  <p className="text-xs text-muted-foreground">{selected.role}</p>
                </div>
              </div>
              {/* Badges */}
              <div className="flex gap-1.5 flex-wrap">
                {getBadgesForCA(selected.ca).map((b) => (
                  <CloserBadge key={b.key} badge={b} size={24} />
                ))}
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Ville</span><span>{selected.city}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Secteurs</span><span>{selected.sectors.join(", ")}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Deals</span><span className="font-semibold">{selected.deals}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">CA Mensuel</span><span className="font-semibold text-primary">{selected.revenue}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Statut</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${selected.available ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                    {selected.available ? "Disponible" : "Indisponible"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button onClick={() => handleContact("phone")} className="flex-1 h-9 rounded-lg gradient-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5">
                  <Phone size={12} /> Contacter
                </button>
                <button onClick={() => handleContact("email")} className="flex-1 h-9 rounded-lg bg-secondary text-foreground text-xs font-medium hover:bg-secondary/80 transition-colors flex items-center justify-center gap-1.5">
                  <Mail size={12} /> Email
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-5 flex flex-col items-center justify-center text-center h-48">
              <User size={28} className="text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">Cliquez sur un closer pour voir son profil</p>
            </div>
          )}

          {/* Closer list */}
          <div className="glass-card p-4">
            <h3 className="font-semibold text-sm mb-3">Closers ({filtered.length})</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {filtered.map((c) => (
                <button key={c.id} onClick={() => setSelected(c)} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-colors ${selected?.id === c.id ? "bg-primary/10" : "hover:bg-secondary"}`}>
                  <div className={`w-2 h-2 rounded-full ${c.available ? (isElite(c) ? "bg-yellow-400" : "bg-primary") : "bg-muted-foreground/50"}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.city}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{c.deals} deals</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
