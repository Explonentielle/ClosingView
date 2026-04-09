import { useMemo } from "react";

interface RadarAxis {
  label: string;
  shortLabel: string;
  value: number;
  max: number;
}

const defaultAxes: RadarAxis[] = [
  { label: "Taux de closing", shortLabel: "Closing", value: 28, max: 30 },
  { label: "Cash collecté", shortLabel: "Cash", value: 20, max: 25 },
  { label: "Régularité", shortLabel: "Régularité", value: 16, max: 20 },
  { label: "Temps signature", shortLabel: "Temps", value: 11, max: 15 },
  { label: "Objectifs atteints", shortLabel: "Objectifs", value: 7, max: 10 },
];

const SIZE = 280;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 100;

function polarToXY(angle: number, radius: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(rad), y: CY + radius * Math.sin(rad) };
}

function polygonPoints(values: number[], maxValues: number[], radius: number) {
  return values
    .map((v, i) => {
      const pct = v / maxValues[i];
      const angle = (360 / values.length) * i;
      const { x, y } = polarToXY(angle, radius * pct);
      return `${x},${y}`;
    })
    .join(" ");
}

function gridPolygon(n: number, radius: number) {
  return Array.from({ length: n }, (_, i) => {
    const angle = (360 / n) * i;
    const { x, y } = polarToXY(angle, radius);
    return `${x},${y}`;
  }).join(" ");
}

interface Props {
  axes?: RadarAxis[];
  className?: string;
}

const CloseScoreRadar = ({ axes = defaultAxes, className = "" }: Props) => {
  const values = axes.map((a) => a.value);
  const maxValues = axes.map((a) => a.max);

  const labelPositions = useMemo(
    () =>
      axes.map((_, i) => {
        const angle = (360 / axes.length) * i;
        return polarToXY(angle, R + 32);
      }),
    [axes]
  );

  const dotPositions = useMemo(
    () =>
      axes.map((a, i) => {
        const pct = a.value / a.max;
        const angle = (360 / axes.length) * i;
        return polarToXY(angle, R * pct);
      }),
    [axes]
  );

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
        {/* Grid lines */}
        <polygon points={gridPolygon(5, R)} fill="none" stroke="#2a3040" strokeWidth="0.5" />
        <polygon points={gridPolygon(5, R * 0.5)} fill="none" stroke="#2a3040" strokeWidth="0.5" strokeDasharray="4 3" />

        {/* Axis lines */}
        {axes.map((_, i) => {
          const angle = (360 / axes.length) * i;
          const { x, y } = polarToXY(angle, R);
          return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="#2a3040" strokeWidth="0.5" />;
        })}

        {/* Score area */}
        <polygon
          points={polygonPoints(values, maxValues, R)}
          fill="hsl(155 100% 50% / 0.2)"
          stroke="hsl(155 100% 50%)"
          strokeWidth="1.5"
        />

        {/* Dots */}
        {dotPositions.map((pos, i) => (
          <circle key={i} cx={pos.x} cy={pos.y} r={3} fill="hsl(155 100% 50%)" />
        ))}

        {/* Labels */}
        {labelPositions.map((pos, i) => (
          <g key={i}>
            <text
              x={pos.x}
              y={pos.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-muted-foreground"
              fontSize="10"
              fontFamily="Inter"
            >
              {axes[i].shortLabel}
            </text>
            <text
              x={pos.x}
              y={pos.y + 13}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="hsl(155 100% 50%)"
              fontSize="9"
              fontWeight="600"
              fontFamily="Inter"
            >
              {axes[i].value}/{axes[i].max}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
};

export default CloseScoreRadar;
