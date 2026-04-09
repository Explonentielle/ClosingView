import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Plus, Calendar } from "lucide-react";

interface DealEntry {
  prenom: string;
  montantContracte: number;
  montantCollecte: number;
  typeVente: "Full Pay" | "Split Pay";
  mensualites?: number;
  dateR1: string;
  dateClose: string;
  closeEnR1: boolean;
}

interface Session {
  id: string;
  date: string;
  r1Plan: number;
  r1Eff: number;
  r2Plan: number;
  r2Eff: number;
  closes: number;
  cash: number;
  sentiment: string;
  deals: DealEntry[];
}

const sentimentEmojis = ["😊", "😐", "😤", "🔥", "😴"];

const mockSessions: Session[] = [
  { id: "s1", date: "2026-03-31", r1Plan: 4, r1Eff: 3, r2Plan: 2, r2Eff: 1, closes: 1, cash: 1800, sentiment: "😊", deals: [{ prenom: "Sophie", montantContracte: 3000, montantCollecte: 1800, typeVente: "Split Pay", mensualites: 3, dateR1: "2026-03-28", dateClose: "2026-03-31", closeEnR1: false }] },
  { id: "s2", date: "2026-03-28", r1Plan: 5, r1Eff: 5, r2Plan: 3, r2Eff: 2, closes: 2, cash: 4200, sentiment: "🔥", deals: [{ prenom: "Marc", montantContracte: 2500, montantCollecte: 2500, typeVente: "Full Pay", dateR1: "2026-03-28", dateClose: "2026-03-28", closeEnR1: true }, { prenom: "Léa", montantContracte: 2000, montantCollecte: 1700, typeVente: "Split Pay", mensualites: 2, dateR1: "2026-03-25", dateClose: "2026-03-28", closeEnR1: false }] },
  { id: "s3", date: "2026-03-25", r1Plan: 4, r1Eff: 4, r2Plan: 1, r2Eff: 0, closes: 0, cash: 0, sentiment: "😐", deals: [] },
];

const challengeData = {
  name: "Challenge Mars",
  client: "Alex Hormozi FR",
  startDate: "2026-03-03",
  endDate: "2026-03-28",
  status: "En cours",
};

