import { useMemo, useState } from "react";

type Props = {
  title: string;
  data: number[];
  color: string;            // hex
  badgeFormatter: (avg: number, hovered?: number) => string;
  monthLabels: string[];
  activeMonthIndex: number; // index in monthLabels for active highlight
  formatY?: (v: number) => string;
};

// Catmull-Rom → Bezier smooth path
function smoothPath(points: [number, number][]) {
  if (points.length < 2) return "";
  const d = [`M ${points[0][0]} ${points[0][1]}`];
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d.push(`C ${c1x} ${c1y}, ${c2x} ${c2y}, ${p2[0]} ${p2[1]}`);
  }
  return d.join(" ");
}

const W = 560, H = 200, P = { l: 16, r: 16, t: 18, b: 28 };

const InteractiveChart = ({ title, data, color, badgeFormatter, monthLabels, activeMonthIndex, formatY }: Props) => {
  const [hover, setHover] = useState<number | null>(null);

  const { points, avg } = useMemo(() => {
    if (data.length === 0) return { points: [], avg: 0 };
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const stepX = (W - P.l - P.r) / Math.max(data.length - 1, 1);
    const ys = data.map(v => P.t + (H - P.t - P.b) * (1 - (v - min) / range));
    const xs = data.map((_, i) => P.l + i * stepX);
    const pts = xs.map((x, i) => [x, ys[i]] as [number, number]);
    const a = data.reduce((s, v) => s + v, 0) / data.length;
    return { points: pts, avg: a };
  }, [data]);

  const path = useMemo(() => smoothPath(points), [points]);
  const areaPath = `${path} L ${points[points.length - 1][0]} ${H - P.b} L ${points[0][0]} ${H - P.b} Z`;

  const refY = useMemo(() => {
    if (data.length === 0) return H - P.b;
    const min = Math.min(...data), max = Math.max(...data);
    const range = max - min || 1;
    return P.t + (H - P.t - P.b) * (1 - (avg - min) / range);
  }, [data, avg]);

  const hoveredVal = hover !== null ? data[hover] : undefined;
  const badgeText = badgeFormatter(avg, hoveredVal);

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = (e.currentTarget as SVGSVGElement).getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    const stepX = (W - P.l - P.r) / (data.length - 1);
    const idx = Math.max(0, Math.min(data.length - 1, Math.round((x - P.l) / stepX)));
    setHover(idx);
  };

  return (
    <div
      className="rounded-[12px] border-hair p-4 flex flex-col gap-3"
      style={{ background: "#0a0f1a", borderColor: "#2a3a50" }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-[10px] sm:text-[12px] font-semibold text-white">{title}</h3>
        </div>
        <span
          className="text-[8px] sm:text-[10px] font-bold px-2 py-1 rounded-md transition-150 flex-shrink-0"
          style={{ background: `${color}18`, color }}
        >
          {badgeText}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
      >
        <defs>
          <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ligne de référence pointillée */}
        <line
          x1={P.l} x2={W - P.r} y1={refY} y2={refY}
          stroke="#ffffff" strokeOpacity="0.15" strokeDasharray="3 4" strokeWidth="0.6"
        />

        {/* aire */}
        <path d={areaPath} fill={`url(#grad-${color})`} />
        {/* courbe */}
        <path d={path} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" />

        {/* hover */}
        {hover !== null && (() => {
          const [hx, hy] = points[hover];
          return (
            <g pointerEvents="none">
              <line x1={hx} x2={hx} y1={P.t} y2={H - P.b} stroke={color} strokeOpacity="0.6" strokeWidth="1.2" />
              {/* halo discret */}
              <circle cx={hx} cy={hy} r="4.5" fill={color} fillOpacity="0.3" />
              <circle cx={hx} cy={hy} r="2.5" fill={color} fillOpacity="0.8" />
            </g>
          );
        })()}

        {/* labels mois */}
        {monthLabels.map((m, i) => {
          const x = P.l + (i * (W - P.l - P.r)) / (monthLabels.length - 1);
          const active = i === activeMonthIndex;
          return (
            <text
              key={m}
              x={x}
              y={H - 8}
              textAnchor="middle"
              fontSize="9"
              fontWeight={active ? 700 : 500}
              fill={active ? color : "#8892a0"}
            >
              {m}
            </text>
          );
        })}
      </svg>
    </div>
  );
};

export default InteractiveChart;
