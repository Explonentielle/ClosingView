import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export type Message = {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  created_at: string;
};

export type ConvSummary = {
  otherId: string;
  lastMessage: Message;
  unread: number;
};

type Ctx = {
  isOpen: boolean;
  activeOther: string | null;
  conversations: ConvSummary[];
  unreadTotal: number;
  togglePanel: () => void;
  closeAll: () => void;
  openConversation: (otherId: string) => void;
  backToList: () => void;
};

const MessagingCtx = createContext<Ctx>({
  isOpen: false,
  activeOther: null,
  conversations: [],
  unreadTotal: 0,
  togglePanel: () => {},
  closeAll: () => {},
  openConversation: () => {},
  backToList: () => {},
});

export const MessagingProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [activeOther, setActiveOther] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const refresh = useCallback(async () => {
    if (!user) { setMessages([]); return; }
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(500);
    setMessages((data as any) ?? []);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel(`msg-${user.id}`)
      .on("postgres_changes",
        { event: "*", schema: "public", table: "messages" },
        () => refresh()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, refresh]);

  const conversations = useMemo<ConvSummary[]>(() => {
    if (!user) return [];
    const map = new Map<string, { last: Message; unread: number }>();
    for (const m of messages) {
      const other = m.sender_id === user.id ? m.receiver_id : m.sender_id;
      const entry = map.get(other);
      if (!entry || entry.last.created_at < m.created_at) {
        map.set(other, {
          last: m,
          unread: (entry?.unread ?? 0) + (m.receiver_id === user.id && !m.is_read ? 1 : 0),
        });
      } else {
        entry.unread += m.receiver_id === user.id && !m.is_read ? 1 : 0;
      }
    }
    return Array.from(map.entries())
      .map(([otherId, v]) => ({ otherId, lastMessage: v.last, unread: v.unread }))
      .sort((a, b) => b.lastMessage.created_at.localeCompare(a.lastMessage.created_at));
  }, [messages, user]);

  const unreadTotal = conversations.reduce((s, c) => s + c.unread, 0);

  const openConversation = useCallback(async (otherId: string) => {
    setActiveOther(otherId);
    setIsOpen(true);
    if (!user) return;
    await supabase
      .from("messages")
      .update({ is_read: true })
      .eq("receiver_id", user.id)
      .eq("sender_id", otherId)
      .eq("is_read", false);
    refresh();
  }, [user, refresh]);

  const togglePanel = () => {
    setIsOpen((v) => !v);
    setActiveOther(null);
  };
  const closeAll = () => { setIsOpen(false); setActiveOther(null); };
  const backToList = () => setActiveOther(null);

  return (
    <MessagingCtx.Provider value={{ isOpen, activeOther, conversations, unreadTotal, togglePanel, closeAll, openConversation, backToList }}>
      {children}
    </MessagingCtx.Provider>
  );
};

export const useMessaging = () => useContext(MessagingCtx);

export function useConversationMessages(otherId: string | null) {
  const { user } = useAuth();
  const [msgs, setMsgs] = useState<Message[]>([]);

  const load = useCallback(async () => {
    if (!user || !otherId) { setMsgs([]); return; }
    const { data } = await supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${user.id},receiver_id.eq.${otherId}),and(sender_id.eq.${otherId},receiver_id.eq.${user.id})`
      )
      .order("created_at", { ascending: true });
    setMsgs((data as any) ?? []);
  }, [user, otherId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!user || !otherId) return;
    const channel = supabase
      .channel(`conv-${user.id}-${otherId}`)
      .on("postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (p: any) => {
          const m = p.new as Message;
          if ((m.sender_id === user.id && m.receiver_id === otherId) ||
              (m.sender_id === otherId && m.receiver_id === user.id)) {
            setMsgs((prev) => [...prev, m]);
          }
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user, otherId]);

  const send = async (content: string) => {
    if (!user || !otherId || !content.trim()) return;
    await supabase.from("messages").insert({
      sender_id: user.id,
      receiver_id: otherId,
      content: content.trim(),
    });
  };

  return { msgs, send };
}
