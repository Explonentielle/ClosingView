export const C = {
  bg: "#0D1117",
  sidebar: "#0a0f1a",
  card: "#161d2e",
  border: "#2a3a50",
  green: "#0EFF9C",
  yellow: "#EFB027",
  red: "#F87171",
  blue: "#3B82F6",
  violet: "#9B7FE8",
  text: "#FFFFFF",
  muted: "#8892a0",
  soft: "#6b7a99",
};

export type Range = "7j" | "30j" | "3m" | "1a";

export const statsData: Record<Range, { cash: string; closes: number; taux: string; commissions: string; cashTrend: number; closingTrend: number }> = {
  "7j":  { cash: "2 100€",  closes: 2,  taux: "22%", commissions: "420€",    cashTrend:  8,  closingTrend: -2 },
  "30j": { cash: "9 800€",  closes: 7,  taux: "29%", commissions: "1 960€",  cashTrend: 12,  closingTrend: -1 },
  "3m":  { cash: "24 500€", closes: 19, taux: "31%", commissions: "4 900€",  cashTrend: 18,  closingTrend:  3 },
  "1a":  { cash: "87 200€", closes: 68, taux: "28%", commissions: "17 440€", cashTrend: 22,  closingTrend:  1 },
};

// 21 points Jan→Mai
export const closingRateData = [24,25,27,26,30,33,31,35,34,37,38,36,35,37,36,34,32,31,31,30,29];
export const commissionsData = [1100,1050,1200,1150,1700,2000,1900,2200,2500,2700,2900,2700,2500,2300,2400,2200,2000,1900,2000,1900,1960];

export const monthLabels = ["Jan", "Fév", "Mar", "Avr", "Mai"];

export const objectives = [
  { label: "15 000€ cash",  current: 9800, target: 15000, pct: 65, color: "green",  display: "9 800€ / 15 000€" },
  { label: "30% closing",   current: 29,   target: 30,    pct: 97, color: "yellow", display: "29% / 30%" },
  { label: "10 closes",     current: 7,    target: 10,    pct: 70, color: "blue",   display: "7/10" },
];

export const clients = [
  { id: 1, initials: "TC", name: "Thomas Coaching", color: "#0EFF9C", niche: "Développement perso", type: ["Challenge"], amount: 6200, offers: 3 },
  { id: 2, initials: "MB", name: "Maxime Business", color: "#EFB027", niche: "Business en ligne",   type: ["VSL"],       amount: 3600, offers: 1 },
];

export const closers = [
  { id: 1, init: "AL", name: "Alexandre L.", niche: "Business en ligne",   score: 82, color: "#0EFF9C", online: true  },
  { id: 2, init: "SC", name: "Sarah C.",     niche: "Développement perso", score: 79, color: "#EFB027", online: true  },
  { id: 3, init: "MR", name: "Marc R.",      niche: "Immobilier",          score: 75, color: "#9B7FE8", online: true  },
  { id: 4, init: "LD", name: "Lucas D.",     niche: "Trading / Finance",   score: 71, color: "#3B82F6", online: true  },
  { id: 5, init: "NB", name: "Nina B.",      niche: "Bien-être / Santé",   score: 70, color: "#F87171", online: true  },
  { id: 6, init: "KM", name: "Kevin M.",     niche: "Business en ligne",   score: 68, color: "#6b7a99", online: false },
];

export const mapClosers = [
  { cx: 204, cy: 68,  score: 82, color: "#0EFF9C" },
  { cx: 178, cy: 130, score: 74, color: "#0EFF9C" },
  { cx: 240, cy: 188, score: 61, color: "#EFB027" },
  { cx: 120, cy: 165, score: 79, color: "#0EFF9C" },
  { cx: 258, cy: 230, score: 44, color: "#3B82F6" },
];
