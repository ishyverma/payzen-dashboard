export type CoinId = "BTC" | "ETH" | "SOL" | "QNT" | "LTC";
export type Range = "1D" | "7D" | "1M" | "1Y";
export type Mode = "buy" | "sell" | "swap";

export type Coin = { id: CoinId; name: string; rate: number; price: string; change: number; fill: number; color: string };

export const COINS: Record<CoinId, Coin> = {
  BTC: { id: "BTC", name: "Bitcoin", rate: 115800, price: "$67,420.15", change: 12.8, fill: 0.6, color: "#F7931A" },
  ETH: { id: "ETH", name: "Ethereum", rate: 3482.9, price: "$3,482.90", change: 3.12, fill: 0.27, color: "#35A7F4" },
  SOL: { id: "SOL", name: "Solana", rate: 182.44, price: "$182.44", change: 5.86, fill: 0.39, color: "#7C4DFF" },
  QNT: { id: "QNT", name: "Quant", rate: 112.75, price: "$112.75", change: 1.68, fill: 0.48, color: "#F26B2A" },
  LTC: { id: "LTC", name: "Litecoin", rate: 96.4, price: "$96.40", change: 1.54, fill: 0.82, color: "#2F6DF6" },
};
export const TOP_COINS: CoinId[] = ["ETH", "SOL", "QNT", "LTC"];
export const FX = { USD: 1, EUR: 0.92, INR: 83.2 } as const;
export type Currency = keyof typeof FX;

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function walk(seed: number, n: number, min: number, max: number, drift = 0) {
  const r = rng(seed);
  let v = (min + max) / 2;
  return Array.from({ length: n }, () => {
    v += (r() - 0.5 + drift) * (max - min) * 0.28;
    v = Math.min(max, Math.max(min, v));
    return Math.round(v);
  });
}

export const SERIES: Record<Range, number[]> = {
  "1Y": [153, 202, 165, 121, 136, 105, 91, 121, 139, 121, 140, 162, 150, 140, 130, 125, 125, 121, 156, 139, 177, 161, 152, 146, 153],
  "1D": walk(11, 25, 110, 200),
  "7D": walk(23, 25, 90, 200, -0.03),
  "1M": walk(37, 25, 90, 220, 0.03),
};

export const SUMMARY: Record<Range, { price: number; pct: number; delta: number; label: string }> = {
  "1D": { price: 67420.15, pct: 1.42, delta: 947.71, label: "today" },
  "7D": { price: 67420.15, pct: -2.14, delta: -1473.6, label: "this week" },
  "1M": { price: 67420.15, pct: 7.12, delta: 4496.2, label: "this month" },
  "1Y": { price: 67420.15, pct: 12.8, delta: 7650.32, label: "this year" },
};

export const PRICE_PER_UNIT = 271.7;

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const END = Date.UTC(2026, 9, 13, 12);
const SPAN = { "1D": 1, "7D": 7, "1M": 30, "1Y": 365 } as const;
const clean = (s: string) => s.replace(/\u202f/g, " ");

function pointDate(range: Range, k: number) {
  const span = SPAN[range] * 86400000;
  return new Date(END - span + (k / 24) * span);
}
export function tickLabel(range: Range, k: number) {
  if (range === "1Y") return MONTHS[Math.min(11, Math.floor(k / 2))].slice(0, 3);
  const d = pointDate(range, k);
  const o = { timeZone: "UTC" } as const;
  if (range === "1D") return clean(d.toLocaleString("en-US", { ...o, hour: "numeric" }));
  if (range === "7D") return clean(d.toLocaleString("en-US", { ...o, weekday: "short", hour: "numeric" }));
  return d.toLocaleString("en-US", { ...o, month: "short", day: "numeric" });
}
export function titleLabel(range: Range, k: number) {
  if (range === "1Y") return `${MONTHS[Math.min(11, Math.floor(k / 2))]} 2026`;
  const d = pointDate(range, k);
  return clean(d.toLocaleString("en-US", { timeZone: "UTC", month: "short", day: "numeric", hour: "numeric" }));
}

/* ---------- Table ---------- */
export type Asset = {
  id: CoinId;
  name: string;
  price: number;
  c24: number;
  c7: number;
  vol: number;
  cap: number;
  ch: Record<Range, number>; // % change per range, drives sparkline colour
};
export const ASSETS: Asset[] = [
  { id: "BTC", name: "Bitcoin", price: 64280.5, c24: 3.1, c7: 10.2, vol: 18.7, cap: 4800, ch: { "1D": 3.1, "7D": 10.2, "1M": 14.5, "1Y": 112 } },
  { id: "ETH", name: "Ethereum", price: 4320.75, c24: -3.2, c7: -2.4, vol: 32.5, cap: 32500, ch: { "1D": -3.2, "7D": -2.4, "1M": -6.8, "1Y": 41 } },
  { id: "SOL", name: "Solana", price: 520.4, c24: 1.8, c7: 7.5, vol: 4.3, cap: 88.1, ch: { "1D": 1.8, "7D": 7.5, "1M": -4.2, "1Y": 88 } },
  { id: "QNT", name: "Quant", price: 520.4, c24: 3.2, c7: 3.2, vol: 4.3, cap: 88.1, ch: { "1D": 3.2, "7D": 3.2, "1M": 9.9, "1Y": -12 } },
  { id: "LTC", name: "Litecoin", price: 96.4, c24: 1.54, c7: 2.1, vol: 1.2, cap: 7.2, ch: { "1D": 1.54, "7D": 2.1, "1M": -3.3, "1Y": -21 } },
];

/** Jagged sparkline whose overall direction always matches `up`. */
export function sparkline(id: string, range: Range, up: boolean) {
  const n = 36;
  const seed = [...(id + range)].reduce((a, c) => (a * 31 + c.charCodeAt(0)) | 0, 7);
  const r = rng(seed);
  let v = 50;
  const pts = Array.from({ length: n }, () => (v += (r() - 0.5) * 20 + (up ? 1.2 : -1.2)));
  const delta = pts[n - 1] - pts[0];
  const want = up ? Math.max(14, delta) : Math.min(-14, delta);
  const fix = (want - delta) / (n - 1);
  return pts.map((p, i) => ({ i, v: Math.round((p + fix * i) * 10) / 10 }));
}

export const money = (n: number, d = 2) =>
  "$" + n.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
export const compactB = (b: number) => (b >= 1000 ? `$${(b / 1000).toFixed(1)}T` : `$${b.toFixed(1)}B`);
