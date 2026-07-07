import { useStreak } from "@/hooks/useStreak";

const StreakBanner = () => {
  const { streak, loading } = useStreak();
  if (loading || streak < 1) return null;
  return (
    <div
      className="rounded-[10px] border-hair px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2"
      style={{ background: "#EFB02712", borderColor: "#EFB02755" }}
    >
      <span className="text-[10px] sm:text-[12px] font-bold min-w-0" style={{ color: "#EFB027" }}>
        🔥 {streak} jour{streak > 1 ? "s" : ""} consécutif{streak > 1 ? "s" : ""} — Top 20% !
      </span>
      <span
        className="text-[8px] sm:text-[9px] font-black tracking-widest px-2 py-1 rounded-[6px] flex-shrink-0"
        style={{ background: "#EFB02722", color: "#EFB027" }}
      >
        STREAK
      </span>
    </div>
  );
};

export default StreakBanner;
