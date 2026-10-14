"use client";

import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { ArrowDown01Icon, Exchange01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { COINS, FX, type CoinId, type Currency, type Mode } from "@/lib/data";
import { cn } from "@/lib/utils";
import { BnbIcon, CoinIcon, Flag } from "./coin-icon";
import { HoldButton } from "./hold-button";
import { showOrderToast } from "./order-toast";
import { Segmented } from "./segmented";

const NB = "\u00A0";
const WALLETS = [
  { id: "crypto", name: "Crypto Wallet", mask: `****${NB}3433` },
  { id: "metamask", name: "MetaMask", mask: `****${NB}9120` },
  { id: "ledger", name: "Ledger Nano", mask: `****${NB}0042` },
];
const COPY: Record<Mode, { top: string; bottom: string; cta: string; verb: string; hint: string }> = {
  buy: { top: "I’m Buying", bottom: "I’m Spending", cta: "Place Order", verb: "Bought", hint: "Press and hold to place your order" },
  sell: { top: "I’m Selling", bottom: "I’m Receiving", cta: "Place Order", verb: "Sold", hint: "Press and hold to place your order" },
  swap: { top: "I’m Swapping", bottom: "I’m Receiving", cta: "Confirm Swap", verb: "Swapped", hint: "Press and hold to confirm the swap" },
};

const num = (s: string) => parseFloat(s.replace(/,/g, "")) || 0;
const clean = (s: string) => {
  const t = s.replace(/[^0-9.]/g, "");
  const [a, ...b] = t.split(".");
  return b.length ? `${a}.${b.join("")}` : a;
};
const raw = (n: number, dp: number) => (n > 0 && isFinite(n) ? String(+n.toFixed(dp)) : "");
const show = (s: string) => {
  if (!s) return "";
  const [i, d] = s.split(".");
  return Number(i || 0).toLocaleString("en-US") + (d !== undefined ? `.${d}` : "");
};

type Props = { coin: CoinId; setCoin: (c: CoinId) => void; mode: Mode; setMode: (m: Mode) => void };

export function TradePanel({ coin, setCoin, mode, setMode }: Props) {
  const idTop = useId();
  const idBottom = useId();
  const [cur, setCur] = useState<Currency>("USD");
  const [swapTo, setSwapTo] = useState<CoinId>("ETH");
  const [top, setTop] = useState("4.60");
  const [bottom, setBottom] = useState("532680");
  const [wallet, setWallet] = useState(WALLETS[0]);

  const target = mode === "swap" ? swapTo : cur;
  const factor = mode === "swap" ? COINS[coin].rate / COINS[swapTo].rate : COINS[coin].rate * FX[cur];
  const dp = mode === "swap" ? 6 : 2;
  const copy = COPY[mode];

  useEffect(() => {
    if (mode === "swap" && swapTo === coin) setSwapTo(coin === "ETH" ? "BTC" : "ETH");
  }, [coin, mode, swapTo]);

  useEffect(() => {
    setBottom(raw(num(top) * factor, dp));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [factor, dp]);

  const confirm = () => {
    const rate =
      mode === "swap"
        ? `1 ${coin} = ${(COINS[coin].rate / COINS[swapTo].rate).toFixed(4)} ${swapTo}`
        : `1 ${coin} = ${(COINS[coin].rate * FX[cur]).toLocaleString("en-US", { maximumFractionDigits: 2 })} ${cur}`;
    showOrderToast({
      mode,
      verb: copy.verb,
      coin,
      amount: show(top),
      total: show(bottom),
      target,
      rate,
      wallet: wallet.name,
      mask: wallet.mask,
      orderId: `PZ-${Math.floor(100000 + Math.random() * 900000)}`,
      time: new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }),
    });
  };

  return (
    <section id="trade-panel" aria-labelledby="trade-h" className="scroll-mt-3 rounded-[20px] border bg-panel p-[15px]">
      <div className="flex items-center gap-2.5">
        <span className="grid size-[30px] place-items-center rounded-[9px] bg-surface2 text-soft">
          <Icon icon={Exchange01Icon} className="size-[18px]" />
        </span>
        <h2 id="trade-h" className="text-[15.5px] font-medium tracking-[-0.055em]">Crypto Trading</h2>
      </div>

      <Segmented
        label="Order type"
        value={mode}
        onChange={setMode}
        className="mt-[15px] flex h-[42px] w-full rounded-[12px] p-1"
        itemClassName="h-full flex-1 rounded-[9px] text-[13px] [&>span]:rounded-[9px]"
        options={[
          { value: "buy", label: "BUY", aria: "Buy" },
          { value: "sell", label: "SELL", aria: "Sell" },
          { value: "swap", label: "Swap", aria: "Swap" },
        ]}
      />

      <div className="mt-[15px] rounded-[16px] bg-surface p-3">
        <Label htmlFor={idTop}>{copy.top}</Label>
        <Field
          id={idTop}
          value={top}
          onChange={(v) => {
            const c = clean(v);
            setTop(c);
            setBottom(raw(num(c) * factor, dp));
          }}
          picker={
            <Picker
              label="Select coin"
              trigger={<><CoinIcon id={coin} size={17} circle />{coin}</>}
              items={(Object.keys(COINS) as CoinId[]).map((id) => ({ key: id, icon: <CoinIcon id={id} size={20} circle />, text: COINS[id].name, on: () => setCoin(id), sel: id === coin }))}
            />
          }
        />

        <Label htmlFor={idBottom} className="mt-3.5">{copy.bottom}</Label>
        <Field
          id={idBottom}
          value={show(bottom)}
          onChange={(v) => {
            const c = clean(v.replace(/,/g, ""));
            setBottom(c);
            setTop(raw(num(c) / factor, 6));
          }}
          picker={
            mode === "swap" ? (
              <Picker
                label="Receive coin"
                trigger={<><CoinIcon id={swapTo} size={17} circle />{swapTo}</>}
                items={(Object.keys(COINS) as CoinId[]).filter((id) => id !== coin).map((id) => ({ key: id, icon: <CoinIcon id={id} size={20} circle />, text: COINS[id].name, on: () => setSwapTo(id), sel: id === swapTo }))}
              />
            ) : (
              <Picker
                label="Select currency"
                trigger={<><Flag id={cur} size={17} />{cur}</>}
                items={(Object.keys(FX) as Currency[]).map((c) => ({ key: c, icon: <Flag id={c} size={20} />, text: c, on: () => setCur(c), sel: c === cur }))}
              />
            )
          }
        />

        <p className="mb-2 mt-3.5 text-[13px] font-medium leading-[18px] tracking-[-0.035em]">Pay with</p>
        <div className="flex h-[48px] items-center gap-2.5 rounded-[12px] border border-line bg-panel pl-[7px] pr-2.5">
          <BnbIcon size={32} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium leading-4 tracking-[-0.04em]">{wallet.name}</p>
            <p className="whitespace-nowrap text-[11.5px] leading-4 tracking-[-0.025em] text-mute">{wallet.mask}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<button type="button" aria-label="Change wallet" className="press h-[26px] rounded-[8px] bg-surface2 px-2.5 text-[12px] font-medium tracking-[-0.03em] hover:bg-line" />}
            >
              Change
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-max min-w-[260px] rounded-[12px]">
              {WALLETS.map((w) => (
                <DropdownMenuItem key={w.id} onClick={() => setWallet(w)} className="gap-6 whitespace-nowrap py-2 text-[13px]">
                  <span className="font-medium">{w.name}</span>
                  <span className="ml-auto flex items-center gap-2 tabular-nums text-muted-foreground">
                    {w.mask}
                    <Icon icon={Tick02Icon} className={cn("size-4 text-brand", w.id !== wallet.id && "opacity-0")} />
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <HoldButton label={copy.cta} hint={copy.hint} invalid={num(top) <= 0} onInvalid={() => toast.error("Enter an amount to continue")} onConfirm={confirm} />
      </div>
    </section>
  );
}

function Label({ children, className, htmlFor }: { children: React.ReactNode; className?: string; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className={cn("mb-2 block text-[13px] font-medium leading-[18px] tracking-[-0.035em]", className)}>
      {children}
    </label>
  );
}

function Field({ id, value, onChange, picker }: { id: string; value: string; onChange: (v: string) => void; picker: React.ReactNode }) {
  return (
    <div className="flex h-[38px] items-center rounded-[10px] border border-line bg-panel pl-[13px] pr-1.5 transition-[border-color,box-shadow] duration-150 focus-within:border-brand/60 focus-within:shadow-[0_0_0_3px_rgb(5_130_251/0.14)]">
      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        inputMode="decimal"
        autoComplete="off"
        placeholder="0"
        className="min-w-0 flex-1 bg-transparent text-[14px] font-medium tracking-[-0.035em] outline-none placeholder:text-mute/60"
      />
      {picker}
    </div>
  );
}

function Picker({ trigger, label, items }: { trigger: React.ReactNode; label: string; items: { key: string; icon: React.ReactNode; text: string; on: () => void; sel: boolean }[] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<button type="button" aria-label={label} className="press flex h-7 items-center gap-1.5 rounded-lg px-1.5 text-[12.5px] tracking-[-0.03em] text-mute hover:bg-surface2" />}
      >
        {trigger}
        <Icon icon={ArrowDown01Icon} className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-max min-w-[180px] rounded-[12px]">
        {items.map((i) => (
          <DropdownMenuItem key={i.key} onClick={i.on} className="gap-2.5 whitespace-nowrap text-[13px]">
            {i.icon}
            {i.text}
            <Icon icon={Tick02Icon} className={cn("ml-auto size-4 text-brand", !i.sel && "opacity-0")} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
