import { ArrowDown, ArrowUp } from "lucide-react";

type Props = {
  label: string;
  value: string;
  badge?: { text: string; tone: "green" | "yellow" | "red"; dir: "up" | "down" };
  sub?: string;
  valueColor?: string;
};

const toneMap = {
  green:  { bg: "#0EFF9C18", color: "#0EFF9C" },
  yellow: { bg: "#EFB02718", color: "#EFB027" },
  red:    { bg: "#F8717118", color: "#F87171" },
};

const KpiCard = ({ label, value, badge, sub, valueColor = "#FFFFFF" }: Props) => (
  <div
    className="rounded-[12px] border-hair p-4 flex flex-col gap-2"
    style={{ background: "#161d2e", borderColor: "#2a3a50" }}
  >
    <div className="text-[10px] tracking-[1.2px] font-semibold uppercase" style={{ color: "#8892a0" }}>
      {label}
    </div>
    <div className="flex items-end justify-between gap-2">
      <span className="text-[24px] font-bold leading-none" style={{ color: valueColor }}>
        {value}
      </span>
      {badge && (
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
          style={{ background: toneMap[badge.tone].bg, color: toneMap[badge.tone].color }}
        >
          {badge.dir === "up" ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
          {badge.text}
        </span>
      )}
    </div>
    {sub && (
      <div className="text-[10px]" style={{ color: "#6b7a99" }}>
        {sub}
      </div>
    )}
  </div>
);

export default KpiCard;
