import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getClients, createClient as createClientService } from '@/services';
import type { Client } from '@/types';

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

  const refetch = fetchClients;

  return { clients, loading, error, createClient, refetch };
}
