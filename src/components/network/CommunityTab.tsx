import { useEffect, useState } from "react";
import { Heart, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

type Profile = {
  id: string;
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

type Post = {
  id: string;
  user_id: string;
  content: string;
  closes: number | null;
  cash: number | null;
  taux: number | null;
  created_at: string;
};

const fullName = (p?: Profile) =>
  p?.display_name || `${p?.first_name ?? ""} ${p?.last_name ?? ""}`.trim() || "Closer";
const initials = (p?: Profile) => {
  const n = fullName(p);
  return n.split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
};
const timeAgo = (iso: string) => {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return "à l'instant";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return `${Math.floor(diff / 86400)}j`;
};
const isOnline = (p?: Profile) =>
  !!p?.is_online || (!!p?.last_seen && Date.now() - new Date(p.last_seen).getTime() < 5 * 60 * 1000);

const CommunityTab = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [likes, setLikes] = useState<Record<string, { count: number; mine: boolean }>>({});
  const [draft, setDraft] = useState("");
  const [topClosers, setTopClosers] = useState<Profile[]>([]);
  const [me, setMe] = useState<Profile | null>(null);

  const reload = async () => {
    const { data: ps } = await supabase
      .from("community_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    const arr = (ps as any) ?? [];
    setPosts(arr);

    const uids = Array.from(new Set(arr.map((p: Post) => p.user_id))) as string[];
    if (uids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, display_name, city, niche, close_score, streak, is_online, last_seen")
        .in("id", uids);
      const m: Record<string, Profile> = {};
      (profs ?? []).forEach((p: any) => { m[p.id] = p; });
      setProfiles(m);
    }

    const pids = arr.map((p: Post) => p.id);
    if (pids.length) {
      const { data: ls } = await supabase
        .from("post_likes")
        .select("post_id, user_id")
        .in("post_id", pids);
      const lm: Record<string, { count: number; mine: boolean }> = {};
      pids.forEach((id: string) => (lm[id] = { count: 0, mine: false }));
      (ls ?? []).forEach((l: any) => {
        lm[l.post_id].count++;
        if (l.user_id === user?.id) lm[l.post_id].mine = true;
      });
      setLikes(lm);
    }
  };

  useEffect(() => { reload(); }, [user?.id]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("id, first_name, last_name, display_name, city, niche, close_score, streak")
      .eq("id", user.id)
      .single()
      .then(({ data }) => setMe(data as any));
    supabase
      .from("profiles")
      .select("id, first_name, last_name, display_name, city, close_score, streak, is_online, last_seen")
      .order("close_score", { ascending: false, nullsFirst: false })
      .limit(8)
      .then(({ data }) => setTopClosers((data as any) ?? []));
  }, [user?.id]);

  useEffect(() => {
    const ch = supabase
      .channel("community-feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, reload)
      .on("postgres_changes", { event: "*", schema: "public", table: "post_likes" }, reload)
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [user?.id]);

  const publish = async () => {
    if (!user || !draft.trim()) return;
    const text = draft.trim().slice(0, 280);
    setDraft("");
    await supabase.from("community_posts").insert({ user_id: user.id, content: text });
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;
    const cur = likes[postId];
    if (cur?.mine) {
      await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
    }
  };

  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: "1fr 240px" }}>
      {/* Feed */}
      <div className="space-y-3">
        {/* Composer */}
        <div className="rounded-[10px] border-hair p-3" style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{ background: "#0EFF9C22", color: "#0EFF9C" }}>{initials(me ?? undefined)}</div>
            <div className="flex-1">
              <textarea
                value={draft}
                maxLength={280}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Partage une victoire, un conseil..."
                rows={2}
                className="w-full text-[12px] p-2 outline-none text-white resize-none"
                style={{ background: "#1e2535", border: "0.5px solid #2a3a50", borderRadius: 8 }}
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px]" style={{ color: "#6b7a99" }}>{draft.length}/280</span>
                <button
                  onClick={publish}
                  disabled={!draft.trim()}
                  className="px-3 py-1.5 text-[11px] font-bold rounded-[8px] disabled:opacity-50"
                  style={{ background: "#0EFF9C", color: "#0D1117" }}
                >Publier</button>
              </div>
            </div>
          </div>
        </div>

        {/* Posts */}
        {posts.length === 0 && (
          <div className="text-[12px] py-8 text-center rounded-[10px] border-hair"
            style={{ color: "#8892a0", borderColor: "#2a3a50", background: "#161d2e" }}>
            Aucun post pour l'instant. Sois le premier !
          </div>
        )}
        {posts.map((p) => {
          const author = profiles[p.user_id];
          const lk = likes[p.id] ?? { count: 0, mine: false };
          const hasStats = p.closes != null || p.cash != null || p.taux != null;
          return (
            <div key={p.id} className="rounded-[10px] border-hair p-3"
              style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                  style={{ background: "#0EFF9C22", color: "#0EFF9C" }}>{initials(author)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[12px] font-bold text-white">{fullName(author)}</span>
                    {!!author?.close_score && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-[6px] font-bold"
                        style={{ background: "#0EFF9C22", color: "#0EFF9C" }}>SCORE {author.close_score}</span>
                    )}
                    {!!author?.streak && author.streak > 0 && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded-[6px] font-bold"
                        style={{ background: "#EFB02722", color: "#EFB027" }}>🔥 {author.streak}j</span>
                    )}
                    <span className="ml-auto text-[10px]" style={{ color: "#6b7a99" }}>{timeAgo(p.created_at)}</span>
                  </div>
                  <div className="text-[10px] mt-0.5" style={{ color: "#8892a0" }}>
                    {[author?.niche, author?.city].filter(Boolean).join(" · ")}
                  </div>
                  <p className="text-[12px] text-white mt-2 whitespace-pre-wrap">{p.content}</p>
                  {hasStats && (
                    <div className="mt-2.5 rounded-[8px] px-3 py-2 flex items-center gap-4 text-[11px] font-bold"
                      style={{ background: "#0a0f1a", border: "0.5px solid #0EFF9C33" }}>
                      {p.closes != null && <span style={{ color: "white" }}>{p.closes} closes</span>}
                      {p.cash != null && <span style={{ color: "#0EFF9C" }}>{Number(p.cash).toLocaleString("fr-FR")}€ cash</span>}
                      {p.taux != null && <span style={{ color: "#EFB027" }}>{p.taux}% taux</span>}
                    </div>
                  )}
                  <div className="flex items-center gap-3 mt-2.5">
                    <button onClick={() => toggleLike(p.id)} className="flex items-center gap-1.5 text-[11px]"
                      style={{ color: lk.mine ? "#F87171" : "#8892a0" }}>
                      <Heart size={13} fill={lk.mine ? "#F87171" : "none"} /> {lk.count}
                    </button>
                    <button disabled className="flex items-center gap-1.5 text-[11px] cursor-not-allowed"
                      style={{ color: "#6b7a99" }}>
                      <MessageSquare size={13} /> Bientôt
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Sidebar */}
      <aside className="space-y-3">
        {/* Me */}
        <div className="rounded-[10px] border-hair p-3" style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-[12px] font-bold"
              style={{ background: "#0EFF9C22", color: "#0EFF9C" }}>{initials(me ?? undefined)}</div>
            <div className="min-w-0">
              <div className="text-[12px] font-bold text-white truncate">{fullName(me ?? undefined)}</div>
              <div className="text-[10px]" style={{ color: "#8892a0" }}>{me?.city || "—"}</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-3 text-center">
            <Stat label={`🔥 ${me?.streak ?? 0}j`} color="#EFB027" />
            <Stat label="#12" color="#8892a0" />
            <Stat label={`${me?.close_score ?? 0}`} color="#0EFF9C" />
          </div>
        </div>

        {/* Top closers */}
        <div className="rounded-[10px] border-hair p-3" style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
          <div className="text-[10px] uppercase font-bold mb-2" style={{ color: "#8892a0" }}>Top closers</div>
          <div className="space-y-1.5">
            {topClosers.slice(0, 3).map((c, i) => (
              <Row key={c.id} medal={["🥇","🥈","🥉"][i]} p={c} />
            ))}
            {me && (
              <>
                <div className="h-px my-1" style={{ background: "#2a3a50" }} />
                <Row medal="#12" p={me} highlight />
              </>
            )}
          </div>
        </div>

        {/* Online */}
        <div className="rounded-[10px] border-hair p-3" style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
          <div className="text-[10px] uppercase font-bold mb-2" style={{ color: "#8892a0" }}>En ligne</div>
          <div className="space-y-1.5">
            {topClosers.filter(isOnline).slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                    style={{ background: "#0EFF9C22", color: "#0EFF9C" }}>{initials(p)}</div>
                  <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
                    style={{ background: "#0EFF9C", border: "1.5px solid #161d2e" }} />
                </div>
                <span className="text-[11px] text-white flex-1 truncate">{fullName(p)}</span>
                <span className="text-[10px] font-bold" style={{ color: "#0EFF9C" }}>{p.close_score ?? 0}</span>
              </div>
            ))}
            {topClosers.filter(isOnline).length === 0 && (
              <div className="text-[10px]" style={{ color: "#6b7a99" }}>Personne en ligne.</div>
            )}
          </div>
        </div>
      </aside>
    </div>
  );
};

const Stat = ({ label, color }: { label: string; color: string }) => (
  <div className="text-[11px] font-bold py-1.5 rounded-[6px]"
    style={{ background: "#0a0f1a", color }}>{label}</div>
);

const Row = ({ medal, p, highlight }: { medal: string; p: Profile; highlight?: boolean }) => (
  <div className="flex items-center gap-2 px-1.5 py-1 rounded-[6px]"
    style={highlight ? { background: "#0EFF9C08", border: "0.5px solid #0EFF9C33" } : undefined}>
    <span className="text-[10px] w-5" style={{ color: highlight ? "#0EFF9C" : "#8892a0" }}>{medal}</span>
    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
      style={{ background: "#0EFF9C22", color: "#0EFF9C" }}>{initials(p)}</div>
    <span className="text-[11px] flex-1 truncate" style={{ color: highlight ? "#0EFF9C" : "white" }}>
      {highlight ? "Toi" : fullName(p)}
    </span>
    <span className="text-[11px] font-bold" style={{ color: highlight ? "#0EFF9C" : "white" }}>{p.close_score ?? 0}</span>
  </div>
);

export default CommunityTab;