const ChallengeView = () => {
  const { id } = useParams();
  const [sessions, setSessions] = useState(mockSessions);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ r1Plan: 0, r1Eff: 0, r2Plan: 0, r2Eff: 0, closes: 0, cash: 0, sentiment: "😊" });
  const [deals, setDeals] = useState<DealEntry[]>([]);
  const [showDealForm, setShowDealForm] = useState(false);
  const [dealForm, setDealForm] = useState<DealEntry>({ prenom: "", montantContracte: 0, montantCollecte: 0, typeVente: "Full Pay", dateR1: "", dateClose: new Date().toISOString().slice(0, 10), closeEnR1: true });
  const [prenomError, setPrenomError] = useState("");

  const today = new Date().toISOString().slice(0, 10);

  const handleSave = () => {
    const newSession: Session = {
      id: String(Date.now()),
      date: today,
      ...form,
      deals,
    };
    setSessions([newSession, ...sessions]);
    setShowModal(false);
    setForm({ r1Plan: 0, r1Eff: 0, r2Plan: 0, r2Eff: 0, closes: 0, cash: 0, sentiment: "😊" });
    setDeals([]);
  };

  const addDeal = () => {
    if (dealForm.prenom.trim().split(/\s+/).length > 1) {
      setPrenomError("1 mot maximum");
      return;
    }
    if (dealForm.montantCollecte > dealForm.montantContracte) return;
    setPrenomError("");
    setDeals([...deals, dealForm]);
    setDealForm({ prenom: "", montantContracte: 0, montantCollecte: 0, typeVente: "Full Pay", dateR1: "", dateClose: today, closeEnR1: true });
    setShowDealForm(false);
  };

  const calcDelai = (d: DealEntry) => {
    const diff = Math.abs(new Date(d.dateClose).getTime() - new Date(d.dateR1).getTime());
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <Link to="/clients" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={16} /> Retour
      </Link>

      {/* Header */}
      <div className="bg-card border border-border/50 rounded-[12px] p-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <p className="text-[11px] text-muted-foreground mb-1">{challengeData.client}</p>
            <h2 className="text-2xl font-bold">{challengeData.name}</h2>
            <p className="text-xs text-muted-foreground mt-1">{challengeData.startDate} → {challengeData.endDate}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">{challengeData.status}</span>
            <button onClick={() => setShowModal(true)} className="bg-primary text-primary-foreground px-4 py-2 rounded-[10px] text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-2">
              <Plus size={14} /> Saisir aujourd'hui
            </button>
          </div>
        </div>
      </div>

      {/* Sessions History */}
      <div>
        <h3 className="font-semibold mb-3">Historique des sessions</h3>
        <div className="space-y-2">
          {sessions.map((s) => {
            const taux = s.r1Eff > 0 ? Math.round((s.closes / s.r1Eff) * 100) : 0;
            return (
              <div key={s.id} className="bg-card border border-border/50 rounded-[10px] p-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <Calendar size={14} className="text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{s.date}</span>
                    <span className="text-lg">{s.sentiment}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs">
                    <span><span className="text-muted-foreground">R1:</span> <span className="font-semibold">{s.r1Eff}/{s.r1Plan}</span></span>
                    <span><span className="text-muted-foreground">R2:</span> <span className="font-semibold">{s.r2Eff}/{s.r2Plan}</span></span>
                    <span><span className="text-muted-foreground">Closes:</span> <span className="font-semibold text-primary">{s.closes}</span></span>
                    <span><span className="text-muted-foreground">Cash:</span> <span className="font-semibold text-primary">{s.cash}€</span></span>
                    <span><span className="text-muted-foreground">Taux:</span> <span className="font-semibold">{taux}%</span></span>
                  </div>
                </div>
                {s.deals.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {s.deals.map((d, i) => (
                      <div key={i} className="text-[11px] text-muted-foreground bg-background rounded-lg px-3 py-2 flex items-center justify-between">
                        <span className="font-medium text-foreground">{d.prenom}</span>
                        <span>{d.montantContracte}€ · {d.typeVente} · {calcDelai(d)}j</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Saisie Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative bg-card border border-border/50 rounded-2xl p-6 w-full max-w-[520px] mx-4 animate-scale-in max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 w-7 h-7 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground">×</button>
            <h3 className="text-[15px] font-bold mb-1">Saisie journalière</h3>
            <p className="text-[11px] text-muted-foreground mb-4">{today}</p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "R1 Planifiés", key: "r1Plan" },
                { label: "R1 Effectués", key: "r1Eff" },
                { label: "R2 Planifiés", key: "r2Plan" },
                { label: "R2 Effectués", key: "r2Eff" },
                { label: "Closes", key: "closes" },
                { label: "Cash collecté (€)", key: "cash" },
              ].map((f) => (
                <div key={f.key}>
                  <label className="text-[10px] text-muted-foreground block mb-1">{f.label}</label>
                  <input
                    type="number"
                    min={0}
                    value={(form as any)[f.key]}
                    onChange={(e) => setForm({ ...form, [f.key]: Math.max(0, Number(e.target.value)) })}
                    className="w-full h-10 rounded-lg border border-border/50 bg-background px-3 text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              ))}
            </div>

            {/* Sentiment */}
            <div className="mb-4">
              <label className="text-[10px] text-muted-foreground block mb-2">Sentiment</label>
              <div className="flex gap-2">
                {sentimentEmojis.map((e) => (
                  <button
                    key={e}
                    onClick={() => setForm({ ...form, sentiment: e })}
                    className={`text-2xl p-1 rounded-lg transition-all ${form.sentiment === e ? "bg-primary/15 scale-110" : "opacity-50 hover:opacity-100"}`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Deals */}
            {form.closes > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] text-muted-foreground">{deals.length} deal{deals.length > 1 ? "s" : ""} saisi{deals.length > 1 ? "s" : ""}</span>
                  {deals.length < form.closes && (
                    <button onClick={() => setShowDealForm(true)} className="text-xs text-primary hover:underline flex items-center gap-1">
                      <Plus size={12} /> Ajouter un deal
                    </button>
                  )}
                </div>
                {deals.map((d, i) => (
                  <div key={i} className="text-[11px] bg-background rounded-lg px-3 py-2 mb-1 text-muted-foreground">
                    {d.prenom} · {d.montantContracte}€ · {d.typeVente}
                  </div>
                ))}
              </div>
            )}

            {/* Deal sub-form */}
            {showDealForm && (
              <div className="bg-background border border-border/50 rounded-[10px] p-4 mb-4 space-y-3">
                <h4 className="text-[12px] font-semibold">Fiche deal</h4>
                <div>
                  <input placeholder="Prénom (1 mot)" value={dealForm.prenom} onChange={(e) => { setDealForm({ ...dealForm, prenom: e.target.value }); setPrenomError(""); }} className="w-full h-9 rounded-lg border border-border/50 bg-card px-3 text-sm focus:outline-none focus:border-primary" />
                  {prenomError && <p className="text-[10px] text-destructive mt-1">{prenomError}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">Montant contracté</label>
                    <input type="number" min={0} value={dealForm.montantContracte} onChange={(e) => setDealForm({ ...dealForm, montantContracte: Math.max(0, Number(e.target.value)) })} className="w-full h-9 rounded-lg border border-border/50 bg-card px-3 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">Montant collecté</label>
                    <input type="number" min={0} value={dealForm.montantCollecte} onChange={(e) => setDealForm({ ...dealForm, montantCollecte: Math.min(dealForm.montantContracte, Math.max(0, Number(e.target.value))) })} className="w-full h-9 rounded-lg border border-border/50 bg-card px-3 text-sm focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">Type de vente</label>
                    <select value={dealForm.typeVente} onChange={(e) => setDealForm({ ...dealForm, typeVente: e.target.value as any })} className="w-full h-9 rounded-lg border border-border/50 bg-card px-3 text-sm focus:outline-none focus:border-primary">
                      <option>Full Pay</option>
                      <option>Split Pay</option>
                    </select>
                  </div>
                  {dealForm.typeVente === "Split Pay" && (
                    <div>
                      <label className="text-[10px] text-muted-foreground block mb-1">Mensualités</label>
                      <select value={dealForm.mensualites || 2} onChange={(e) => setDealForm({ ...dealForm, mensualites: Number(e.target.value) })} className="w-full h-9 rounded-lg border border-border/50 bg-card px-3 text-sm focus:outline-none focus:border-primary">
                        {[2, 3, 4, 6, 8, 10].map((n) => <option key={n} value={n}>x{n}</option>)}
                      </select>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">Date R1</label>
                    <input type="date" value={dealForm.dateR1} onChange={(e) => setDealForm({ ...dealForm, dateR1: e.target.value })} className="w-full h-9 rounded-lg border border-border/50 bg-card px-3 text-sm focus:outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-[10px] text-muted-foreground block mb-1">Date close</label>
                    <input type="date" value={dealForm.dateClose} onChange={(e) => setDealForm({ ...dealForm, dateClose: e.target.value })} className="w-full h-9 rounded-lg border border-border/50 bg-card px-3 text-sm focus:outline-none focus:border-primary" />
                  </div>
                </div>
                <div className="flex gap-2">
                  {["R1", "R2"].map((r) => (
                    <button key={r} onClick={() => setDealForm({ ...dealForm, closeEnR1: r === "R1" })} className={`flex-1 h-9 rounded-lg text-xs font-medium transition-all ${dealForm.closeEnR1 === (r === "R1") ? "bg-primary/15 text-primary border border-primary/30" : "bg-card border border-border/50 text-muted-foreground"}`}>
                      Closé en {r}
                    </button>
                  ))}
                </div>
                {dealForm.dateR1 && dealForm.dateClose && (
                  <p className="text-[10px] text-muted-foreground">Délai de conversion : {Math.abs(Math.ceil((new Date(dealForm.dateClose).getTime() - new Date(dealForm.dateR1).getTime()) / 86400000))} jours</p>
                )}
                <div className="flex gap-2">
                  <button onClick={() => setShowDealForm(false)} className="flex-1 h-9 rounded-lg border border-border/50 text-sm text-muted-foreground">Annuler</button>
                  <button onClick={addDeal} className="flex-1 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-semibold">Valider</button>
                </div>
              </div>
            )}

            <button onClick={handleSave} className="w-full h-10 rounded-[10px] bg-primary text-primary-foreground font-semibold text-sm mt-2">Enregistrer la session</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallengeView;
