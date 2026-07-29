import { useState, useEffect, useMemo } from "react";
import { ChevronDown, Pencil, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useClientsList } from "@/hooks/useClientsList";
import { getClientOffers } from "@/services/clients";
import { responsiveClass } from "@/lib/responsive";
import { ClientModal, ClientFormData } from "@/components/modals/ClientModal";
import { OfferFormRow } from "@/components/modals/OffersSection";
import ClientCardLoader from "@/components/loaders/ClientCardLoader";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import type { Client } from "@/types";
import * as S from './Clients.styles';

type DeleteTarget =
  | { type: "client"; client: Client }
  | { type: "offer"; offerId: string; clientId: string; offerName: string };

const ClientsPage = () => {
  const { user } = useAuth();
  const {
    clients: realClients,
    loading,
    error,
    createClient,
    editClient,
    removeClient,
    removeOffer,
    refetch,
  } = useClientsList();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);
  const [expandedClients, setExpandedClients] = useState<Record<string, boolean>>({});
  const [clientOffers, setClientOffers] = useState<Record<string, any[]>>({});

  const list = realClients;

  const refetchOffers = async (clientId: string) => {
    const offers = await getClientOffers(clientId);
    setClientOffers((prev) => ({ ...prev, [clientId]: offers }));
  };

  // Fetch all client offers on mount and when the set of clients changes.
  // Keyed on a stable id string rather than `list` itself, which is a new
  // array reference on every render and would otherwise refetch in a loop.
  const clientIdsKey = list.map((c) => c.id).join(',');

  useEffect(() => {
    const fetchAllOffers = async () => {
      const offersMap: Record<string, any[]> = {};
      for (const client of list) {
        const offers = await getClientOffers(client.id);
        offersMap[client.id] = offers;
      }
      setClientOffers(offersMap);
    };

    if (clientIdsKey.length > 0) {
      fetchAllOffers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientIdsKey]);

  const toggleClientExpand = (clientId: string) => {
    setExpandedClients(prev => ({ ...prev, [clientId]: !prev[clientId] }));
  };

  const openCreateModal = () => {
    setEditingClient(null);
    setModalOpen(true);
  };

  const openEditModal = (client: Client) => {
    setEditingClient(client);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingClient(null);
  };

  const editingClientOffers = editingClient ? clientOffers[editingClient.id] : undefined;

  const initialFormData: ClientFormData | null = useMemo(() => {
    if (!editingClient) return null;
    return {
      name: editingClient.name,
      niche: editingClient.niche,
      types: editingClient.type,
      offers: (editingClientOffers || []).map((o) => ({
        id: o.id,
        name: o.name,
        amount: Number(o.amount) || 0,
        split: o.max_installments || 1,
        commission_rate: Number(o.commission_rate) || 0,
      })),
    };
  }, [editingClient, editingClientOffers]);

  const handleSubmit = async (form: ClientFormData) => {
    if (!user) return;

    if (editingClient) {
      await editClient(editingClient.id, {
        name: form.name || "Sans nom",
        niche: form.niche,
        type: form.types,
        offers: form.offers.map((o: OfferFormRow) => ({
          id: o.id,
          name: o.name,
          amount: o.amount,
          max_installments: o.split || 1,
          commission_rate: o.commission_rate,
        })),
      });
      await refetchOffers(editingClient.id);
    } else {
      const initials = form.name.split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join('');
      const colors = ["#0EFF9C", "#3B82F6", "#9B7FE8", "#F87171", "#EFB027"];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const totalAmount = form.offers.reduce((sum, o) => sum + o.amount, 0);

      await createClient({
        user_id: user.id,
        name: form.name || "Sans nom",
        niche: form.niche,
        type: form.types,
        initials,
        color,
        total_amount: totalAmount,
        offers: form.offers.map((o: OfferFormRow) => ({
          name: o.name,
          amount: o.amount,
          max_installments: o.split || 1,
          commission_rate: o.commission_rate,
        })),
      });
    }

    closeModal();
    refetch();
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === "client") {
      await removeClient(deleteTarget.client.id);
    } else {
      await removeOffer(deleteTarget.offerId, deleteTarget.clientId);
      await refetchOffers(deleteTarget.clientId);
    }

    setDeleteTarget(null);
  };

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
          onClick={openCreateModal}
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
              const isExpanded = expandedClients[c.id] ?? false;
              const offers = clientOffers[c.id] || [];
              const offerCount = offers.length;
              const totalOffers = offers.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

              return (
                <div
                  key={c.id}
                  className="rounded-[12px] border-hair p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 transition-150 hover:scale-[1.005]"
                  style={{ background: "#161d2e", borderColor: "#2a3a50", alignSelf: "start" }}
                  onMouseEnter={(e) => (e.currentTarget.style.borderColor = c.color)}
                  onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a3a50")}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div
                      className="w-8 sm:w-9 h-8 sm:h-9 rounded-full flex flex-shrink-0 items-center justify-center text-[9px] sm:text-[11px] font-bold"
                      style={{ background: `${c.color}22`, color: c.color, border: `0.5px solid ${c.color}55` }}
                    >{c.initials}</div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] sm:text-[13px] font-bold text-white leading-tight truncate">{c.name}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => openEditModal(c)}
                        className="h-6 w-6 flex items-center justify-center rounded-md transition-150 hover:bg-white/5"
                        style={S.cardIconButtonStyle}
                        title="Modifier le client"
                      >
                        <Pencil size={12} />
                      </button>
                      <button
                        onClick={() => setDeleteTarget({ type: "client", client: c })}
                        className="h-6 w-6 flex items-center justify-center rounded-md transition-150 hover:bg-white/5"
                        style={S.dangerTextStyle}
                        title="Supprimer le client"
                      >
                        <Trash2 size={12} />
                      </button>
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
                      {totalOffers.toLocaleString("fr-FR")}€
                    </span>
                    <button
                      onClick={() => toggleClientExpand(c.id)}
                      className="flex items-center gap-1.5 text-[8px] sm:text-[10px] transition-transform"
                      style={{ color: "#8892a0" }}
                    >
                      <ChevronDown size={12} style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 200ms" }} />
                      {offerCount} offre{offerCount > 1 ? "s" : ""}
                    </button>
                  </div>

                  {isExpanded && offers.length > 0 && (
                    <div className="space-y-1.5 pt-2 border-t-[0.5px]" style={{ borderColor: "#2a3a50" }}>
                      {offers.map((offer) => (
                        <div key={offer.id} className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-[6px]" style={{ background: "#0a0f1a" }}>
                          <span className="text-[9px] sm:text-[10px] text-white truncate">{offer.name}</span>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-[9px] sm:text-[10px] font-bold" style={{ color: "#0EFF9C" }}>
                              {Number(offer.amount).toLocaleString("fr-FR")}€
                            </span>
                            <span className="text-[8px] sm:text-[9px]" style={{ color: "#8892a0" }}>
                              {Number(offer.commission_rate) || 0}%
                            </span>
                            <button
                              onClick={() => setDeleteTarget({ type: "offer", offerId: offer.id, clientId: c.id, offerName: offer.name })}
                              className="h-5 w-5 flex items-center justify-center rounded-md transition-150 hover:bg-white/5"
                              style={S.dangerTextStyle}
                              title="Supprimer l'offre"
                            >
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </>
        )}

        {!loading && (
          <button
            onClick={openCreateModal}
            className="rounded-[12px] p-3 sm:p-4 flex items-center justify-center text-[10px] sm:text-[12px] font-bold transition-150 hover:bg-white/[0.02]"
            style={{ border: "1.5px dashed #2a3a50", color: "#6b7a99", minHeight: "120px", alignSelf: "start" }}
          >+ Ajouter un client</button>
        )}
      </div>

      <ClientModal
        key={editingClient?.id ?? 'create'}
        open={modalOpen}
        onClose={() => {
          closeModal();
          refetch();
        }}
        onSubmit={handleSubmit}
        initialClient={initialFormData}
      />

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteTarget?.type === "client" ? "Supprimer ce client ?" : "Supprimer cette offre ?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTarget?.type === "client"
                ? `"${deleteTarget.client.name}" et toutes ses offres seront définitivement supprimés.`
                : `L'offre "${deleteTarget?.offerName}" sera définitivement supprimée.`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Supprimer</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ClientsPage;
