import { useState } from "react";
import { X, Plus } from "lucide-react";
import { clients as seedClients } from "@/data/mocks";

type Offer = { name: string; amount: number; split: number };
type Client = typeof seedClients[number] & { type: string[] };

const NICHES = ["Développement perso", "Business en ligne", "Immobilier", "Trading", "Bien-être", "Autre"];

const ClientModal = ({ open, onClose, onCreate }: { open: boolean; onClose: () => void; onCreate: (c: any) => void }) => {
  const [name, setName] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [niche, setNiche] = useState(NICHES[0]);
  const [offers, setOffers] = useState<Offer[]>([{ name: "", amount: 0, split: 1 }]);

  if (!open) return null;

  const toggleType = (t: string) =>
    setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(13,17,23,0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-[14px] border-hair p-5 max-h-[90vh] overflow-y-auto"
        style={{ background: "#161d2e", borderColor: "#2a3a50" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-bold text-white">Ajouter un client</h2>
          <button onClick={onClose} className="text-muted hover:text-white"><X size={16} /></button>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Nom du client</span>
            <input
              value={name} onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 h-9 rounded-[10px] border-hair px-3 text-[12px] text-white"
              style={{ background: "#0D1117", borderColor: "#2a3a50" }}
              placeholder="ex: Thomas Coaching"
            />
          </label>

          <div>
            <span className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Type</span>
            <div className="flex gap-2 mt-1.5">
              {[
                { id: "VSL",       color: "#9B7FE8" },
                { id: "Challenge", color: "#3B82F6" },
              ].map(({ id, color }) => {
                const active = types.includes(id);
                return (
                  <button key={id} onClick={() => toggleType(id)}
                    className="px-3 h-8 rounded-full text-[11px] font-bold border-hair flex items-center gap-1.5 transition-150"
                    style={{
                      background: active ? `${color}22` : "transparent",
                      borderColor: active ? color : "#2a3a50",
                      color: active ? color : "#8892a0",
                    }}
                  >
                    {active && <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />}
                    {id}
                  </button>
                );
              })}
            </div>
          </div>

          <label className="block">
            <span className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Niche</span>
            <select
              value={niche} onChange={(e) => setNiche(e.target.value)}
              className="w-full mt-1 h-9 rounded-[10px] border-hair px-3 text-[12px] text-white"
              style={{ background: "#0D1117", borderColor: "#2a3a50" }}
            >
              {NICHES.map(n => <option key={n} value={n} style={{ background: "#0D1117" }}>{n}</option>)}
            </select>
          </label>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Offres</span>
              <button
                onClick={() => setOffers((o) => [...o, { name: "", amount: 0, split: 1 }])}
                className="text-[10px] font-bold flex items-center gap-1"
                style={{ color: "#0EFF9C" }}
              >
                <Plus size={12} /> Ajouter une offre
              </button>
            </div>
            <div className="space-y-2">
              {offers.map((o, i) => (
                <div key={i} className="rounded-[10px] border-hair p-3 space-y-2" style={{ background: "#0D1117", borderColor: "#2a3a50" }}>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={o.name}
                      onChange={(e) => setOffers((arr) => arr.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                      placeholder="Nom de l'offre"
                      className="h-8 rounded-md border-hair px-2 text-[11px] text-white"
                      style={{ background: "#161d2e", borderColor: "#2a3a50" }}
                    />
                    <input
                      type="number" value={o.amount}
                      onChange={(e) => setOffers((arr) => arr.map((x, j) => j === i ? { ...x, amount: +e.target.value } : x))}
                      placeholder="€"
                      className="h-8 rounded-md border-hair px-2 text-[11px] text-white"
                      style={{ background: "#161d2e", borderColor: "#2a3a50" }}
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-[10px]" style={{ color: "#8892a0" }}>
                      <span>Règlement</span>
                      <span style={{ color: "#0EFF9C" }} className="font-bold">X{o.split}</span>
                    </div>
                    <input
                      type="range" min={1} max={10} value={o.split}
                      onChange={(e) => setOffers((arr) => arr.map((x, j) => j === i ? { ...x, split: +e.target.value } : x))}
                      className="w-full mt-1 accent-[#0EFF9C]"
                      style={{ background: "linear-gradient(90deg,#0EFF9C33,#0EFF9C)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => { onCreate({ name, types, niche, offers }); onClose(); }}
            className="w-full h-10 rounded-[10px] font-bold text-[12px] transition-150"
            style={{ background: "#0EFF9C", color: "#0D1117" }}
          >Enregistrer le client</button>
        </div>
      </div>
    </div>
  );
};

const ClientsPage = () => {
  const [list, setList] = useState<Client[]>(seedClients as Client[]);
  const [open, setOpen] = useState(false);

  return (
    <div className="animate-fade-in space-y-5 max-w-[1280px]">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-white">Mes clients</h2>
          <p className="text-[11px]" style={{ color: "#8892a0" }}>{list.length} clients actifs</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="h-9 px-4 rounded-[10px] text-[11px] font-bold transition-150"
          style={{ background: "#0EFF9C", color: "#0D1117" }}
        >+ Nouveau client</button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {list.map((c) => {
          const pillColors: Record<string, string> = { Challenge: "#3B82F6", VSL: "#9B7FE8" };
          const nicheColor = c.color;
          return (
            <div
              key={c.id}
              className="rounded-[12px] border-hair p-4 flex flex-col gap-3 transition-150 hover:scale-[1.005]"
              style={{ background: "#161d2e", borderColor: "#2a3a50" }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = c.color)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a3a50")}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold"
                  style={{ background: `${c.color}22`, color: c.color, border: `0.5px solid ${c.color}55` }}
                >{c.initials}</div>
                <div>
                  <p className="text-[13px] font-bold text-white leading-tight">{c.name}</p>
                </div>
              </div>

              <div className="flex gap-1.5 flex-wrap">
                <span
                  className="text-[9px] font-bold px-2 py-1 rounded-full"
                  style={{ background: `${nicheColor}18`, color: nicheColor }}
                >{c.niche}</span>
                {c.type.map((t) => (
                  <span key={t}
                    className="text-[9px] font-bold px-2 py-1 rounded-full"
                    style={{ background: `${pillColors[t]}18`, color: pillColors[t] }}
                  >{t}</span>
                ))}
              </div>

              <div className="flex items-center justify-between border-t-[0.5px] pt-3" style={{ borderColor: "#2a3a50" }}>
                <span className="text-[14px] font-bold" style={{ color: "#0EFF9C" }}>
                  {c.amount.toLocaleString("fr-FR")}€
                </span>
                <span className="text-[10px]" style={{ color: "#8892a0" }}>
                  {c.offers} offre{c.offers > 1 ? "s" : ""}
                </span>
              </div>
            </div>
          );
        })}

        <button
          onClick={() => setOpen(true)}
          className="rounded-[12px] p-4 flex items-center justify-center text-[12px] font-bold transition-150 hover:bg-white/[0.02]"
          style={{ border: "1.5px dashed #2a3a50", color: "#6b7a99", minHeight: 132 }}
        >+ Ajouter un client</button>
      </div>

      <ClientModal
        open={open}
        onClose={() => setOpen(false)}
        onCreate={(c) => {
          const id = list.length + 1;
          const initials = c.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase() || "??";
          setList((l) => [
            ...l,
            {
              id, initials, name: c.name || "Sans nom",
              color: "#3B82F6", niche: c.niche, type: c.types,
              amount: c.offers.reduce((s: number, o: Offer) => s + o.amount, 0),
              offers: c.offers.length,
            },
          ]);
        }}
      />
    </div>
  );
};

export default ClientsPage;
