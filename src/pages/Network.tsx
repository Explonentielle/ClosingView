import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import CommunityTab from "@/components/network/CommunityTab";
import MembersTab from "@/components/network/MembersTab";
import LeaderboardTab from "@/components/network/LeaderboardTab";
import MapFrance from "@/components/network/MapFrance";

type TabKey = "community" | "members" | "leaderboard" | "map";

const TABS: { key: TabKey; label: string }[] = [
  { key: "community",   label: "Communauté" },
  { key: "members",     label: "Membres" },
  { key: "leaderboard", label: "Leaderboard" },
  { key: "map",         label: "Carte" },
];

const Network = () => {
  const [tab, setTab] = useState<TabKey>("community");
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .then(({ count, error }) => {
        if (error) {
          console.error('Error fetching online count:', error);
          setOnlineCount(0);
          return;
        }
        setOnlineCount(count ?? 0);
      })
      .catch((err) => {
        console.error('Online count error:', err);
        setOnlineCount(0);
      });
  }, []);

  return (
    <div className="animate-fade-in space-y-5">
      <div className="flex items-center justify-between border-b" style={{ borderColor: "#1a2232" }}>
        <div className="flex">
          {TABS.map((t) => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="px-4 py-2.5 text-[12px] transition-colors"
                style={{
                  color: "white",
                  opacity: active ? 1 : 0.65,
                  fontWeight: active ? 800 : 600,
                  borderBottom: active ? "2px solid #0EFF9C" : "2px solid transparent",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = active ? "1" : "0.65")}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-1.5 pr-1">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#0EFF9C" }} />
          <span className="text-[11px] font-bold" style={{ color: "#0EFF9C" }}>{onlineCount} en ligne</span>
        </div>
      </div>

      {tab === "community"   && <CommunityTab />}
      {tab === "members"     && <MembersTab />}
      {tab === "leaderboard" && <LeaderboardTab />}
      {tab === "map"         && <MapFrance />}
    </div>
  );
};

export default Network;
