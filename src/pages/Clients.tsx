import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useClientsList } from "@/hooks/useClientsList";
import { getDefaultClients, adaptClientData } from "@/lib/data";
import { responsiveClass } from "@/lib/responsive";
import { ClientModal } from "@/components/modals/ClientModal";
import ClientCardLoader from "@/components/loaders/ClientCardLoader";
import * as S from './Clients.styles';

type Offer = { name: string; amount: number; split: number };

const ClientsPage = () => {
  const { user } = useAuth();
  const { clients: realClients, loading, error, createClient, refetch } = useClientsList();
  const [open, setOpen] = useState(false);

  // Use real clients if available, otherwise use mock data
  const displayClients = realClients.length > 0 ? realClients : getDefaultClients();
  const list = displayClients.map(adaptClientData);

  return (
    <div className={`animate-fade-in space-y-5 ${responsiveClass.mainContainer}`}>
      {error && (
        <div className="p-3 sm:p-4 rounded-lg bg-red-500/10 border border-red-500/50">
          <p className="text-red-400 text-[12px] sm:text-[13px]">Erreur lors du chargement des clients: {error}</p>
        </div>
      )}

      <div className="flex items-end justify-between flex-col sm:flex-row gap-2 sm:gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white">Mes clients</h2>
          <p className="text-[9px] sm:text-[11px]" style={{ color: "#8892a0" }}>{list.length} clients actifs</p>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="w-full sm:w-auto h-7 sm:h-9 px-3 sm:px-4 rounded-[10px] text-[9px] sm:text-[11px] font-bold transition-150"
          style={{ background: "#0EFF9C", color: "#0D1117" }}
        >+ Nouveau client</button>
      </div>

      <div className={responsiveClass.gridCols1to3}>
        {loading ? (
          <>
            {[...Array(6)].map((_, i) => (
              <ClientCardLoader key={i} />
            ))}
          </>
        ) : (
          <>
            {list.map((c) => {
              const pillColors: Record<string, string> = { Challenge: "#3B82F6", VSL: "#9B7FE8" };
              const nicheColor = c.color;
              return (
                <div
                  key={c.id}
                  className="rounded-[12px] border-hair p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 transition-150 hover:scale-[1.005]"
                  style={{ background: "#161d2e", borderColor: "#2a3a50" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = c.color)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a3a50")}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className="w-8 sm:w-9 h-8 sm:h-9 rounded-full flex flex-shrink-0 items-center justify-center text-[9px] sm:text-[11px] font-bold"
                      style={{ background: `${c.color}22`, color: c.color, border: `0.5px solid ${c.color}55` }}
                    >{c.initials}</div>
                    <div className="min-w-0">
                      <p className="text-[11px] sm:text-[13px] font-bold text-white leading-tight truncate">{c.name}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 sm:gap-1.5 flex-wrap">
                    <span
                      className="text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full"
                      style={{ background: `${nicheColor}18`, color: nicheColor }}
                    >{c.niche}</span>
                    {c.type.map((t) => (
                      <span key={t}
                        className="text-[8px] sm:text-[9px] font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full"
                        style={{ background: `${pillColors[t]}18`, color: pillColors[t] }}
                      >{t}</span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t-[0.5px] pt-2 sm:pt-3" style={{ borderColor: "#2a3a50" }}>
                    <span className="text-[12px] sm:text-[14px] font-bold" style={{ color: "#0EFF9C" }}>
                      {c.amount.toLocaleString("fr-FR")}€
                    </span>
                    <span className="text-[8px] sm:text-[10px]" style={{ color: "#8892a0" }}>
                      {c.offers} offre{c.offers > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {!loading && (
          <button
            onClick={() => setOpen(true)}
            className="rounded-[12px] p-3 sm:p-4 flex items-center justify-center text-[10px] sm:text-[12px] font-bold transition-150 hover:bg-white/[0.02]"
            style={{ border: "1.5px dashed #2a3a50", color: "#6b7a99", minHeight: "120px" }}
          >+ Ajouter un client</button>
        )}
      </div>

      <ClientModal
        open={open}
        onClose={() => {
          setOpen(false);
          refetch();
        }}
        onCreate={(c) => {
          if (!user) return;
          const initials = c.name
            .split(' ')
            .slice(0, 2)
            .map(w => w[0].toUpperCase())
            .join('');
          const colors = ["#0EFF9C", "#3B82F6", "#9B7FE8", "#F87171", "#EFB027"];
          const color = colors[Math.floor(Math.random() * colors.length)];
          const totalAmount = c.offers.reduce((sum, o) => sum + o.amount, 0);

          const clientData = {
            user_id: user.id,
            name: c.name || "Sans nom",
            niche: c.niche,
            type: c.types,
            initials,
            color,
            total_amount: totalAmount,
            offers: c.offers.map((o: Offer) => ({
              name: o.name,
              amount: o.amount,
              max_installments: o.split || 1,
            })),
          };
          createClient(clientData);
          setOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default ClientsPage;
