import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  id: string;
  display_name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  city?: string | null;
  close_score?: number | null;
};

const CITY_COORDS: Record<string, [number, number]> = {
  Paris: [320, 130],
  Lyon: [365, 245],
  Marseille: [380, 350],
  Bordeaux: [200, 290],
  Toulouse: [255, 340],
  Nantes: [165, 195],
  Strasbourg: [450, 140],
  Lille: [320, 60],
  Rennes: [145, 165],
  Nice: [435, 340],
  Montpellier: [325, 345],
  Grenoble: [395, 260],
  Brest: [70, 155],
  Dijon: [380, 195],
  Reims: [355, 110],
  Rouen: [275, 105],
  Tours: [255, 200],
  Angers: [195, 195],
  Caen: [220, 115],
  Limoges: [275, 265],
};

const fullName = (p: Profile) =>
  p.display_name || `${p.first_name ?? ""} ${p.last_name ?? ""}`.trim() || "Closer";

const colorFor = (score: number) =>
  score >= 70 ? "#0EFF9C" : score >= 50 ? "#EFB027" : "#3B82F6";

const MapTab = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [hover, setHover] = useState<{ p: Profile; x: number; y: number } | null>(null);

  useEffect(() => {
    supabase
      .from("profiles")
      .select("id, first_name, last_name, display_name, city, close_score")
      .order("close_score", { ascending: false, nullsFirst: false })
      .limit(200)
      .then(({ data }) => setProfiles((data as any) ?? []));
  }, []);

  const points = profiles
    .filter((p) => p.city && CITY_COORDS[p.city] && p.close_score != null)
    .map((p, i) => ({ ...p, _xy: CITY_COORDS[p.city!], _i: i }));

  const activeCount = profiles.length;

  return (
    <div className="relative rounded-[12px] overflow-hidden" style={{ background: "#060b14", border: "0.5px solid #2a3a50", height: 540 }}>
      {/* Active count */}
      <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
        style={{ background: "#0EFF9C12", border: "0.5px solid #0EFF9C55", color: "#0EFF9C" }}>
        <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#0EFF9C" }} />
        {activeCount} closers actifs
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-3 px-3 py-1.5 rounded-[8px] text-[10px]"
        style={{ background: "#161d2e", border: "0.5px solid #2a3a50", color: "#c8d5e8" }}>
        <LegendDot c="#0EFF9C" label="70+" />
        <LegendDot c="#EFB027" label="50-69" />
        <LegendDot c="#3B82F6" label="<50" />
      </div>

      <svg viewBox="0 0 500 500" className="w-full h-full">
        <defs>
          <radialGradient id="franceGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0EFF9C" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#0EFF9C" stopOpacity="0" />
          </radialGradient>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1a2232" strokeWidth="0.5" />
          </pattern>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width="500" height="500" fill="url(#grid)" />
        <ellipse cx="270" cy="240" rx="220" ry="200" fill="url(#franceGlow)" />

        {/* Schematic France outline */}
        <path
          d="M 90 150 Q 60 200 80 280 Q 90 350 180 400 Q 260 440 340 410 Q 420 380 440 320 Q 460 250 430 180 Q 400 100 320 70 Q 240 50 170 80 Q 110 110 90 150 Z"
          fill="#0a0f1a"
          stroke="#1a2232"
          strokeWidth="1"
        />

        {points.map((p) => {
          const [x, y] = p._xy;
          const score = p.close_score ?? 0;
          const color = colorFor(score);
          const r = 9 + score / 14;
          return (
            <g key={p.id}
              onMouseEnter={() => setHover({ p, x, y })}
              onMouseLeave={() => setHover(null)}
              style={{ cursor: "pointer" }}>
              <circle cx={x} cy={y} r={r * 2} fill={color} opacity={0.15} filter="url(#glow)" />
              <circle cx={x} cy={y} r={r} fill={color} opacity={0.9} />
              <text x={x} y={y + 3} textAnchor="middle" fontSize="9" fontWeight="700" fill="#0D1117">
                {score}
              </text>
            </g>
          );
        })}
      </svg>

      {hover && (
        <div className="absolute pointer-events-none px-2.5 py-1.5 rounded-[6px] text-[10px]"
          style={{
            background: "#161d2e", border: "0.5px solid #2a3a50", color: "white",
            left: `${(hover.x / 500) * 100}%`, top: `${(hover.y / 500) * 100}%`,
            transform: "translate(-50%, -150%)",
          }}>
          <div className="font-bold">{fullName(hover.p)}</div>
          <div style={{ color: "#8892a0" }}>{hover.p.city} · Score {hover.p.close_score}</div>
        </div>
      )}
    </div>
  );
};

const LegendDot = ({ c, label }: { c: string; label: string }) => (
  <span className="flex items-center gap-1">
    <span className="w-1.5 h-1.5 rounded-full" style={{ background: c }} />
    {label}
  </span>
);

export default MapTab;
