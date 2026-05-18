import { useState } from "react";
import { Download } from "lucide-react";
import KpiCard from "@/components/dashboard/KpiCard";
import CloseScoreRadar from "@/components/stats/CloseScoreRadar";
import GaugeChart from "@/components/stats/GaugeChart";

const FILTERS = ["Global", "Niche", "Infopreneur", "Challenge"];

const Stats = () => {
  const [filter, setFilter] = useState("Global");
  const fullPct = 60;

  return (
    <div className="animate-fade-in space-y-3 max-w-[1280px]">
      {/* Filtres */}
      <div className="flex gap-1.5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 h-7 rounded-full text-[11px] font-bold border-hair transition-150"
            style={{
              background: filter === f ? "#0EFF9C" : "transparent",
              color: filter === f ? "#0D1117" : "#8892a0",
              borderColor: filter === f ? "#0EFF9C" : "#2a3a50",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      {/* LIGNE 1 — 4 KPI + jauge — 220px */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3" style={{ maxHeight: 220 }}>
        <div className="grid grid-cols-2 gap-3">
          <KpiCard label="€ contracté" value="12 200€" />
          <KpiCard label="€ collecté" value="9 800€" valueColor="#0EFF9C" />
          <KpiCard label="Nb. closes" value="7" />
          <KpiCard label="Délai closing" value="2.3j" />
        </div>

        <div
          className="rounded-[12px] border-hair p-3 flex flex-col"
          style={{ background: "#161d2e", borderColor: "#2a3a50" }}
        >
          <div className="text-[10px] tracking-[1.2px] font-semibold uppercase mb-1" style={{ color: "#8892a0" }}>
            Full Pay vs Split Pay
          </div>
          <div className="flex-1 min-h-0">
            <GaugeChart fullPct={fullPct} />
          </div>
          <div className="flex items-center justify-center gap-4 text-[10px] mt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "#0EFF9C" }} />
              <span style={{ color: "#8892a0" }}>Full Pay</span>
              <span style={{ color: "#0EFF9C" }} className="font-bold">{fullPct}%</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "#EFB027" }} />
              <span style={{ color: "#8892a0" }}>Split Pay</span>
              <span style={{ color: "#EFB027" }} className="font-bold">{100 - fullPct}%</span>
            </span>
          </div>
        </div>
      </div>

      {/* LIGNE 2 — Close Score (55%) + 3 taux (45%) — 200px */}
      <div
        className="grid gap-3"
        style={{ gridTemplateColumns: "55% 45%", maxHeight: 200 }}
      >
        <div
          className="rounded-[12px] border-hair p-2 flex flex-col items-center"
          style={{ background: "#060b14", borderColor: "#0EFF9C44", height: 200 }}
        >
          <div className="text-[8px] font-bold" style={{ color: "#0EFF9C", letterSpacing: "3px" }}>
            CLOSE SCORE
          </div>
          <div className="flex-1 w-full min-h-0">
            <CloseScoreRadar values={[93, 80, 80, 73, 70]} score={74} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          {[
            { label: "Taux no show",   value: "12%", color: "#F87171", sub: "3/24 RDV" },
            { label: "Taux follow up", value: "17%", color: "#EFB027", sub: "4 deals" },
            { label: "Taux closing",   value: "29%", color: "#0EFF9C", sub: "7/24 RDV" },
          ].map((t) => (
            <div
              key={t.label}
              className="rounded-[10px] border-hair px-3 flex items-center justify-between"
              style={{ background: "#161d2e", borderColor: "#2a3a50", height: 62 }}
            >
              <div>
                <div className="text-[9px] uppercase tracking-[1px] font-bold" style={{ color: "#8892a0" }}>
                  {t.label}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: "#6b7a99" }}>{t.sub}</div>
              </div>
              <div className="text-[22px] font-bold" style={{ color: t.color }}>{t.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* LIGNE 3 — Résumé + CTA */}
      <div
        className="rounded-[12px] border-hair px-4 flex items-center"
        style={{ background: "#161d2e", borderColor: "#2a3a50", height: 90 }}
      >
        <div className="grid grid-cols-4 w-full">
          {[
            { label: "Closes",       value: "7",  color: "#0EFF9C" },
            { label: "R1 effectués", value: "24", color: "#FFFFFF" },
            { label: "R2 effectués", value: "11", color: "#FFFFFF" },
            { label: "Follow up",    value: "4",  color: "#EFB027" },
          ].map((c, i) => (
            <div
              key={c.label}
              className="px-3"
              style={{ borderLeft: i === 0 ? "none" : "0.5px solid #2a3a50" }}
            >
              <div className="text-[10px] uppercase tracking-wide font-bold mb-1" style={{ color: "#8892a0" }}>
                {c.label}
              </div>
              <div className="text-[22px] font-bold" style={{ color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>
      </div>

      <button
        className="w-full rounded-[10px] font-bold flex items-center justify-center gap-2 transition-150"
        style={{ background: "#0EFF9C", color: "#0D1117", height: 36, fontSize: 11 }}
      >
        <Download size={13} /> Générer mon Track Record (PDF)
      </button>
    </div>
  );
};

export default Stats;
