type Props = { fullPct: number };

const GaugeChart = ({ fullPct }: Props) => {
  const cx = 100, cy = 95, r = 80;
  const fullEndAngle = Math.PI - (Math.PI * fullPct) / 100;
  const x0 = cx - r, y0 = cy;
  const xf = cx + Math.cos(fullEndAngle) * r;
  const yf = cy - Math.sin(fullEndAngle) * r;
  const x1 = cx + r;

  const nx = cx + Math.cos(fullEndAngle) * (r - 6);
  const ny = cy - Math.sin(fullEndAngle) * (r - 6);

  return (
    <svg viewBox="0 0 200 110" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <path
        d={`M ${x0} ${y0} A ${r} ${r} 0 0 1 ${xf} ${yf}`}
        fill="none"
        stroke="#0EFF9C"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path
        d={`M ${xf} ${yf} A ${r} ${r} 0 0 1 ${x1} ${y0}`}
        fill="none"
        stroke="#EFB027"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
      <circle cx={cx} cy={cy} r="4" fill="#FFFFFF" />
    </svg>
  );
};

export default GaugeChart;
