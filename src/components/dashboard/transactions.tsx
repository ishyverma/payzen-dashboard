"use client";

import { useMemo, useState } from "react";
import { ArrowDown01Icon, ChartHistogramIcon, Search01Icon, UnfoldMoreIcon } from "@hugeicons/core-free-icons";
import { EvilLineChart } from "@/components/evilcharts/charts/recharts-line-chart";
import type { ChartConfig } from "@/components/evilcharts/ui/recharts-chart";
import { Checkbox } from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ASSETS, compactB, money, sparkline, type Range } from "@/lib/data";
import { useMounted } from "@/lib/use-media";
import { cn } from "@/lib/utils";
import { CoinIcon } from "./coin-icon";
import { Segmented } from "./segmented";

type SortKey = "c24" | "c7" | "vol" | "cap";
type Sort = { key: SortKey; dir: "asc" | "desc" } | null;
type Period = "24H" | "7D" | "30D";
const PERIOD_F: Record<Period, number> = { "24H": 1, "7D": 6.4, "30D": 27 };
const COLS = "grid grid-cols-[52px_175px_152px_150px_171px_153px_157px_minmax(90px,1fr)] items-center";
const RANGES = (["1D", "7D", "1M", "1Y"] as Range[]).map((r) => ({ value: r, label: r, aria: `Range ${r}` }));
const RANGE_LABEL: Record<Range, string> = { "1D": "24h", "7D": "7d", "1M": "1m", "1Y": "1y" };
const GREEN = "#16A34A";
const RED = "#E5484D";
const CHECK = "size-[17px] rounded-[5px] border-line2 bg-panel";

function Spark({ id, range, up }: { id: string; range: Range; up: boolean }) {
  const mounted = useMounted();
  const data = useMemo(() => sparkline(id, range, up), [id, range, up]);
  const config = useMemo(() => {
    const c = up ? GREEN : RED;
    return { v: { label: id, color: c, colors: { light: [c], dark: [c] } } } as unknown as ChartConfig;
  }, [id, up]);
  return (
    <div
      className="h-[32px] w-[120px] overflow-hidden"
      role="img"
      aria-label={`${id} ${up ? "up" : "down"} over ${RANGE_LABEL[range]}`}
    >
      {!mounted ? (
        <div className="size-full animate-pulse rounded bg-surface2" />
      ) : (
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
      )}
    </div>
  );
}

function Pill({ v }: { v: number }) {
  const up = v >= 0;
  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1 rounded-[7px] border px-2 text-[12px] font-medium tabular-nums tracking-[-0.035em]",
        up
          ? "border-[#16A34A]/25 bg-[#16A34A]/10 text-[#15803D] dark:text-[#4ADE80]"
          : "border-[#E5484D]/25 bg-[#E5484D]/10 text-[#C62A2F] dark:text-[#FF7A7F]",
      )}
    >
      <svg width="7" height="6" viewBox="0 0 8 7" aria-hidden className={up ? "" : "rotate-180"}>
        <path d="M4 0l4 7H0z" fill="currentColor" />
      </svg>
      <span className="sr-only">{up ? "Up" : "Down"}</span>
      {Math.abs(v).toFixed(1)}%
    </span>
  );
}

function Th({ k, sort, onSort, children }: { k?: SortKey; sort: Sort; onSort: (k: SortKey) => void; children: React.ReactNode }) {
  const dir = k && sort?.key === k ? (sort.dir === "asc" ? "ascending" : "descending") : "none";
  return (
    <div role="columnheader" aria-sort={k ? dir : undefined}>
      {k ? (
        <button type="button" onClick={() => onSort(k)} className="press inline-flex items-center gap-1 text-left hover:text-ink">
          {children}
          <Icon icon={UnfoldMoreIcon} className={cn("size-3.5", dir !== "none" ? "text-brand" : "text-mute")} />
        </button>
      ) : (
        <span>{children}</span>
      )}
    </div>
  );
}

