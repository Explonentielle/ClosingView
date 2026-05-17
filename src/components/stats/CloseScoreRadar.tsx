type Props = { values: number[] }; // 5 axes 0..100

const labels = ["Closing", "Cash", "Régularité", "Cycle de vente", "Objectifs"];
const cx = 140, cy = 110, R = 78;

const angleFor = (i: number) => (-Math.PI / 2) + (i * 2 * Math.PI) / 5;

const polygon = (vals: number[], radius: number) =>
  vals.map((v, i) => {
    const r = (radius * v) / 100;
    const a = angleFor(i);
    return `${cx + Math.cos(a) * r},${cy + Math.sin(a) * r}`;
  }).join(" ");

const CloseScoreRadar = ({ values }: Props) => {
  return (
    <svg viewBox="0 0 280 220" className="w-full h-full">
      <defs>
        <radialGradient id="rgGreen" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#0EFF9C" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0EFF9C" stopOpacity="0.08" />
        </radialGradient>
      </defs>

      {/* grilles */}
      {[1, 0.75, 0.5, 0.25].map((s, i) => (
        <polygon
          key={i}
          points={polygon([100, 100, 100, 100, 100], R * s)}
          fill="none" stroke="#2a3a50" strokeWidth="0.5"
        />
      ))}

      {/* axes */}
      {labels.map((_, i) => {
        const a = angleFor(i);
        return (
          <line key={i}
            x1={cx} y1={cy}
            x2={cx + Math.cos(a) * R} y2={cy + Math.sin(a) * R}
            stroke="#2a3a50" strokeWidth="0.5"
          />
        );
      })}

      {/* shape */}
      <polygon
        points={polygon(values, R)}
        fill="url(#rgGreen)" stroke="#0EFF9C" strokeWidth="1.2"
      />

      {/* labels */}
      {labels.map((l, i) => {
        const a = angleFor(i);
        const lx = cx + Math.cos(a) * (R + 14);
        const ly = cy + Math.sin(a) * (R + 14);
        return (
          <text
            key={l} x={lx} y={ly} textAnchor="middle"
            fontSize="8" fontWeight="700"
            fill="#8892a0" style={{ letterSpacing: "0.5px" }}
          >
            {l.toUpperCase()} {values[i]}%
          </text>
        );
      })}

      {/* score centre glow (multi-stroke fake glow, no filter blur) */}
      <text x={cx} y={cy + 6} textAnchor="middle" fontSize="26" fontWeight="800"
        fill="#0EFF9C" stroke="#0EFF9C" strokeWidth="0.4" opacity="0.95"
      >74</text>

      <text x={cx} y={210} textAnchor="middle" fontSize="8" fontWeight="700"
        fill="#0EFF9C" style={{ letterSpacing: "3px" }}>BON PROFIL</text>
    </svg>
  );
};

export default CloseScoreRadar;
