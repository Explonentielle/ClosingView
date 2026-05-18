import { useState, useRef, useEffect } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "lucide-react";
import "react-day-picker/dist/style.css";

type Props = { onRangeSelect: (range: DateRange | undefined) => void };

export default function DatePickerFilter({ onRangeSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const label =
    range?.from
      ? range.to
        ? `${format(range.from, "d MMM", { locale: fr })} → ${format(range.to, "d MMM", { locale: fr })}`
        : format(range.from, "d MMM", { locale: fr })
      : null;

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen(!open)}
        className="h-8 px-2.5 flex items-center gap-1.5 text-[11px] font-bold transition-150"
        style={{
          background: open || label ? "#0EFF9C18" : "transparent",
          border: `0.5px solid ${open || label ? "#0EFF9C55" : "#2a3a50"}`,
          borderRadius: 8,
          color: open || label ? "#0EFF9C" : "#8892a0",
          whiteSpace: "nowrap",
        }}
      >
        <Calendar size={13} />
        {label || "Dates"}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: 38,
            left: 0,
            zIndex: 50,
            background: "#161d2e",
            border: "0.5px solid #2a3a50",
            borderRadius: 12,
            padding: 12,
            boxShadow: "0 8px 24px #00000088",
          }}
        >
          <DayPicker
            mode="range"
            selected={range}
            onSelect={(r) => {
              setRange(r);
              onRangeSelect(r);
            }}
            locale={fr}
            showOutsideDays
            styles={{
              root: { fontFamily: "Inter, sans-serif", fontSize: 12, color: "white" },
              caption: { color: "white", marginBottom: 8 },
              head_cell: { color: "#6b7a99", fontSize: 10, fontWeight: 700 },
              day: { color: "white", borderRadius: 6 },
              day_selected: { background: "#0EFF9C", color: "#0D1117", fontWeight: 700 },
              day_range_middle: { background: "#0EFF9C22", color: "#0EFF9C" },
              day_today: { border: "0.5px solid #0EFF9C44", color: "#0EFF9C" },
              day_outside: { color: "#3a4a5a" },
              nav_button: { color: "#8892a0", background: "transparent" },
            }}
          />
          {range?.from && range?.to && (
            <button
              onClick={() => setOpen(false)}
              style={{
                width: "100%",
                background: "#0EFF9C",
                color: "#0D1117",
                border: "none",
                borderRadius: 8,
                padding: 8,
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                marginTop: 8,
                fontFamily: "Inter, sans-serif",
              }}
            >
              Appliquer
            </button>
          )}
        </div>
      )}
    </div>
  );
}