export function Transactions() {
  const [q, setQ] = useState("");
  const [range, setRange] = useState<Range>("1Y");
  const [period, setPeriod] = useState<Period>("24H");
  const [sort, setSort] = useState<Sort>(null);
  const [sel, setSel] = useState<Set<string>>(new Set());
  const f = PERIOD_F[period];

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    const r = ASSETS.filter((a) => (a.name + a.id).toLowerCase().includes(t));
    if (!sort) return r;
    return [...r].sort((a, b) => (sort.dir === "asc" ? a[sort.key] - b[sort.key] : b[sort.key] - a[sort.key]));
  }, [q, sort]);

  const allOn = rows.length > 0 && rows.every((r) => sel.has(r.id));
  const someOn = rows.some((r) => sel.has(r.id));
  const onSort = (key: SortKey) => setSort((s) => (s?.key !== key ? { key, dir: "desc" } : s.dir === "desc" ? { key, dir: "asc" } : null));

  return (
    <section id="transactions" aria-labelledby="tx-h" className="min-w-0 scroll-mt-3 rounded-[20px] border bg-panel p-[15px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-[10px] bg-gradient-to-b from-[#3D9BFF] to-[#0582FB] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.3)]">
            <Icon icon={ChartHistogramIcon} className="size-[18px]" />
          </span>
          <div>
            <h2 id="tx-h" className="text-[15.5px] font-medium leading-5 tracking-[-0.055em]">Recent transactions</h2>
            <p className="text-[12px] leading-4 tracking-[-0.03em] text-mute" aria-live="polite">
              {sel.size ? `${sel.size} selected` : "Keep track of all transactions here"}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 max-sm:w-full">
          <label className="flex h-[34px] w-[200px] items-center gap-2 rounded-[10px] border border-line2 bg-surface pl-2.5 text-mute transition-[border-color,background-color] focus-within:border-brand/60 focus-within:bg-panel max-sm:w-full">
            <Icon icon={Search01Icon} className="size-4" />
            <span className="sr-only">Search assets</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search"
              className="min-w-0 flex-1 bg-transparent text-[13px] tracking-[-0.03em] text-ink outline-none [&::-webkit-search-cancel-button]:hidden placeholder:text-mute"
            />
          </label>
          <Segmented label="Trend range" bordered value={range} onChange={setRange} options={RANGES} />
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label={`Volume period: ${period}`}
                  className="press inline-flex h-[34px] items-center gap-1.5 rounded-[10px] bg-[#F4F4F5] px-3 text-[13px] font-medium tracking-[-0.03em] text-[#0E0E10] hover:bg-[#EBEBED] dark:bg-surface2 dark:text-ink dark:hover:bg-line2"
                />
              }
            >
              {period}
              <Icon icon={ArrowDown01Icon} className="size-3.5 text-[#6E6E76] dark:text-mute" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[110px] rounded-[12px] bg-[#F4F4F5] p-1 dark:bg-popover">
              {(Object.keys(PERIOD_F) as Period[]).map((p) => (
                <DropdownMenuItem
                  key={p}
                  onClick={() => setPeriod(p)}
                  className="text-[13px] focus:bg-white data-[highlighted]:bg-white dark:focus:bg-accent dark:data-[highlighted]:bg-accent"
                >
                  {p}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="mt-[15px] overflow-x-auto" role="region" aria-label="Assets table, scrollable" tabIndex={0}>
        <div role="table" aria-label="Recent transactions" className="min-w-[1000px]">
          <div role="rowgroup">
            <div role="row" className={cn(COLS, "h-9 rounded-[10px] bg-surface text-[12px] font-medium tracking-[-0.03em] text-mute")}>
              <div role="columnheader" className="pl-[17px]">
                <Checkbox
                  aria-label="Select all assets"
                  checked={allOn}
                  indeterminate={someOn && !allOn}
                  onCheckedChange={(c) => setSel(c ? new Set(rows.map((r) => r.id)) : new Set())}
                  className={CHECK}
                />
              </div>
              <Th sort={sort} onSort={onSort}>Assets</Th>
              <Th sort={sort} onSort={onSort}>Price</Th>
              <Th k="c24" sort={sort} onSort={onSort}>24h Change</Th>
              <Th k="c7" sort={sort} onSort={onSort}>7d Change</Th>
              <Th sort={sort} onSort={onSort}>{RANGE_LABEL[range]} Trend</Th>
              <Th k="vol" sort={sort} onSort={onSort}>Volume ({period.toLowerCase()})</Th>
              <Th k="cap" sort={sort} onSort={onSort}>Market Cap</Th>
            </div>
          </div>

          <div role="rowgroup">
            {rows.length === 0 && <p className="py-10 text-center text-[13px] text-mute">No assets match “{q}”.</p>}
            {rows.map((a) => {
              const on = sel.has(a.id);
              return (
                <div
                  key={a.id}
                  role="row"
                  aria-selected={on}
                  className={cn(COLS, "h-[52px] border-b border-line text-[13px] tracking-[-0.035em] transition-colors duration-150 last:border-0 hover:bg-surface", on && "bg-brand/[0.07] hover:bg-brand/[0.07]")}
                >
                  <div role="cell" className="pl-[17px]">
                    <Checkbox
                      aria-label={`Select ${a.name}`}
                      checked={on}
                      onCheckedChange={(c) =>
                        setSel((s) => {
                          const x = new Set(s);
                          if (c) x.add(a.id);
                          else x.delete(a.id);
                          return x;
                        })
                      }
                      className={CHECK}
                    />
                  </div>
                  <div role="cell" className="flex items-center gap-2.5">
                    <CoinIcon id={a.id} size={36} className="outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10" />
                    <span>
                      <span className="block text-[13px] font-medium leading-4 tracking-[-0.04em]">{a.name}</span>
                      <span className="block text-[11.5px] leading-4 text-mute">{a.id}</span>
                    </span>
                  </div>
                  <div role="cell" className="font-medium tabular-nums">{money(a.price)}</div>
                  <div role="cell"><Pill v={a.c24} /></div>
                  <div role="cell"><Pill v={a.c7} /></div>
                  <div role="cell"><Spark id={a.id} range={range} up={a.ch[range] >= 0} /></div>
                  <div role="cell" className="font-medium tabular-nums">{compactB(a.vol * f)}</div>
                  <div role="cell" className="font-medium tabular-nums">{compactB(a.cap)}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
