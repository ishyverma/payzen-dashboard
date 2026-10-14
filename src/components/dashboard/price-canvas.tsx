/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { EvilLineChart } from "@/components/evilcharts/charts/recharts-line-chart";
import { EvilBarChart } from "@/components/evilcharts/charts/recharts-bar-chart";
import type { ChartConfig } from "@/components/evilcharts/ui/recharts-chart";

const BLUE = "#0582FB";
const config = { v: { label: "BTC", color: BLUE, colors: { light: [BLUE], dark: [BLUE] } } } as unknown as ChartConfig;

const Y_W = 36;
const X_H = 30;
const TOP = 10;
const TICKS = Array.from({ length: 12 }, (_, i) => 2 * i + 1);
const TICKS_NARROW = [3, 7, 11, 15, 19, 23];
const vLines = ({ offset }: any) => Array.from({ length: 13 }, (_, i) => offset.left + (i * offset.width) / 12);

export function LineCanvas({
  data,
  narrow,
  grid,
  tick,
  renderTick,
}: {
  data: { k: number; v: number }[];
  narrow: boolean;
  grid: string;
  tick: string;
  renderTick: (p: any) => React.ReactElement;
}) {
  return (
    <EvilLineChart
      data={data}
      config={config}
      curveType="linear"
      className="aspect-auto h-full w-full"
      chartProps={{ margin: { top: TOP, right: 2, bottom: 0, left: 0 } }}
    >
      <EvilLineChart.Grid horizontal vertical strokeDasharray="0" stroke={grid} {...({ verticalCoordinatesGenerator: vLines } as object)} />
      <EvilLineChart.XAxis dataKey="k" ticks={narrow ? TICKS_NARROW : TICKS} interval={0} padding={{ left: 0, right: 0 }} height={X_H} tickLine={false} axisLine={false} tick={renderTick} />
      <EvilLineChart.YAxis domain={[0, 250]} ticks={[0, 50, 100, 150, 200, 250]} width={Y_W} tickMargin={14} tickLine={false} axisLine={false} tick={{ fontSize: 11.5, fill: tick }} />
      <EvilLineChart.Line dataKey="v" strokeWidth={1.7} glowing animationType="left-to-right" />
    </EvilLineChart>
  );
}

export function BarCanvas({
  data,
  narrow,
  grid,
  tick,
}: {
  data: { label: string; v: number }[];
  narrow: boolean;
  grid: string;
  tick: string;
}) {
  const t = { fontSize: 11.5, fill: tick };
  return (
    <EvilBarChart
      data={data}
      config={config}
      className="aspect-auto h-full w-full"
      chartProps={{ margin: { top: TOP, right: 2, bottom: 0, left: 0 } }}
    >
      <EvilBarChart.Grid vertical={false} strokeDasharray="0" stroke={grid} />
      <EvilBarChart.XAxis dataKey="label" interval={narrow ? 1 : 0} height={X_H} tickLine={false} axisLine={false} tick={t} />
      <EvilBarChart.YAxis domain={[0, 250]} ticks={[0, 50, 100, 150, 200, 250]} width={Y_W} tickMargin={14} tickLine={false} axisLine={false} tick={t} />
      <EvilBarChart.Tooltip />
      <EvilBarChart.Bar dataKey="v" />
    </EvilBarChart>
  );
}
