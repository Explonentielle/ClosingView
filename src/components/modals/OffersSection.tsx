import { X, Plus } from "lucide-react";
import * as S from '@/pages/Clients.styles';

export type OfferFormRow = {
  id?: string;
  name: string;
  amount: number;
  split: number;
  commission_rate: number;
};

export const OffersSection = ({
  offers,
  onOffersChange,
}: {
  offers: OfferFormRow[];
  onOffersChange: (offers: OfferFormRow[]) => void;
}) => (
  <div>
    <div className="flex items-center justify-between mb-1.5">
      <span className="text-[10px] uppercase tracking-wide font-bold" style={S.labelStyle}>
        Offres
      </span>
      <button
        onClick={() => onOffersChange([...offers, { name: "", amount: 0, split: 1, commission_rate: 20 }])}
        className="text-[10px] font-bold flex items-center gap-1"
        style={S.addOfferButtonStyle}
      >
        <Plus size={12} /> Ajouter une offre
      </button>
    </div>
    <div className="space-y-2">
      {offers.map((o, i) => (
        <OfferCard
          key={o.id ?? i}
          offer={o}
          canRemove={offers.length > 1}
          onUpdate={(updated) => {
            const newOffers = [...offers];
            newOffers[i] = updated;
            onOffersChange(newOffers);
          }}
          onRemove={() => onOffersChange(offers.filter((_, idx) => idx !== i))}
        />
      ))}
    </div>
  </div>
);

const OfferCard = ({
  offer,
  canRemove,
  onUpdate,
  onRemove,
}: {
  offer: OfferFormRow;
  canRemove: boolean;
  onUpdate: (offer: OfferFormRow) => void;
  onRemove: () => void;
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
      <div className="flex items-center gap-1">
        <input
          type="number"
          value={offer.amount}
          onChange={(e) => onUpdate({ ...offer, amount: Number(e.target.value) || 0 })}
          placeholder="€"
          className="h-8 flex-1 min-w-0 rounded-md border-hair px-2 text-[11px] text-white"
          style={S.offerInputStyle}
        />
        {canRemove && (
          <button
            onClick={onRemove}
            className="h-8 w-8 flex-shrink-0 flex items-center justify-center rounded-md border-hair"
            style={S.removeOfferButtonStyle}
            title="Retirer cette offre"
          >
            <X size={13} />
          </button>
        )}
      </div>
    </div>
    <div>
      <div className="flex items-center justify-between text-[10px]" style={S.splitLabelStyle}>
        <span>Taux commission</span>
        <span style={S.splitValueStyle} className="font-bold">
          {offer.commission_rate}%
        </span>
      </div>
      <input
        type="number"
        min={0}
        max={100}
        value={offer.commission_rate}
        onChange={(e) => onUpdate({ ...offer, commission_rate: Math.min(100, Math.max(0, Number(e.target.value) || 0)) })}
        className="w-full mt-1 h-8 rounded-md border-hair px-2 text-[11px] text-white"
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
