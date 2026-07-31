import { useEffect, useRef, useState } from "react";
import { MessageCircle, X, ArrowLeft, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useMessaging, useConversationMessages } from "@/hooks/useMessaging";
import { isUserOnline } from "@/lib/presence";

type ProfileLite = {
  id: string;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
  is_online?: boolean | null;
  last_seen?: string | null;
};

const initials = (p?: ProfileLite | null) => {
  if (!p) return "?";
  const n = (p.display_name || `${p.first_name ?? ""} ${p.last_name ?? ""}`).trim();
  return n ? n.split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase() : "?";
};
const fullName = (p?: ProfileLite | null) =>
  p?.display_name || `${p?.first_name ?? ""} ${p?.last_name ?? ""}`.trim() || "Closer";

const timeAgo = (iso: string) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}j`;
};

const useProfiles = (ids: string[]) => {
  const [map, setMap] = useState<Record<string, ProfileLite>>({});
  useEffect(() => {
    if (ids.length === 0) return;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, display_name, is_online, last_seen")
        .in("id", ids);
      const m: Record<string, ProfileLite> = {};
      (data ?? []).forEach((p: any) => { m[p.id] = p; });
      setMap(m);
    })();
  }, [ids.join(",")]);
  return map;
};

const PrivateMessaging = () => {
  const { user } = useAuth();
  const { isOpen, activeOther, conversations, unreadTotal, togglePanel, closeAll, openConversation, backToList } = useMessaging();

  if (!user) return null;

  const ids = conversations.map((c) => c.otherId);
  const profiles = useProfiles(activeOther ? [...ids, activeOther] : ids);

  return (
    <>
      {/* Trigger bubble */}
      <button
        onClick={togglePanel}
        className="fixed flex items-center justify-center rounded-full transition-transform hover:scale-105"
        style={{
          bottom: 18, right: 18, zIndex: 9999,
          width: 46, height: 46, background: "#0EFF9C", color: "#0D1117",
        }}
        aria-label="Messages"
      >
        <MessageCircle size={22} />
        {unreadTotal > 0 && (
          <span
            className="absolute flex items-center justify-center text-[10px] font-bold"
            style={{
              top: -2, right: -2, minWidth: 18, height: 18, padding: "0 5px",
              borderRadius: 999, background: "#F87171", color: "white",
            }}
          >
            {unreadTotal}
          </span>
        )}
      </button>

      {isOpen && !activeOther && (
        <ConversationsPanel
          conversations={conversations}
          profiles={profiles}
          onPick={openConversation}
          onClose={closeAll}
        />
      )}

      {isOpen && activeOther && (
        <ConversationView
          other={profiles[activeOther]}
          otherId={activeOther}
          onBack={backToList}
          onClose={closeAll}
        />
      )}
    </>
  );
};

const ConversationsPanel = ({
  conversations, profiles, onPick, onClose,
}: {
  conversations: ReturnType<typeof useMessaging>["conversations"];
  profiles: Record<string, ProfileLite>;
  onPick: (id: string) => void;
  onClose: () => void;
}) => (
  <div
    className="fixed flex flex-col"
    style={{
      bottom: 70, right: 18, zIndex: 9999,
      width: 264, maxHeight: 380,
      background: "#0f1621", border: "0.5px solid #2a3a50", borderRadius: 13,
      boxShadow: "0 10px 36px rgba(0,0,0,0.6)",
    }}
  >
    <div className="flex items-center justify-between px-3 py-2.5 border-b" style={{ borderColor: "#1a2232" }}>
      <span className="text-[12px] font-bold text-white">Messages privés</span>
      <button onClick={onClose} className="text-white opacity-60 hover:opacity-100"><X size={14} /></button>
    </div>
    <div className="overflow-y-auto flex-1">
      {conversations.length === 0 && (
        <div className="px-4 py-6 text-[11px] text-center" style={{ color: "#8892a0" }}>
          Aucune conversation pour l'instant.
        </div>
      )}
      {conversations.map((c) => {
        const p = profiles[c.otherId];
        return (
          <button
            key={c.otherId}
            onClick={() => onPick(c.otherId)}
            className="w-full text-left px-3 py-2.5 flex items-center gap-2.5 border-b transition-colors"
            style={{ borderColor: "#1a2232", background: "transparent" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#161d2e")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <div className="relative">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold"
                style={{ background: "#0EFF9C22", color: "#0EFF9C" }}>{initials(p)}</div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{ background: isUserOnline(p) ? "#0EFF9C" : "#6b7a99", border: "1.5px solid #0f1621" }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white truncate">{fullName(p)}</span>
                <span className="text-[9px]" style={{ color: "#6b7a99" }}>{timeAgo(c.lastMessage.created_at)}</span>
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[10px] truncate" style={{ color: "#8892a0" }}>{c.lastMessage.content}</span>
                {c.unread > 0 && (
                  <span className="ml-1.5 px-1.5 rounded-full text-[9px] font-bold"
                    style={{ background: "#F87171", color: "white" }}>{c.unread}</span>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  </div>
);

const ConversationView = ({
  other, otherId, onBack, onClose,
}: {
  other?: ProfileLite;
  otherId: string;
  onBack: () => void;
  onClose: () => void;
}) => {
  const { user } = useAuth();
  const { msgs, send } = useConversationMessages(otherId);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999, behavior: "smooth" });
  }, [msgs]);

  const onSend = async () => {
    const v = draft.trim();
    if (!v) return;
    setDraft("");
    await send(v);
  };

  return (
    <div
      className="fixed flex flex-col"
      style={{
        bottom: 70, right: 18, zIndex: 9999,
        width: 278, height: 420,
        background: "#0f1621", border: "0.5px solid #2a3a50", borderRadius: 13,
        boxShadow: "0 10px 36px rgba(0,0,0,0.6)",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2.5 border-b" style={{ borderColor: "#1a2232" }}>
        <button onClick={onBack} className="text-white opacity-70 hover:opacity-100"><ArrowLeft size={14} /></button>
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold"
          style={{ background: "#0EFF9C22", color: "#0EFF9C" }}>{initials(other)}</div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-bold text-white truncate">{fullName(other)}</div>
          <div className="text-[9px]" style={{ color: isUserOnline(other) ? "#0EFF9C" : "#6b7a99" }}>
            {isUserOnline(other) ? "• En ligne" : "• Hors ligne"}
          </div>
        </div>
        <button onClick={onClose} className="text-white opacity-60 hover:opacity-100"><X size={14} /></button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2">
        {msgs.length === 0 && (
          <div className="text-[11px] text-center mt-4" style={{ color: "#6b7a99" }}>
            Démarrez la conversation.
          </div>
        )}
        {msgs.map((m) => {
          const mine = m.sender_id === user?.id;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className="text-[11px] px-2.5 py-1.5 max-w-[78%]"
                style={
                  mine
                    ? { background: "#0EFF9C", color: "#0D1117", fontWeight: 600, borderRadius: "10px 10px 2px 10px" }
                    : { background: "#161d2e", color: "white", border: "0.5px solid #2a3a50", borderRadius: "10px 10px 10px 2px" }
                }
              >
                {m.content}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <div className="p-2.5 border-t flex items-center gap-2" style={{ borderColor: "#1a2232" }}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onSend(); } }}
          placeholder="Message..."
          className="flex-1 text-[11px] px-2.5 py-1.5 outline-none text-white"
          style={{ background: "#1e2535", border: "0.5px solid #2a3a50", borderRadius: 8 }}
        />
        <button
          onClick={onSend}
          className="flex items-center justify-center"
          style={{ width: 30, height: 30, background: "#0EFF9C", color: "#0D1117", borderRadius: 8 }}
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  );
};

export default PrivateMessaging;
