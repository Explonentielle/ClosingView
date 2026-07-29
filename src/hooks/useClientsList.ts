import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import {
  getClients,
  createClient as createClientService,
  updateClient as updateClientService,
  deleteClient as deleteClientService,
  getClientOffers,
  createOffer as createOfferService,
  updateOffer as updateOfferService,
  deleteOffer as deleteOfferService,
} from '@/services';
import type { Client } from '@/types';

type OfferInput = {
  id?: string;
  name: string;
  amount: number;
  max_installments: number;
  commission_rate: number;
};

export function useClientsList() {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await getClients(user.id);
      setClients(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch clients';
      setError(message);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [user]);

  const createClient = async (clientData: any) => {
    if (!user) return null;

    try {
      const newClient = await createClientService(clientData);
      if (newClient) {
        setClients((prev) => [newClient, ...prev]);
      }
      return newClient;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create client';
      setError(message);
      console.error('Error creating client:', err);
      return null;
    }
  };

  const editClient = async (
    clientId: string,
    clientData: { name: string; niche: string; type: string[]; offers: OfferInput[] }
  ) => {
    if (!user) return null;

    try {
      const totalAmount = clientData.offers.reduce((sum, o) => sum + o.amount, 0);
      const updatedClient = await updateClientService(clientId, {
        name: clientData.name,
        niche: clientData.niche,
        type: clientData.type,
        total_amount: totalAmount,
      });

      const existingOffers = await getClientOffers(clientId);
      const keptIds = new Set(clientData.offers.filter((o) => o.id).map((o) => o.id as string));

      await Promise.all([
        ...clientData.offers.map((o) =>
          o.id
            ? updateOfferService(o.id, {
                name: o.name,
                amount: o.amount,
                max_installments: o.max_installments || 1,
                commission_rate: o.commission_rate,
              })
            : createOfferService({
                client_id: clientId,
                user_id: user.id,
                name: o.name,
                amount: o.amount,
                max_installments: o.max_installments || 1,
                commission_rate: o.commission_rate,
              })
        ),
        ...existingOffers.filter((o) => !keptIds.has(o.id)).map((o) => deleteOfferService(o.id)),
      ]);

      if (updatedClient) {
        setClients((prev) => prev.map((c) => (c.id === clientId ? updatedClient : c)));
      }
      return updatedClient;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update client';
      setError(message);
      console.error('Error updating client:', err);
      return null;
    }
  };

  const removeClient = async (clientId: string) => {
    try {
      const ok = await deleteClientService(clientId);
      if (ok) {
        setClients((prev) => prev.filter((c) => c.id !== clientId));
      }
      return ok;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete client';
      setError(message);
      console.error('Error deleting client:', err);
      return false;
    }
  };

  const syncClientTotal = async (clientId: string) => {
    const offers = await getClientOffers(clientId);
    const totalAmount = offers.reduce((sum, o) => sum + (Number(o.amount) || 0), 0);
    const updatedClient = await updateClientService(clientId, { total_amount: totalAmount });
    if (updatedClient) {
      setClients((prev) => prev.map((c) => (c.id === clientId ? updatedClient : c)));
    }
  };

  const editOffer = async (
    offerId: string,
    clientId: string,
    updates: { name: string; amount: number; max_installments: number; commission_rate: number }
  ) => {
    try {
      const updated = await updateOfferService(offerId, updates);
      if (updated) {
        await syncClientTotal(clientId);
      }
      return updated;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update offer';
      setError(message);
      console.error('Error updating offer:', err);
      return null;
    }
  };

  const removeOffer = async (offerId: string, clientId: string) => {
    try {
      const ok = await deleteOfferService(offerId);
      if (ok) {
        await syncClientTotal(clientId);
      }
      return ok;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete offer';
      setError(message);
      console.error('Error deleting offer:', err);
      return false;
    }
  };

  const refetch = fetchClients;

  return { clients, loading, error, createClient, editClient, removeClient, editOffer, removeOffer, refetch };
}
