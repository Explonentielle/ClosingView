import { useEffect, useMemo, useState } from "react";
import { Search, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useMessaging } from "@/hooks/useMessaging";
import { useAuth } from "@/hooks/useAuth";

type Profile = {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  display_name?: string | null;
  city?: string | null;
  niche?: string | null;
  close_score?: number | null;
  streak?: number | null;
  is_online?: boolean | null;
  last_seen?: string | null;
};

const fullName = (p: Profile) => {
  const explicit = p.display_name || `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim();
  if (explicit) return explicit;
  if (p.email) return p.email.split("@")[0];
  return "Closer";
};
const initials = (p: Profile) => {
  if (p.display_name || p.first_name || p.last_name) {
    return fullName(p).split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  }
  if (p.email) return p.email.split("@")[0].slice(0, 2).toUpperCase();
  return "??";
};
const isOnline = (p: Profile) =>
  !!p.last_seen && Date.now() - new Date(p.last_seen).getTime() < 5 * 60 * 1000;

const MembersTab = () => {
  const { user } = useAuth();
  const { openConversation } = useMessaging();
  const [members, setMembers] = useState<Profile[]>([]);
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"online" | "all">("online");

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, email, first_name, last_name, display_name, city, niche, close_score, streak, is_online, last_seen")
      .order("close_score", { ascending: false, nullsFirst: false })
      .limit(120)
      .then(({ data }) => setMembers(((data as any) ?? []).filter((p: Profile) => p.id !== user?.id)));
  }, [user?.id]);

  const filtered = useMemo(() => {
    const term = q.toLowerCase().trim();
    return members
      .filter((m) => (filter === "online" ? isOnline(m) : true))
      .filter((m) => {
        if (!term) return true;
        return [fullName(m), m.city, m.niche].some((s) => (s ?? "").toLowerCase().includes(term));
      });
  }, [members, q, filter]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-[360px]">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: "#8892a0" }} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher..."
            className="w-full pl-8 pr-3 h-9 text-[12px] outline-none text-white"
            style={{ background: "#1e2535", border: "0.5px solid #2a3a50", borderRadius: 8 }}
          />
        </div>
        <FilterPill active={filter === "online"} onClick={() => setFilter("online")}>En ligne</FilterPill>
        <FilterPill active={filter === "all"} onClick={() => setFilter("all")}>Tous</FilterPill>
      </div>

      <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
        {filtered.map((m) => {
          const online = isOnline(m);
          return (
            <div key={m.id} className="rounded-[10px] border-hair p-3 flex flex-col gap-2 transition-colors"
              style={{ background: "#161d2e", borderColor: "#2a3a50", opacity: online ? 1 : 0.55 }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#0EFF9C33")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#2a3a50")}>
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold"
                    style={{ background: "#0EFF9C22", color: "#0EFF9C" }}>{initials(m)}</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full"
                    style={{ background: online ? "#0EFF9C" : "#6b7a99", border: "1.5px solid #161d2e" }} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-bold text-white truncate">{fullName(m)}</div>
                  <div className="text-[10px] truncate" style={{ color: "#8892a0" }}>
                    {[m.city, m.niche].filter(Boolean).join(" · ") || "—"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] px-1.5 py-0.5 rounded-[6px] font-bold"
                  style={{ background: "#0EFF9C22", color: "#0EFF9C" }}>SCORE {m.close_score ?? 0}</span>
                {!!m.streak && m.streak > 0 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-[6px] font-bold"
                    style={{ background: "#EFB02722", color: "#EFB027" }}>🔥 {m.streak}j</span>
                )}
                <button
                  onClick={() => openConversation(m.id)}
                  className="ml-auto flex items-center gap-1 px-2 py-1 rounded-[6px] text-[10px] font-bold"
                  style={{ background: "#0EFF9C", color: "#0D1117" }}
                >Msg <Send size={10} /></button>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="col-span-full text-center py-10 text-[12px]" style={{ color: "#8892a0" }}>
            Aucun membre trouvé.
          </div>
        )}
      </div>
    </div>
  );
};

const FilterPill = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
  <button
    onClick={onClick}
    className="px-3 h-9 text-[11px] font-bold rounded-[8px] transition-colors"
    style={
      active
        ? { background: "#0EFF9C", border: "1px solid #0EFF9C", color: "#0D1117" }
        : { background: "#253045", border: "1px solid #4a5a70", color: "#c8d5e8" }
    }
  >{children}</button>
);

export default MembersTab;
