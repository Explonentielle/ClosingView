const dailyHistory = [
  { date: "31 mars 2026", r1: "3/4", r2: "1/2", closes: 1, cash: 300, taux: 33, badge: "good" },
  { date: "28 mars 2026", r1: "4/4", r2: "2/2", closes: 2, cash: 1800, taux: 50, badge: "good" },
  { date: "27 mars 2026", r1: "2/5", r2: "1/3", closes: 0, cash: 0, taux: 0, badge: "bad" },
  { date: "26 mars 2026", r1: "3/3", r2: "2/2", closes: 1, cash: 900, taux: 33, badge: "good" },
  { date: "25 mars 2026", r1: "1/4", r2: "0/1", closes: 0, cash: 0, taux: 0, badge: "bad" },
  { date: "24 mars 2026", r1: "5/5", r2: "3/3", closes: 2, cash: 1500, taux: 40, badge: "good" },
];

const KpiDailyHistoryTab = () => {
  return (
    <div className="space-y-3">
      <div className="rounded-xl p-5 bg-card border border-border/50">
        <h3 className="text-base font-semibold text-foreground">Historique KPI Daily</h3>
        <p className="text-[13px] text-muted-foreground mt-0.5">
          Utilise le bouton KPI Daily sur le Dashboard pour ajouter ta journée
        </p>

        <div className="space-y-2 mt-4">
          {dailyHistory.map((day) => (
            <div
              key={day.date}
              className="flex items-center justify-between gap-4 rounded-[10px] p-3.5 bg-background flex-wrap"
            >
              {/* Date */}
              <span className="text-xs text-muted-foreground min-w-[110px]">{day.date}</span>

              {/* Stats */}
              <div className="flex gap-4 flex-wrap">
                {[
                  { label: "R1", value: day.r1 },
                  { label: "R2", value: day.r2 },
                  { label: "Closes", value: day.closes },
                  { label: "Cash", value: `${day.cash.toLocaleString()}€` },
                  { label: "Taux", value: `${day.taux}%` },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-[10px] text-muted-foreground">{s.label}</div>
                    <div className="text-sm font-semibold text-foreground">{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Badge */}
              <span
                className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                  day.badge === "good"
                    ? "bg-primary/15 text-primary"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {day.badge === "good" ? "Bonne journée" : "Replanifier"}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KpiDailyHistoryTab;
