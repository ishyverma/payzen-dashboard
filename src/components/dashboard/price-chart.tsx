/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { BarChartIcon, ChartLineData02Icon, TradeDownIcon, TradeUpIcon } from "@hugeicons/core-free-icons";
import { EvilLineChart } from "@/components/evilcharts/charts/recharts-line-chart";
import { EvilBarChart } from "@/components/evilcharts/charts/recharts-bar-chart";
import type { ChartConfig } from "@/components/evilcharts/ui/recharts-chart";
import { Icon } from "@/components/ui/icon";
import { PRICE_PER_UNIT, SERIES, SUMMARY, money, tickLabel, titleLabel, type Range } from "@/lib/data";
import { useMedia, useMounted } from "@/lib/use-media";
import { cn } from "@/lib/utils";
import { CoinIcon } from "./coin-icon";
import { Segmented } from "./segmented";

const BLUE = "#0582FB";
const config = { v: { label: "BTC", color: BLUE, colors: { light: [BLUE], dark: [BLUE] } } } as unknown as ChartConfig;

const Y_W = 36;
const X_H = 30;
const TOP = 10;
const TICKS = Array.from({ length: 12 }, (_, i) => 2 * i + 1);
const TICKS_NARROW = [3, 7, 11, 15, 19, 23];
const RANGES = (["1D", "7D", "1M", "1Y"] as Range[]).map((r) => ({ value: r, label: r, aria: `Range ${r}` }));

const vLines = ({ offset }: any) => Array.from({ length: 13 }, (_, i) => offset.left + (i * offset.width) / 12);
const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

type Geo = { l: number; t: number; w: number; h: number };

