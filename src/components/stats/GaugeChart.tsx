type Props = { fullPct: number }; // 0..100 — Full Pay

const GaugeChart = ({ fullPct }: Props) => {
  // demi-cercle viewBox custom selon spec
  const cx = 80, cy = 65, r = 55;
  // 180° = arc demi-cercle
  const fullEndAngle = Math.PI - (Math.PI * fullPct) / 100; // de PI (gauche) vers 0 (droite)
  const x0 = cx - r, y0 = cy;
  const xf = cx + Math.cos(fullEndAngle) * r;
  const yf = cy - Math.sin(fullEndAngle) * r;
  const x1 = cx + r;

  // aiguille à fullPct (point sur l'arc)
  const needleAngle = Math.PI - (Math.PI * fullPct) / 100;
  const nx = cx + Math.cos(needleAngle) * (r - 4);
  const ny = cy - Math.sin(needleAngle) * (r - 4);

  return (
    <svg viewBox="4 0 152 70" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      {/* arc vert (Full Pay) */}
      <path
        d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${xf} ${yf}`}
        fill="none" stroke="#0EFF9C" strokeWidth="6" strokeLinecap="round"
      />
      {/* arc jaune (Split Pay) */}
      <path
        d={`M ${xf} ${yf} A ${r} ${r} 0 0 1 ${x1} ${y0}`}
        fill="none" stroke="#EFB027" strokeWidth="6" strokeLinecap="round"
      />
      {/* aiguille blanche */}
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#FFFFFF" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="3" fill="#FFFFFF" />
    </svg>
  );
};

export default GaugeChart;
