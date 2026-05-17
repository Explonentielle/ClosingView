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
    <div className="animate-fade-in space-y-5 max-w-[1280px]">
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
          >{f}</button>
        ))}
      </div>

      {/* Grid 2 cols */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Colonne gauche */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <KpiCard label="€ contracté" value="12 200€" />
            <KpiCard label="€ collecté"  value="9 800€" valueColor="#0EFF9C" />
            <KpiCard label="Nb. closes"  value="7" />
            <KpiCard label="Délai closing" value="2.3j" />
          </div>

          <div
            className="rounded-[12px] border-hair p-3 flex items-center gap-3"
            style={{ background: "#161d2e", borderColor: "#2a3a50", height: 110 }}
          >
            <div className="flex-1 h-full">
              <GaugeChart fullPct={fullPct} />
            </div>
            <div className="text-[10px] space-y-1.5 pr-2">
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#0EFF9C" }} /><span style={{ color: "#8892a0" }}>Full Pay</span><span style={{ color: "#0EFF9C" }} className="font-bold">{fullPct}%</span></div>
              <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#EFB027" }} /><span style={{ color: "#8892a0" }}>Split Pay</span><span style={{ color: "#EFB027" }} className="font-bold">{100 - fullPct}%</span></div>
            </div>
          </div>
        </div>

        {/* Colonne droite — Close Score */}
        <div
          className="rounded-[12px] border-hair p-3 flex flex-col"
          style={{ background: "#060b14", borderColor: "#0EFF9C55", height: 227 }}
        >
          <div className="text-[9px] font-bold mb-1" style={{ color: "#0EFF9C", letterSpacing: "3.5px" }}>
            CLOSE SCORE
          </div>
          <div className="flex-1">
            <CloseScoreRadar values={[93, 80, 80, 73, 70]} />
          </div>
        </div>
      </div>

      {/* 3 Taux */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <KpiCard label="Taux no show"   value="12%" valueColor="#F87171" sub="3/24 RDV" />
        <KpiCard label="Taux follow up" value="17%" valueColor="#EFB027" sub="4 deals" />
        <KpiCard label="Taux closing"   value="29%" valueColor="#0EFF9C" sub="7/24 RDV" />
      </div>

      {/* Résumé de période */}
      <div
        className="rounded-[12px] border-hair p-4"
        style={{ background: "#161d2e", borderColor: "#2a3a50" }}
      >
        <h3 className="text-[12px] font-bold text-white mb-3">Résumé de période</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x-[0.5px]" style={{ borderColor: "#2a3a50" }}>
          {[
            { label: "Closes",        value: "7",  color: "#0EFF9C", bar: true,  barColor: "linear-gradient(90deg,#0EFF9C66,#0EFF9C)" },
            { label: "R1 effectués",  value: "24", color: "#FFFFFF" },
            { label: "R2 effectués",  value: "11", color: "#FFFFFF" },
            { label: "Follow up",     value: "4",  color: "#EFB027", bar: true,  barColor: "linear-gradient(90deg,#EFB02766,#EFB027)" },
          ].map((c, i) => (
            <div key={c.label} className="px-3 first:pl-0" style={{ borderLeftColor: i === 0 ? "transparent" : "#2a3a50" }}>
              <div className="text-[10px] uppercase tracking-wide font-bold mb-1" style={{ color: "#8892a0" }}>{c.label}</div>
              <div className="text-[20px] font-bold" style={{ color: c.color }}>{c.value}</div>
              {c.bar && (
                <div className="h-[3px] mt-2 rounded-full" style={{ background: c.barColor }} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <button
        className="w-full h-11 rounded-[10px] font-bold text-[12px] flex items-center justify-center gap-2 transition-150"
        style={{ background: "#0EFF9C", color: "#0D1117" }}
      >
        <Download size={14} /> Générer mon Track Record (PDF)
      </button>
    </div>
  );
};

export default Stats;
