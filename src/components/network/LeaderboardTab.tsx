import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getLeaderboard } from "@/services";
import type { LeaderboardRow as Row, LeaderboardPeriod } from "@/services";

const fullName = (p: Row) => {
  const explicit = p.display_name || `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim();
  if (explicit) return explicit;
  return "Closer";
};
const initials = (p: Row) => {
  if (p.display_name || p.first_name || p.last_name)
    return fullName(p).split(/\s+/).map((s) => s[0]).slice(0, 2).join("").toUpperCase();
  return "??";
};

const Column = ({ title, period }: { title: string; period: LeaderboardPeriod }) => {
  const { user } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    getLeaderboard(period).then(setRows);
  }, [period]);

  const top = rows.slice(0, 8);
  const meIdx = rows.findIndex((r) => r.id === user?.id);
  const me = meIdx >= 0 ? rows[meIdx] : null;

  return (
    <div className="rounded-[10px] border-hair p-3"
      style={{ background: "#161d2e", borderColor: "#2a3a50" }}>
      <div className="text-[10px] uppercase font-bold" style={{ color: "#8892a0" }}>Leaderboard</div>
      <div className="text-[13px] font-bold text-white mb-3">{title}</div>
      <div className="space-y-1.5">
        {top.map((r, i) => (
          <div key={r.id} className="flex items-center gap-2 px-1.5 py-1 rounded-[6px]"
            style={r.id === user?.id ? { background: "#0EFF9C08", border: "0.5px solid #0EFF9C33" } : undefined}>
            <span className="text-[10px] w-6" style={{ color: "#8892a0" }}>
              {i < 3 ? ["🥇","🥈","🥉"][i] : `#${i + 1}`}
            </span>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
              style={{ background: "#0EFF9C22", color: "#0EFF9C" }}>{initials(r)}</div>
            <span className="text-[11px] flex-1 truncate"
              style={{ color: r.id === user?.id ? "#0EFF9C" : "white" }}>
              {r.id === user?.id ? "Toi" : fullName(r)}
            </span>
            {!!r.streak && (
              <span className="text-[9px]" style={{ color: "#EFB027" }}>🔥{r.streak}</span>
            )}
            <span className="text-[11px] font-bold"
              style={{ color: r.id === user?.id ? "#0EFF9C" : "white" }}>{r.close_score}</span>
          </div>
        ))}
        {me && meIdx >= 8 && (
          <>
            <div className="h-px my-1" style={{ background: "#2a3a50" }} />
            <div className="flex items-center gap-2 px-1.5 py-1 rounded-[6px]"
              style={{ background: "#0EFF9C08", border: "0.5px solid #0EFF9C33" }}>
              <span className="text-[10px] w-6" style={{ color: "#0EFF9C" }}>#{meIdx + 1}</span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold"
                style={{ background: "#0EFF9C22", color: "#0EFF9C" }}>{initials(me)}</div>
              <span className="text-[11px] flex-1 truncate" style={{ color: "#0EFF9C" }}>Toi</span>
              <span className="text-[11px] font-bold" style={{ color: "#0EFF9C" }}>{me.close_score}</span>
            </div>
          </>
        )}
        {top.length === 0 && (
          <div className="text-[11px] py-4 text-center" style={{ color: "#6b7a99" }}>Pas encore de données.</div>
        )}
      </div>
    </div>
  );
};

const LeaderboardTab = () => (
  <div className="space-y-4">
    <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
      <Column title="7 jours" period="7d" />
      <Column title="30 jours" period="30d" />
      <Column title="All time" period="all" />
    </div>
    <div className="rounded-[10px] border-hair px-4 py-2.5 flex items-center gap-4 text-[10px]"
      style={{ background: "#161d2e", borderColor: "#2a3a50", color: "#8892a0" }}>
      <span className="font-bold tracking-widest" style={{ color: "white" }}>CALCUL</span>
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-sm" style={{ background: "#0EFF9C" }} /> Close Score 70%
      </span>
      <span className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-sm" style={{ background: "#EFB027" }} /> Assiduité 30%
      </span>
    </div>
  </div>
);

export default LeaderboardTab;