export function PriceChart() {
  const [range, setRange] = useState<Range>("1Y");
  const [type, setType] = useState<"bar" | "line">("line");
  const [k, setK] = useState(11);
  const [active, setActive] = useState(false);
  const [geo, setGeo] = useState<Geo | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  const narrow = useMedia("(max-width: 639px)");
  const { resolvedTheme } = useTheme();

  // SVG attributes can't resolve CSS variables reliably, so colours come from JS
  const dark = mounted && resolvedTheme === "dark";
  const GRID = dark ? "#26262B" : "#EEEEF0";
  const TICK = dark ? "#8F8F98" : "#74747C";
  const ACTIVE = dark ? "#4DA3FF" : "#0369D8";
  const axisTick = { fontSize: 11.5, fill: TICK };

  const series = SERIES[range];
  const v = series[k];
  const s = SUMMARY[range];
  const up = s.pct >= 0;

  const data = useMemo(() => series.map((val, i) => ({ k: i, v: val })), [series]);
  const barData = useMemo(() => Array.from({ length: 12 }, (_, i) => ({ label: tickLabel(range, 2 * i + 1), v: series[2 * i + 1] })), [range, series]);

  const measure = () => {
    const el = box.current;
    if (!el) return null;
    const b = el.getBoundingClientRect();
    const r = el.querySelector(".recharts-cartesian-grid")?.getBoundingClientRect();
    const g: Geo =
      r && r.width > 10
        ? { l: r.left - b.left, t: r.top - b.top, w: r.width, h: r.height }
        : { l: Y_W, t: TOP, w: b.width - Y_W - 2, h: b.height - TOP - X_H };
    return { b, g };
  };
  const pointTo = (clientX: number) => {
    const m = measure();
    if (!m) return;
    setGeo(m.g);
    setK(clamp(Math.round(((clientX - m.b.left - m.g.l) / m.g.w) * 24), 0, 24));
    setActive(true);
  };
  const onKey = (e: React.KeyboardEvent) => {
    if (type !== "line") return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const m = measure();
      if (m) setGeo(m.g);
      setK((p) => clamp((active ? p : 11) + (e.key === "ArrowRight" ? 1 : -1), 0, 24));
      setActive(true);
    }
    if (e.key === "Escape") setActive(false);
  };

  const activeTick = active ? Math.round((k - 1) / 2) : -1;
  const renderTick = (p: any) => {
    const on = (p.payload.value - 1) / 2 === activeTick;
    return (
      <text
        x={p.x}
        y={p.y + 13}
        textAnchor="middle"
        fontSize={11.5}
        fontWeight={on ? 600 : 400}
        fill={on ? ACTIVE : TICK}
        style={{ transition: "fill 120ms ease-out" }}
      >
        {tickLabel(range, p.payload.value)}
      </text>
    );
  };

  const prev = series[Math.max(0, k - 1)];
  const sincePrev = ((v - prev) / prev) * 100;
  const sinceStart = ((v - series[0]) / series[0]) * 100;
  const sign = (n: number) => `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
  const lineX = geo ? geo.l + (k / 24) * geo.w : 0;
  const flip = geo ? geo.l + geo.w - lineX < 190 : false;
  const readout = `${titleLabel(range, k)}: ${Math.round(v * PRICE_PER_UNIT).toLocaleString("en-US")} BTC`;

  return (
    <section id="chart" aria-labelledby="chart-h" className="min-w-0 scroll-mt-3 overflow-hidden rounded-[20px] border bg-panel p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <CoinIcon id="BTC" size={30} />
          <h2 id="chart-h" className="text-[14px] font-medium tracking-[-0.045em]">
            Bitcoin <span className="text-mute">(BTC)</span>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Segmented
            label="Chart type"
            bordered
            value={type}
            onChange={setType}
            itemClassName="min-w-[30px] px-0"
            options={[
              { value: "bar", aria: "Bar chart", label: <Icon icon={BarChartIcon} className="size-4" /> },
              { value: "line", aria: "Line chart", label: <Icon icon={ChartLineData02Icon} className="size-4" /> },
            ]}
          />
          <Segmented
            label="Time range"
            value={range}
            onChange={(r) => {
              setRange(r);
              setActive(false);
            }}
            options={RANGES}
          />
        </div>
      </div>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-1">
        <p className="text-[30px] font-semibold leading-9 tracking-[-0.07em]">{money(s.price)}</p>
        <span
          className={cn(
            "inline-flex h-[22px] items-center gap-1 rounded-[7px] border px-1.5 text-[12px] font-medium tracking-[-0.035em]",
            up
              ? "border-[#16A34A]/25 bg-[#16A34A]/10 text-[#15803D] dark:text-[#4ADE80]"
              : "border-[#E5484D]/25 bg-[#E5484D]/10 text-[#C62A2F] dark:text-[#FF7A7F]",
          )}
        >
          <Icon icon={up ? TradeUpIcon : TradeDownIcon} className="size-3.5" />
          {up ? "+" : ""}
          {s.pct.toFixed(2)}%
        </span>
        <span className="text-[12px] tracking-[-0.03em] text-mute">
          {s.delta >= 0 ? "+" : "-"}${Math.abs(s.delta).toLocaleString("en-US", { minimumFractionDigits: 2 })} {s.label}
        </span>
      </div>

      {/* fixed-height box: the chart is a direct child, exactly as it was when it rendered */}
      <div
        ref={box}
        tabIndex={type === "line" ? 0 : -1}
        role="group"
        aria-roledescription="chart"
        aria-label={`Bitcoin price chart for ${range}. Use the left and right arrow keys to inspect values.`}
        onPointerMove={(e) => type === "line" && pointTo(e.clientX)}
        onPointerLeave={() => setActive(false)}
        onBlur={() => setActive(false)}
        onKeyDown={onKey}
        className="relative mt-3.5 h-[250px] w-full touch-pan-y select-none overflow-hidden rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring/40 sm:h-[290px]"
      >
        <p className="sr-only" aria-live="polite">{active ? readout : ""}</p>

        {!mounted ? (
          <div className="size-full animate-pulse rounded-lg bg-surface2" />
        ) : type === "line" ? (
          <EvilLineChart
            key={range}
            data={data}
            config={config}
            curveType="linear"
            className="aspect-auto h-full w-full"
            chartProps={{ margin: { top: TOP, right: 2, bottom: 0, left: 0 } }}
          >
            <EvilLineChart.Grid horizontal vertical strokeDasharray="0" stroke={GRID} {...({ verticalCoordinatesGenerator: vLines } as object)} />
            <EvilLineChart.XAxis dataKey="k" ticks={narrow ? TICKS_NARROW : TICKS} interval={0} padding={{ left: 0, right: 0 }} height={X_H} tickLine={false} axisLine={false} tick={renderTick} />
            <EvilLineChart.YAxis domain={[0, 250]} ticks={[0, 50, 100, 150, 200, 250]} width={Y_W} tickMargin={14} tickLine={false} axisLine={false} tick={axisTick} />
            <EvilLineChart.Line dataKey="v" strokeWidth={1.7} glowing animationType="left-to-right" />
          </EvilLineChart>
        ) : (
          <EvilBarChart
            key={range}
            data={barData}
            config={config}
            className="aspect-auto h-full w-full"
            chartProps={{ margin: { top: TOP, right: 2, bottom: 0, left: 0 } }}
          >
            <EvilBarChart.Grid vertical={false} strokeDasharray="0" stroke={GRID} />
            <EvilBarChart.XAxis dataKey="label" interval={narrow ? 1 : 0} height={X_H} tickLine={false} axisLine={false} tick={axisTick} />
            <EvilBarChart.YAxis domain={[0, 250]} ticks={[0, 50, 100, 150, 200, 250]} width={Y_W} tickMargin={14} tickLine={false} axisLine={false} tick={axisTick} />
            <EvilBarChart.Tooltip />
            <EvilBarChart.Bar dataKey="v" />
          </EvilBarChart>
        )}

        {/* hover overlay: only while hovering / arrow-keying */}
        {type === "line" && mounted && geo && (
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-150 ease-out" style={{ opacity: active ? 1 : 0 }}>
            <div className="absolute" style={{ left: lineX - 37, width: 75, top: geo.t, height: geo.h, transition: "left 90ms linear" }}>
              <div className="absolute inset-0 bg-gradient-to-b from-[#0582FB]/0 to-[#0582FB]/[0.16]" />
              <div className="absolute inset-0 [background-image:radial-gradient(rgb(5_130_251/0.5)_1px,transparent_1.2px)] [background-size:4px_4px] [mask-image:linear-gradient(to_bottom,transparent,black_75%)]" />
              <div className="absolute inset-x-0 bottom-0 h-[3px] bg-[#0582FB]" />
            </div>
            <div className="absolute w-px bg-[#0582FB]" style={{ left: lineX, top: geo.t, height: geo.h, transition: "left 90ms linear" }} />
            <div className="absolute size-0 border-x-[4px] border-t-[6px] border-x-transparent border-t-[#0582FB]" style={{ left: lineX - 4, top: geo.t - 4, transition: "left 90ms linear" }} />
            <div
              className="absolute size-3 rounded-full border-2 border-panel bg-[#0582FB] shadow-[0_0_0_1px_rgb(5_130_251/0.45),0_2px_6px_rgb(5_130_251/0.35)]"
              style={{ left: lineX - 6, top: geo.t + (1 - v / 250) * geo.h - 6, transition: "left 90ms linear, top 90ms linear" }}
            />
            <div
              className="absolute z-10 w-[160px] rounded-[10px] bg-tip px-3 py-2.5 text-white shadow-[0_8px_24px_rgb(0_0_0/0.2)] dark:ring-1 dark:ring-white/10"
              style={{ left: lineX, top: geo.t + 44, transform: flip ? "translateX(calc(-100% - 25px))" : "translateX(25px)", transition: "left 90ms linear" }}
            >
              <p className="text-[11px] leading-4 tracking-[-0.025em] text-[#A8A8B0]">{titleLabel(range, k)}</p>
              <p className="mt-1 flex items-baseline gap-3 text-[16px] font-semibold leading-5 tracking-[-0.055em]">
                {Math.round(v * PRICE_PER_UNIT).toLocaleString("en-US")}
                <span className="text-[13px] font-medium">BTC</span>
              </p>
              <p className="mt-2 flex items-center gap-3 text-[12px] leading-4 tracking-[-0.035em]">
                <span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-[#3B82F6]" />{sign(sincePrev)}</span>
                <span className="flex items-center gap-1.5"><i className="size-1.5 rounded-full bg-[#FACC15]" />{Math.abs(sinceStart).toFixed(2)}%</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
