"use client";

import { useMemo } from "react";
import { EvilLineChart } from "@/components/evilcharts/charts/recharts-line-chart";
import type { ChartConfig } from "@/components/evilcharts/ui/recharts-chart";
import { sparkline, type Range } from "@/lib/data";

const GREEN = "#16A34A";
const RED = "#E5484D";

export default function SparkChart({ id, range, up }: { id: string; range: Range; up: boolean }) {
  const data = useMemo(() => sparkline(id, range, up), [id, range, up]);
  const config = useMemo(() => {
    const c = up ? GREEN : RED;
    return { v: { label: id, color: c, colors: { light: [c], dark: [c] } } } as unknown as ChartConfig;
  }, [id, up]);
  return (
    <EvilLineChart
      key={`${id}-${range}`}
      data={data}
      config={config}
      curveType="linear"
      animationType="none"
      className="aspect-auto h-full w-full"
      chartProps={{ margin: { top: 3, right: 2, bottom: 3, left: 2 } }}
    >
      <EvilLineChart.XAxis dataKey="i" hide />
      <EvilLineChart.YAxis hide domain={["dataMin", "dataMax"]} />
      <EvilLineChart.Line dataKey="v" strokeWidth={1.4} />
    </EvilLineChart>
  );
}
