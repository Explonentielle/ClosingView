import { MapPin, Phone, Mail, TrendingUp } from "lucide-react";
import { useState } from "react";

const regions = [
  { id: 1, name: "Paris", x: 48, y: 30, deals: 45, revenue: "€120K", agents: 12, color: "bg-primary" },
  { id: 2, name: "Lyon", x: 52, y: 55, deals: 28, revenue: "€67K", agents: 8, color: "bg-accent" },
  { id: 3, name: "Marseille", x: 55, y: 72, deals: 19, revenue: "€45K", agents: 5, color: "bg-primary" },
  { id: 4, name: "Bordeaux", x: 30, y: 58, deals: 22, revenue: "€52K", agents: 6, color: "bg-accent" },
  { id: 5, name: "Lille", x: 50, y: 12, deals: 15, revenue: "€38K", agents: 4, color: "bg-primary" },
  { id: 6, name: "Toulouse", x: 35, y: 70, deals: 18, revenue: "€41K", agents: 5, color: "bg-accent" },
];

const MapView = () => {
  const [selected, setSelected] = useState<typeof regions[0] | null>(null);

  return (
    <div className="space-y-6 animate-slide-up">
      <div>
        <h2 className="text-2xl font-bold">Carte Interactive</h2>
        <p className="text-muted-foreground text-sm mt-1">Performance par région</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass-card p-6 relative overflow-hidden" style={{ minHeight: 420 }}>
          {/* Simplified France map outline */}
          <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 p-6 opacity-20">
            <path
              d="M45 5 L55 8 L62 15 L60 25 L65 35 L60 45 L65 55 L60 65 L55 75 L45 80 L35 75 L28 65 L25 55 L30 45 L28 35 L32 25 L38 15 Z"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="0.5"
            />
          </svg>
          
          {/* Region pins */}
          {regions.map((r) => (
            <button
              key={r.id}
              onClick={() => setSelected(r)}
              className={`absolute transition-all duration-300 group ${selected?.id === r.id ? 'scale-150 z-10' : 'hover:scale-125'}`}
              style={{ left: `${r.x}%`, top: `${r.y}%`, transform: 'translate(-50%, -50%)' }}
            >
              <div className={`w-4 h-4 ${r.color} rounded-full animate-pulse-glow`} />
              <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-card px-2 py-0.5 rounded border border-border">
                {r.name}
              </span>
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {selected ? (
            <div className="glass-card p-5 space-y-4 animate-slide-up">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-primary" />
                <h3 className="font-bold text-lg">{selected.name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Deals</p>
                  <p className="text-xl font-bold font-mono">{selected.deals}</p>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Revenue</p>
                  <p className="text-xl font-bold font-mono">{selected.revenue}</p>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Agents</p>
                  <p className="text-xl font-bold font-mono">{selected.agents}</p>
                </div>
                <div className="bg-secondary rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Croissance</p>
                  <p className="text-xl font-bold font-mono text-accent">+15%</p>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors">
                  <Phone size={14} /> Contacter l'équipe
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-colors">
                  <TrendingUp size={14} /> Voir les détails
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card p-5 flex flex-col items-center justify-center text-center h-64">
              <MapPin size={32} className="text-muted-foreground mb-3" />
              <p className="text-muted-foreground text-sm">Cliquez sur une région pour voir les détails</p>
            </div>
          )}

          <div className="glass-card p-5">
            <h3 className="font-semibold text-sm mb-3">Top Régions</h3>
            <div className="space-y-2">
              {regions.sort((a, b) => b.deals - a.deals).slice(0, 4).map((r, i) => (
                <div key={r.id} className="flex items-center gap-2 text-sm">
                  <span className="text-xs font-mono text-muted-foreground w-4">#{i + 1}</span>
                  <span className="flex-1">{r.name}</span>
                  <span className="font-mono text-primary">{r.deals}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
