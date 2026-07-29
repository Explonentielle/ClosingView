import type { DailyEntryHistoryRow } from "@/services";

type Props = {
  entries: DailyEntryHistoryRow[];
  loading: boolean;
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

const DailyEntriesHistory = ({ entries, loading }: Props) => (
  <div
    className="rounded-[12px] p-3 sm:p-4 flex flex-col gap-2 sm:gap-3"
    style={{ background: "#0a0f1a", border: "1px solid #2a3a50" }}
  >
    <span className="text-[10px] sm:text-[12px] font-bold text-white">Historique des saisies journalières</span>

    {loading ? (
      <div className="p-6 text-center" style={{ color: "#8892a0", fontSize: "12px" }}>Chargement...</div>
    ) : entries.length === 0 ? (
      <div className="p-6 text-center" style={{ color: "#8892a0", fontSize: "12px" }}>
        Aucune saisie sur cette période
      </div>
    ) : (
      <div className="max-h-[320px] overflow-y-auto space-y-1.5 pr-1">
        {entries.map((e) => (
          <div
            key={e.id}
            className="flex items-center justify-between gap-2 sm:gap-3 px-2.5 sm:px-3 py-2 rounded-[8px] flex-wrap"
            style={{ background: "#161d2e" }}
          >
            <div className="min-w-0 flex flex-col">
              <span className="text-[10px] sm:text-[11px] font-bold text-white">{fmtDate(e.entry_date)}</span>
              <span className="text-[9px] sm:text-[10px] truncate" style={{ color: "#8892a0" }}>
                {e.clientName || "—"}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0 text-[9px] sm:text-[10px]" style={{ color: "#8892a0" }}>
              <span>R1 <span className="font-bold text-white">{e.r1_done}/{e.r1_planned}</span></span>
              <span>R2 <span className="font-bold text-white">{e.r2_done}/{e.r2_planned}</span></span>
              <span
                className="px-2 py-0.5 rounded-full font-bold"
                style={{ background: "#0EFF9C18", color: "#0EFF9C" }}
              >
                {e.closes_count} close{e.closes_count > 1 ? "s" : ""}
              </span>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default DailyEntriesHistory;
