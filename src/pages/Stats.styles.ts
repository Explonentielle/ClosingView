export const statsContainer = "flex flex-col gap-2 sm:gap-4 h-full overflow-hidden p-3 sm:p-4";
export const filterSection = "flex gap-1 sm:gap-2 flex-wrap flex-shrink-0";
export const filterButton = (active: boolean) => ({
  background: active ? "#0EFF9C" : "#161d2e",
  color: active ? "#0D1117" : "#8892a0",
  border: active ? "none" : "0.5px solid #2a3a50",
  fontSize: "0.625rem",
  fontWeight: 700,
  padding: "4px 10px",
  borderRadius: 6,
  cursor: "pointer",
});

export const gridSection = "grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 flex-shrink-0 flex-1 overflow-hidden";
export const leftColSection = "flex flex-col gap-2 sm:gap-3 overflow-hidden";
export const kpiGrid = "grid grid-cols-2 gap-2 sm:gap-3 flex-shrink-0";

export const gaugeSection = "bg-[#161d2e] border-[0.5px] border-[#2a3a50] rounded-[10px] p-2 sm:p-3 flex flex-col gap-2 sm:gap-3 overflow-hidden";
export const closeScoreSection = "bg-[#060b14] border border-[#0EFF9C44] rounded-[12px] flex flex-col items-center justify-center p-2 sm:p-3";

export const rateGrid = "grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 flex-shrink-0";
export const summaryGrid = "grid grid-cols-2 sm:grid-cols-4 gap-0 border border-[#2a3a50] rounded-[10px] overflow-hidden bg-[#161d2e] flex-shrink-0";

export const submitButton = "w-full p-2 sm:p-3 bg-[#0EFF9C] text-[#0D1117] border-none rounded-[9px] text-[9px] sm:text-[11px] font-bold cursor-pointer flex items-center justify-center gap-2 h-8 sm:h-10 flex-shrink-0";
