type Props = {
  label: string;
  pct: number;
  display: string;
  color: "green" | "yellow" | "blue";
};

const grad = {
  green:  "linear-gradient(90deg,#0EFF9C66,#0EFF9C)",
  yellow: "linear-gradient(90deg,#EFB02766,#EFB027)",
  blue:   "linear-gradient(90deg,#3B82F666,#3B82F6)",
};
const txt = { green: "#0EFF9C", yellow: "#EFB027", blue: "#3B82F6" };

const ObjectiveBar = ({ label, pct, display, color }: Props) => (
  <div
    className="rounded-[12px] border-hair p-3 sm:p-4 flex flex-col gap-2 sm:gap-2.5"
    style={{ background: "#161d2e", borderColor: "#2a3a50" }}
  >
    <div className="flex items-center justify-between gap-2">
      <span className="text-[10px] sm:text-[12px] font-semibold text-white">{label}</span>
      <span className="text-[9px] sm:text-[11px] font-bold flex-shrink-0" style={{ color: txt[color] }}>{pct}%</span>
    </div>
    <div className="h-[5px] sm:h-[6px] rounded-full overflow-hidden" style={{ background: "#0D1117" }}>
      <div
        className="h-full rounded-full transition-150"
        style={{ width: `${pct}%`, background: grad[color] }}
      />
    </div>
    <div className="text-[9px] sm:text-[10px]" style={{ color: "#8892a0" }}>{display}</div>
  </div>
);

export default ObjectiveBar;
