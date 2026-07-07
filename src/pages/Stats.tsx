import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { getClosingRates, getClosingMetrics, getSummaryStats, getFullPayRatio } from "@/services";
import type { ClosingRates } from "@/services";

const FILTERS = ["Global", "Niche", "Infopreneur", "Challenge"];

const KpiCell = ({ label, value, valueColor = "#FFFFFF" }: { label: string; value: string; valueColor?: string }) => (
  <div style={{ background: "#161d2e", border: "0.5px solid #2a3a50", borderRadius: 10, padding: "8px 10px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
    <div style={{ color: "#6b7a99", fontSize: "0.625rem", fontWeight: 700, letterSpacing: "1.3px", textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
    <div style={{ color: valueColor, fontSize: "clamp(14px, 4vw, 16px)", fontWeight: 800, lineHeight: 1 }}>{value}</div>
  </div>
);

const Gauge = ({ pct = 60 }: { pct?: number }) => {
  const cx = 80, cy = 72, r = 56;
  const circ = Math.PI * r; // half
  const greenLen = (circ * pct) / 100;
  const yellowLen = circ - greenLen;
  const angle = Math.PI - (Math.PI * pct) / 100; // from left (π) decreasing
  const nx = cx + r * Math.cos(angle);
  const ny = cy - r * Math.sin(angle);
  return (
    <svg viewBox="0 0 160 80" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", height: "100%", maxHeight: 62 }}>
      {/* background arc */}
      <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`} fill="none" stroke="#1a2232" strokeWidth={10} />
      {/* full pay (green) */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#0EFF9C" strokeWidth={10} strokeDasharray={`${greenLen} ${circ * 2}`} transform={`rotate(180 ${cx} ${cy})`} style={{ transformOrigin: `${cx}px ${cy}px` }} />
      {/* split pay (yellow) */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#EFB027" strokeWidth={10} strokeDasharray={`${yellowLen} ${circ * 2}`} strokeDashoffset={-greenLen} transform={`rotate(180 ${cx} ${cy})`} />
      {/* needle */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#FFFFFF" strokeWidth={1.5} strokeLinecap="round" />
      <circle cx={cx} cy={cy} r={3} fill="#161d2e" stroke="#FFFFFF" strokeWidth={1.5} />
    </svg>
  );
};

const Radar = () => {
  const pts = [
    { label: "Closing", v: 93, ang: -90 },
    { label: "Cash", v: 80, ang: -18 },
    { label: "Régularité", v: 80, ang: 54 },
    { label: "Cycle de vente", v: 73, ang: 126 },
    { label: "Objectifs", v: 70, ang: 198 },
  ];
  const R = 70;
  const toXY = (ang: number, r: number) => {
    const a = (ang * Math.PI) / 180;
    return [Math.cos(a) * r, Math.sin(a) * r] as const;
  };
  const ring = (r: number) => pts.map((p) => toXY(p.ang, r).join(",")).join(" ");
  const data = pts.map((p) => toXY(p.ang, (R * p.v) / 100).join(",")).join(" ");

  return (
    <svg viewBox="0 0 260 200" preserveAspectRatio="xMidYMid meet" style={{ width: "100%", flex: 1, minHeight: 0 }}>
      <defs>
        <radialGradient id="radarFill" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0EFF9C" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#0EFF9C" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g transform="translate(130 100)">
        {[R, R * 0.75, R * 0.5].map((r, i) => (
          <polygon key={i} points={ring(r)} fill="none" stroke="#1e2b3a" strokeWidth={0.8} />
        ))}
        {pts.map((p, i) => {
          const [x, y] = toXY(p.ang, R);
          return <line key={i} x1={0} y1={0} x2={x} y2={y} stroke="#1e2b3a" strokeWidth={0.7} />;
        })}
        <polygon points={data} fill="url(#radarFill)" stroke="#0EFF9C" strokeWidth={2} />
        {pts.map((p, i) => {
          const [x, y] = toXY(p.ang, (R * p.v) / 100);
          return <circle key={i} cx={x} cy={y} r={4} fill="#0EFF9C" />;
        })}
        {pts.map((p, i) => {
          const [lx, ly] = toXY(p.ang, R + 18);
          return (
            <g key={i}>
              <text x={lx} y={ly - 2} textAnchor="middle" fontSize={8} fontWeight={600} fill="#e2e8f0">{p.label}</text>
              <text x={lx} y={ly + 8} textAnchor="middle" fontSize={8} fontWeight={600} fill="#0EFF9C">{p.v}%</text>
            </g>
          );
        })}
        <text textAnchor="middle" dominantBaseline="middle" fill="#0EFF9C" fontSize={28} fontWeight={900} fontFamily="Inter, sans-serif">74</text>
      </g>
    </svg>
  );
};

import TrackRecordModal from "@/components/stats/TrackRecordModal";
import * as S from './Stats.styles';

const Stats = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState("Global");
  const [trackOpen, setTrackOpen] = useState(false);
  const [rates, setRates] = useState<ClosingRates>({ closing: 0, noShow: 0, followUp: 0 });
  const [metrics, setMetrics] = useState({ totalContracted: 0, totalCollected: 0, count: 0 });
  const [summary, setSummary] = useState({ closes: 0, r1Done: 0, r2Done: 0, followUp: 0 });
  const [fullPayRatio, setFullPayRatio] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      setLoading(true);
      const [r, m, s, f] = await Promise.all([
        getClosingRates(user.id, 30),
        getClosingMetrics(user.id, 30),
        getSummaryStats(user.id, 30),
        getFullPayRatio(user.id, 30),
      ]);
      setRates(r);
      setMetrics(m);
      setSummary(s);
      setFullPayRatio(f);
      setLoading(false);
    };

    fetchData();
  }, [user, filter]);

  return (
    <div className={S.statsContainer}>
      {/* Section 1 — Filtres */}
      <div className={S.filterSection}>
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={S.filterButton(active)}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Section 2 — Grid 2 cols */}
      <div className={S.gridSection}>
        {/* Left col */}
        <div className={S.leftColSection}>
          <div className={S.kpiGrid}>
            <KpiCell label="€ contracté" value={`${metrics.totalContracted.toLocaleString("fr-FR")}€`} />
            <KpiCell label="€ collecté" value={`${metrics.totalCollected.toLocaleString("fr-FR")}€`} valueColor="#0EFF9C" />
            <KpiCell label="Nb. closes" value={String(metrics.count)} />
            <KpiCell label="Délai" value={metrics.count > 0 ? "~2.3j" : "—"} />
          </div>
          <div className={S.gaugeSection}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: "#6b7a99", fontSize: "0.625rem", fontWeight: 700, letterSpacing: "1.3px", textTransform: "uppercase" }}>Full Pay vs Split Pay</div>
              <div style={{ color: "#0EFF9C", fontSize: "0.75rem", fontWeight: 700 }}>{fullPayRatio}%</div>
            </div>
            <div style={{ flex: 1, minHeight: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Gauge pct={fullPayRatio} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 2 , fontSize: "0.7rem", color: "#6b7a99", flexWrap: "wrap" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                <span style={{ width: 4, height: 4, borderRadius: 999, background: "#0EFF9C" }} /> Full Pay {fullPayRatio}%
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
                <span style={{ width: 4, height: 4, borderRadius: 999, background: "#EFB027" }} /> Split Pay {100 - fullPayRatio}%
              </span>
            </div>
          </div>
        </div>

        {/* Right col — Close Score */}
        <div className={S.closeScoreSection}>
          <div style={{ color: "#0EFF9C", fontSize: "clamp(0.625rem, 2vw, 0.75rem)", fontWeight: 800, letterSpacing: "3.5px" }}>CLOSE SCORE</div>
          <div style={{ width: 24, height: 1, background: "#0EFF9C", opacity: 0.3, marginTop: 2 }} />
          <div style={{ width: "100%", height: "100%", minHeight: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Radar />
          </div>
          <div style={{ color: "#0EFF9C", fontSize: "0.625rem", fontWeight: 700, letterSpacing: "3.5px", opacity: 0.65, marginTop: 2, flexShrink: 0 }}>BON PROFIL</div>
        </div>
      </div>

      {/* Section 3 — 3 taux */}
      <div className={S.rateGrid + " mt-2 sm:mt-3"}>
        {[
          { label: "Taux no show", value: `${rates.noShow}%`, color: "#F87171", border: "#F8717133" },
          { label: "Taux follow up", value: `${rates.followUp}%`, color: "#EFB027", border: "#EFB02733" },
          { label: "Taux closing", value: `${rates.closing}%`, color: "#0EFF9C", border: "#0EFF9C33" },
        ].map((t) => (
          <div key={t.label} style={{ background: "#161d2e", border: `0.5px solid ${t.border}`, borderRadius: 10, padding: "10px 8px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "70px" }}>
            <div style={{ fontSize: "0.625rem", color: "#6b7a99", fontWeight: 700, letterSpacing: "1.3px", textTransform: "uppercase", marginBottom: 4 }}>{t.label}</div>
            <div style={{ fontSize: "clamp(18px, 5vw, 24px)", fontWeight: 800, lineHeight: 1, marginBottom: 2, color: t.color }}>{t.value}</div>
            <div style={{ fontSize: "0.7rem", opacity: 0.6, color: "#FFFFFF" }}>{t.sub}</div>
          </div>
        ))}
      </div>

      {/* Section 4 — Résumé */}
      <div className={S.summaryGrid}>
        {[
          { label: "Closes", value: String(summary.closes), color: "#0EFF9C", bar: "linear-gradient(90deg, #0EFF9C, #0EFF9C44)" },
          { label: "R1 effectués", value: String(summary.r1Done), color: "#FFFFFF", bar: "#2a3a50" },
          { label: "R2 effectués", value: String(summary.r2Done), color: "#FFFFFF", bar: "#2a3a50" },
          { label: "Follow up", value: String(summary.followUp), color: "#EFB027", bar: "linear-gradient(90deg, #EFB027, #EFB02744)" },
        ].map((c, i) => (
          <div key={c.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 4px", borderRight: i < 3 ? "0.5px solid #1e2530" : "none" }}>
            <div style={{ fontSize: "0.65rem", color: "#6b7a99", letterSpacing: "0.5px", marginBottom: 3, textTransform: "uppercase", fontWeight: 700 }}>{c.label}</div>
            <div style={{ fontSize: "clamp(16px, 4vw, 20px)", fontWeight: 900, lineHeight: 1, color: c.color }}>{c.value}</div>
            <div style={{ height: 2, width: 16, borderRadius: 999, background: c.bar, marginTop: 3 }} />
          </div>
        ))}
      </div>

      {/* Section 5 — bouton */}
      <div className="flex-shrink-0">
        <button onClick={() => setTrackOpen(true)} className={S.submitButton}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0D1117" strokeWidth={2.5}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>Générer mon Track Record (PDF)</span>
        </button>
      </div>
      <TrackRecordModal open={trackOpen} onClose={() => setTrackOpen(false)} rates={rates} />
    </div>
  );
};

export default Stats;
