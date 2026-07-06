import { useState } from "react";

const FILTERS = ["Global", "Niche", "Infopreneur", "Challenge"];

const KpiCell = ({ label, value, valueColor = "#FFFFFF" }: { label: string; value: string; valueColor?: string }) => (
  <div style={{ background: "#161d2e", border: "0.5px solid #2a3a50", borderRadius: 10, padding: "10px 12px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
    <div style={{ color: "#6b7a99", fontSize: 7.5, fontWeight: 700, letterSpacing: "1.3px", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
    <div style={{ color: valueColor, fontSize: 16, fontWeight: 800, lineHeight: 1 }}>{value}</div>
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

const Stats = () => {
  const [filter, setFilter] = useState("Global");
  const [trackOpen, setTrackOpen] = useState(false);
  const rates = {
    noShow: { v: 12, x: 3, y: 24 },
    followUp: { v: 17, deals: 4 },
    closing: { v: 29, x: 7, y: 24 },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, height: "100%", overflow: "hidden", padding: "12px 14px" }}>
      {/* Section 1 — Filtres */}
      <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: active ? "#0EFF9C" : "#161d2e",
                color: active ? "#0D1117" : "#8892a0",
                border: active ? "none" : "0.5px solid #2a3a50",
                fontSize: 10,
                fontWeight: 700,
                padding: "4px 12px",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* Section 2 — Grid 2 cols */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, height: 246, flexShrink: 0 }}>
        {/* Left col */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, height: 108 }}>
            <KpiCell label="€ contracté" value="12 200€" />
            <KpiCell label="€ collecté" value="9 800€" valueColor="#0EFF9C" />
            <KpiCell label="Nb. closes" value="7" />
            <KpiCell label="Délai" value="2.3j" />
          </div>
          <div style={{ height: 130, background: "#161d2e", border: "0.5px solid #2a3a50", borderRadius: 10, padding: "10px 14px", marginTop: "5px", display: "flex", flexDirection: "column", overflow: "hidden", gap: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ color: "#6b7a99", fontSize: 7.5, fontWeight: 700, letterSpacing: "1.3px", textTransform: "uppercase" }}>Full Pay vs Split Pay</div>
              <div style={{ color: "#0EFF9C", fontSize: 9, fontWeight: 700 }}>60%</div>
            </div>
            <div style={{ flex: 1, minHeight: 0, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Gauge pct={60} />
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 14, fontSize: 8.5, color: "#6b7a99" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "#0EFF9C" }} /> Full Pay 60%
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 6, height: 6, borderRadius: 999, background: "#EFB027" }} /> Split Pay 40%
              </span>
            </div>
          </div>
        </div>

        {/* Right col — Close Score */}
        <div style={{ height: 246, overflow: "hidden", background: "#060b14", border: "1px solid #0EFF9C44", borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "8px 4px" }}>
          <div style={{ color: "#0EFF9C", fontSize: 9, fontWeight: 800, letterSpacing: "3.5px" }}>CLOSE SCORE</div>
          <div style={{ width: 28, height: 1, background: "#0EFF9C", opacity: 0.3, marginTop: 2 }} />
          <Radar />
          <div style={{ color: "#0EFF9C", fontSize: 7.5, fontWeight: 700, letterSpacing: "3.5px", opacity: 0.65, marginTop: 2, flexShrink: 0 }}>BON PROFIL</div>
        </div>
      </div>

      {/* Section 3 — 3 taux */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, height: 90, flexShrink: 0, marginTop: 12 }}>
        {[
          { label: "Taux no show", value: "12%", sub: "3/24 RDV", color: "#F87171", border: "#F8717133" },
          { label: "Taux follow up", value: "17%", sub: "4 deals", color: "#EFB027", border: "#EFB02733" },
          { label: "Taux closing", value: "29%", sub: "7/24 RDV", color: "#0EFF9C", border: "#0EFF9C33" },
        ].map((t) => (
          <div key={t.label} style={{ background: "#161d2e", border: `0.5px solid ${t.border}`, borderRadius: 10, padding: "12px 14px", textAlign: "center", height: 90, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <div style={{ fontSize: 7.5, color: "#6b7a99", fontWeight: 700, letterSpacing: "1.3px", textTransform: "uppercase", marginBottom: 6 }}>{t.label}</div>
            <div style={{ fontSize: 24, fontWeight: 800, lineHeight: 1, marginBottom: 3, color: t.color }}>{t.value}</div>
            <div style={{ fontSize: 8.5, opacity: 0.6, color: "#FFFFFF" }}>{t.sub}</div>
          </div>
        ))}
      </div>

      {/* Section 4 — Résumé */}
      <div style={{ height: 80, flexShrink: 0, background: "#161d2e", border: "0.5px solid #2a3a50", borderRadius: 10, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", height: "100%" }}>
          {[
            { label: "Closes", value: "7", color: "#0EFF9C", bar: "linear-gradient(90deg, #0EFF9C, #0EFF9C44)" },
            { label: "R1 effectués", value: "24", color: "#FFFFFF", bar: "#2a3a50" },
            { label: "R2 effectués", value: "11", color: "#FFFFFF", bar: "#2a3a50" },
            { label: "Follow up", value: "4", color: "#EFB027", bar: "linear-gradient(90deg, #EFB027, #EFB02744)" },
          ].map((c, i) => (
            <div key={c.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 8, borderRight: i < 3 ? "0.5px solid #1e2530" : "none" }}>
              <div style={{ fontSize: 8, color: "#6b7a99", letterSpacing: "1px", marginBottom: 5, textTransform: "uppercase", fontWeight: 700 }}>{c.label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1, color: c.color }}>{c.value}</div>
              <div style={{ height: 3, width: 20, borderRadius: 999, background: c.bar, marginTop: 4 }} />
            </div>
          ))}
        </div>
      </div>

      {/* Section 5 — bouton */}
      <div style={{ flexShrink: 0 }}>
        <button onClick={() => setTrackOpen(true)} style={{ width: "100%", padding: 10, background: "#0EFF9C", color: "#0D1117", border: "none", borderRadius: 9, fontSize: 11, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "Inter, sans-serif", height: 40 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0D1117" strokeWidth={2.5}>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Générer mon Track Record (PDF)
        </button>
      </div>
      <TrackRecordModal open={trackOpen} onClose={() => setTrackOpen(false)} rates={rates} />
    </div>
  );
};

export default Stats;
