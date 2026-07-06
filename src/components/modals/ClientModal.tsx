import { useState } from "react";
import { X, Plus } from "lucide-react";
import * as S from '@/pages/Clients.styles';

type Offer = { name: string; amount: number; split: number };

const NICHES = ["Développement perso", "Business en ligne", "Immobilier", "Trading", "Bien-être", "Autre"];

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (client: { name: string; types: string[]; niche: string; offers: Offer[] }) => void;
}

export const ClientModal = ({ open, onClose, onCreate }: ClientModalProps) => {
  const [name, setName] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [niche, setNiche] = useState(NICHES[0]);
  const [offers, setOffers] = useState<Offer[]>([{ name: "", amount: 0, split: 1 }]);

  if (!open) return null;

  const toggleType = (t: string) =>
    setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const handleSubmit = () => {
    onCreate({ name, types, niche, offers });
    setName("");
    setTypes([]);
    setNiche(NICHES[0]);
    setOffers([{ name: "", amount: 0, split: 1 }]);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={S.modalOverlay}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[480px] rounded-[14px] border-hair p-5 max-h-[90vh] overflow-y-auto"
        style={S.modalCard}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-bold text-white">Ajouter un client</h2>
          <button onClick={onClose} className="text-muted hover:text-white"><X size={16} /></button>
        </div>

        <div className="space-y-3">
          <label className="block">
            <span className="text-[10px] uppercase tracking-wide font-bold" style={S.labelStyle}>Nom du client</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 h-9 rounded-[10px] border-hair px-3 text-[12px] text-white"
              style={S.inputStyle}
              placeholder="ex: Thomas Coaching"
            />
          </label>

          <TypeSelector types={types} onToggle={toggleType} />

          <label className="block">
            <span className="text-[10px] uppercase tracking-wide font-bold" style={S.labelStyle}>Niche</span>
            <select
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              className="w-full mt-1 h-9 rounded-[10px] border-hair px-3 text-[12px] text-white"
              style={S.inputStyle}
            >
              {NICHES.map((n) => (
                <option key={n} value={n} style={S.optionStyle}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <OffersSection offers={offers} onOffersChange={setOffers} />

          <button
            onClick={handleSubmit}
            className="w-full h-10 rounded-[10px] font-bold text-[12px] transition-150"
            style={S.submitButtonStyle}
          >
            Enregistrer le client
          </button>
        </div>
      </div>
    </div>
  );
};

const TypeSelector = ({
  types,
  onToggle,
}: {
  types: string[];
  onToggle: (type: string) => void;
}) => (
  <div>
    <span className="text-[10px] uppercase tracking-wide font-bold" style={S.labelStyle}>
      Type
    </span>
    <div className="flex gap-2 mt-1.5">
      {[
        { id: "VSL", color: "#9B7FE8" },
        { id: "Challenge", color: "#3B82F6" },
      ].map(({ id, color }) => {
        const active = types.includes(id);
        return (
          <button
            key={id}
            onClick={() => onToggle(id)}
            className="px-3 h-8 rounded-full text-[11px] font-bold border-hair flex items-center gap-1.5 transition-150"
            style={S.typeButtonStyle(active, color)}
          >
            {active && <span className="w-1.5 h-1.5 rounded-full" style={S.typeBadgeStyle(color)} />}
            {id}
          </button>
        );
      })}
    </div>
  </div>
);

const OffersSection = ({
  offers,
  onOffersChange,
}: {
  offers: Offer[];
  onOffersChange: (offers: Offer[]) => void;
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] uppercase tracking-wide font-bold" style={S.labelStyle}>
        Offres
      </span>
      <button
        onClick={() => onOffersChange([...offers, { name: "", amount: 0, split: 1 }])}
        className="text-[10px] font-bold flex items-center gap-1"
        style={S.addOfferButtonStyle}
      >
        <Plus size={12} /> Ajouter une offre
      </button>
    </div>
    <div className="space-y-2">
      {offers.map((o, i) => (
        <OfferCard
          key={i}
          offer={o}
          index={i}
          onUpdate={(updated) => {
            const newOffers = [...offers];
            newOffers[i] = updated;
            onOffersChange(newOffers);
          }}
        />
      ))}
    </div>
  </div>
);

const OfferCard = ({
  offer,
  index,
  onUpdate,
}: {
  offer: Offer;
  index: number;
  onUpdate: (offer: Offer) => void;
}) => (
  <div className="rounded-[10px] border-hair p-3 space-y-2" style={S.offerCardStyle}>
    <div className="grid grid-cols-2 gap-2">
      <input
        value={offer.name}
        onChange={(e) => onUpdate({ ...offer, name: e.target.value })}
        placeholder="Nom de l'offre"
        className="h-8 rounded-md border-hair px-2 text-[11px] text-white"
        style={S.offerInputStyle}
      />
      <input
        type="number"
        value={offer.amount}
        onChange={(e) => onUpdate({ ...offer, amount: Number(e.target.value) || 0 })}
        placeholder="€"
        className="h-8 rounded-md border-hair px-2 text-[11px] text-white"
        style={S.offerInputStyle}
      />
    </div>
    <div>
      <div className="flex items-center justify-between text-[10px]" style={S.splitLabelStyle}>
        <span>Règlement</span>
        <span style={S.splitValueStyle} className="font-bold">
          X{offer.split}
        </span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={offer.split}
        onChange={(e) => onUpdate({ ...offer, split: Number(e.target.value) || 1 })}
        className="w-full mt-1 accent-[#0EFF9C]"
        style={S.sliderStyle}
      />
    </div>
  </div>
);
