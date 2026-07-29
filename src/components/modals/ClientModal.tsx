import { useState, useEffect } from "react";
import { X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as S from '@/pages/Clients.styles';
import { TypeSelector } from './TypeSelector';
import { OffersSection, OfferFormRow } from './OffersSection';
import { ModalOverlay } from './ModalOverlay';
import { NICHES } from '@/lib/niches';

const emptyOffer = (): OfferFormRow => ({ name: "", amount: 0, split: 1, commission_rate: 20 });

export type ClientFormData = { name: string; niche: string; types: string[]; offers: OfferFormRow[] };

interface ClientModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (client: ClientFormData) => void;
  initialClient?: ClientFormData | null;
}

export const ClientModal = ({ open, onClose, onSubmit, initialClient }: ClientModalProps) => {
  const isEdit = !!initialClient;
  const [name, setName] = useState("");
  const [types, setTypes] = useState<string[]>([]);
  const [niche, setNiche] = useState(NICHES[0]);
  const [offers, setOffers] = useState<OfferFormRow[]>([emptyOffer()]);

  useEffect(() => {
    if (!open) return;
    if (initialClient) {
      setName(initialClient.name);
      setTypes(initialClient.types);
      setNiche(initialClient.niche);
      setOffers(initialClient.offers.length > 0 ? initialClient.offers : [emptyOffer()]);
    } else {
      setName("");
      setTypes([]);
      setNiche(NICHES[0]);
      setOffers([emptyOffer()]);
    }
  }, [open, initialClient]);

  if (!open) return null;

  const toggleType = (t: string) =>
    setTypes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]));

  const handleSubmit = () => {
    onSubmit({ name, types, niche, offers });
  };

  return (
    <ModalOverlay
      open={open}
      onClose={onClose}
      overlayClassName="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      overlayStyle={S.modalOverlay}
      contentClassName="w-full max-w-[480px] rounded-[14px] border-hair p-5 max-h-[90vh] overflow-y-auto"
      contentStyle={S.modalCard}
    >
      <div className="flex items-center justify-between mb-4">
        <DialogPrimitive.Title asChild>
          <h2 className="text-[14px] font-bold text-white">{isEdit ? "Modifier le client" : "Ajouter un client"}</h2>
        </DialogPrimitive.Title>
        <DialogPrimitive.Close asChild>
          <button className="text-muted hover:text-white"><X size={16} /></button>
        </DialogPrimitive.Close>
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
          {isEdit ? "Enregistrer les modifications" : "Enregistrer le client"}
        </button>
      </div>
    </ModalOverlay>
  );
};
