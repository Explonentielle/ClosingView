import type { ChartLabel } from "@/components/dashboard/InteractiveChart";

/**
 * Picks up to `maxLabels` evenly-spaced x-axis ticks from a full list of
 * already-formatted bucket labels, each pinned to the data-array index it
 * actually represents.
 */
export function pickChartLabels(labels: string[], maxLabels = 6): ChartLabel[] {
  if (labels.length === 0) return [];

  const count = Math.min(maxLabels, labels.length);
  const result: ChartLabel[] = [];

  for (let i = 0; i < count; i++) {
    const index = count === 1 ? 0 : Math.round((i * (labels.length - 1)) / (count - 1));
    result.push({ index, text: labels[index] });
  }

  return result.filter((l, i) => i === 0 || l.index !== result[i - 1].index);
}
