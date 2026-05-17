import { useEffect, useState } from "react";
import { X, Check } from "lucide-react";
import { clients } from "@/data/mocks";

type Props = { open: boolean; onClose: () => void };

const SaisirModal = ({ open, onClose }: Props) => {
  const [step, setStep] = useState<1 | 2 | "ok">(1);
  const [clientId, setClientId] = useState(clients[0].id);
  const [r1p, setR1p] = useState(0);
  const [r1e, setR1e] = useState(0);
  const [r2p, setR2p] = useState(0);
  const [r2e, setR2e] = useState(0);
  const [closes, setCloses] = useState(0);

  const [contracte, setContracte] = useState(0);
  const [collecte, setCollecte] = useState(0);
  const [reglement, setReglement] = useState<"X1" | "X2" | "X3" | "X6" | "X10" | null>(null);
  const [closedAt, setClosedAt] = useState<"R1" | "R2" | null>(null);
  const [dateR2, setDateR2] = useState("");

  useEffect(() => {
    if (open) {
      setStep(1);
      setR1p(0); setR1e(0); setR2p(0); setR2e(0); setCloses(0);
      setContracte(0); setCollecte(0); setReglement(null); setClosedAt(null); setDateR2("");
    }
  }, [open]);

  if (!open) return null;

  const handleStep1 = () => {
    if (closes > 0) setStep(2);
    else setStep("ok");
  };

  const reglements = ["X1", "X2", "X3", "X6", "X10"] as const;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ background: "rgba(13,17,23,0.75)", backdropFilter: "blur(8px)" }}
      onClick={onClose}
    >
      <div
        className="w-full max-w-[460px] rounded-[14px] border-hair p-5"
        style={{ background: "#161d2e", borderColor: "#2a3a50" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-bold text-white">
            {step === "ok" ? "Confirmation" : `Saisie journée — Étape ${step}/2`}
          </h2>
          <button onClick={onClose} className="text-muted hover:text-white"><X size={16} /></button>
        </div>

        {step === 1 && (
          <div className="space-y-3">
            <label className="block">
              <span className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Client</span>
              <select
                value={clientId}
                onChange={(e) => setClientId(+e.target.value)}
                className="w-full mt-1 h-9 rounded-[10px] border-hair px-3 text-[12px] text-white bg-transparent"
                style={{ background: "#0D1117", borderColor: "#2a3a50" }}
              >
                {clients.map(c => <option key={c.id} value={c.id} style={{ background: "#0D1117" }}>{c.name}</option>)}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "R1 planifiés",  v: r1p, set: setR1p },
                { label: "R1 effectués",  v: r1e, set: setR1e },
                { label: "R2 planifiés",  v: r2p, set: setR2p },
                { label: "R2 effectués",  v: r2e, set: setR2e },
              ].map(f => (
                <label key={f.label} className="block">
                  <span className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>{f.label}</span>
                  <input
                    type="number" min={0} value={f.v}
                    onChange={(e) => f.set(Math.max(0, +e.target.value))}
                    className="w-full mt-1 h-9 rounded-[10px] border-hair px-3 text-[12px] text-white"
                    style={{ background: "#0D1117", borderColor: "#2a3a50" }}
                  />
                </label>
              ))}
            </div>

            <label className="block">
              <span className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Nombre de closes</span>
              <input
                type="number" min={0} value={closes}
                onChange={(e) => setCloses(Math.max(0, +e.target.value))}
                className="w-full mt-1 h-9 rounded-[10px] border-hair px-3 text-[12px] text-white"
                style={{ background: "#0D1117", borderColor: "#2a3a50" }}
              />
            </label>

            <button
              onClick={handleStep1}
              className="w-full h-10 rounded-[10px] font-bold text-[12px] transition-150"
              style={{ background: "#0EFF9C", color: "#0D1117" }}
            >
              Valider →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2.5">
              <label className="block">
                <span className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Contracté (€)</span>
                <input
                  type="number" min={0} value={contracte}
                  onChange={(e) => setContracte(+e.target.value)}
                  className="w-full mt-1 h-9 rounded-[10px] border-hair px-3 text-[12px] text-white"
                  style={{ background: "#0D1117", borderColor: "#2a3a50" }}
                />
              </label>
              <label className="block">
                <span className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Collecté (€)</span>
                <input
                  type="number" min={0} value={collecte}
                  onChange={(e) => setCollecte(+e.target.value)}
                  className="w-full mt-1 h-9 rounded-[10px] border-hair px-3 text-[12px] text-white"
                  style={{ background: "#0D1117", borderColor: "#2a3a50" }}
                />
              </label>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Règlement</span>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {reglements.map(r => (
                  <button
                    key={r} onClick={() => setReglement(r)}
                    className="px-3 h-7 rounded-full text-[10px] font-bold border-hair transition-150"
                    style={{
                      background: reglement === r ? "#0EFF9C" : "transparent",
                      color: reglement === r ? "#0D1117" : "#8892a0",
                      borderColor: reglement === r ? "#0EFF9C" : "#2a3a50",
                    }}
                  >{r}</button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Closé au</span>
              <div className="flex gap-1.5 mt-1.5">
                {(["R1", "R2"] as const).map(r => (
                  <button
                    key={r} onClick={() => setClosedAt(r)}
                    className="px-4 h-7 rounded-full text-[10px] font-bold border-hair transition-150"
                    style={{
                      background: closedAt === r ? "#EFB027" : "transparent",
                      color: closedAt === r ? "#0D1117" : "#8892a0",
                      borderColor: closedAt === r ? "#EFB027" : "#2a3a50",
                    }}
                  >{r}</button>
                ))}
              </div>
            </div>

            {closedAt === "R2" && (
              <label className="block">
                <span className="text-[10px] uppercase tracking-wide font-bold" style={{ color: "#8892a0" }}>Date du R2</span>
                <input
                  type="date" value={dateR2} onChange={(e) => setDateR2(e.target.value)}
                  className="w-full mt-1 h-9 rounded-[10px] border-hair px-3 text-[12px] text-white"
                  style={{ background: "#0D1117", borderColor: "#2a3a50", colorScheme: "dark" }}
                />
              </label>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setStep(1)}
                className="flex-1 h-10 rounded-[10px] font-bold text-[12px] border-hair text-white transition-150"
                style={{ borderColor: "#2a3a50" }}
              >← Retour</button>
              <button
                onClick={() => setStep("ok")}
                className="flex-1 h-10 rounded-[10px] font-bold text-[12px] transition-150"
                style={{ background: "#0EFF9C", color: "#0D1117" }}
              >Enregistrer →</button>
            </div>
          </div>
        )}

        {step === "ok" && (
          <div className="flex flex-col items-center text-center py-5">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center animate-pop-in mb-3"
              style={{ background: "#0EFF9C18", border: "1.5px solid #0EFF9C" }}
            >
              <Check size={28} color="#0EFF9C" />
            </div>
            <p className="text-[14px] font-bold text-white mb-1">Journée enregistrée !</p>
            <p className="text-[11px] mb-5" style={{ color: "#8892a0" }}>
              Tes performances ont été mises à jour.
            </p>
            <button
              onClick={onClose}
              className="px-5 h-9 rounded-[10px] font-bold text-[11px]"
              style={{ background: "#0EFF9C", color: "#0D1117" }}
            >Retour au dashboard</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaisirModal;
