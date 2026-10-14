"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Cancel01Icon, Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import type { CoinId, Mode } from "@/lib/data";
import { BnbIcon, CoinIcon } from "./coin-icon";

export type OrderToastData = {
  mode: Mode;
  verb: string;
  coin: CoinId;
  amount: string; // coin amount, formatted
  total: string; // counter amount, formatted
  target: string; // counter asset / currency
  rate: string;
  wallet: string;
  mask: string;
  orderId: string;
  time: string;
};

export function showOrderToast(d: OrderToastData) {
  toast.custom((id) => <OrderToast id={id} d={d} />, { duration: 9000 });
}

function Row({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <dt className="text-mute">{k}</dt>
      <dd className="flex min-w-0 items-center gap-1.5 text-right font-medium text-ink">{children}</dd>
    </div>
  );
}

function OrderToast({ id, d }: { id: string | number; d: OrderToastData }) {
  const [copied, setCopied] = useState(false);
  const heroLabel = d.mode === "buy" ? "You paid" : "You received";
  const heroSub =
    d.mode === "buy" ? `for ${d.amount} ${d.coin}` : d.mode === "sell" ? `for ${d.amount} ${d.coin}` : `for ${d.amount} ${d.coin}`;

  return (
    <div
      role="status"
      className="w-[min(364px,calc(100vw-2rem))] overflow-hidden rounded-[18px] border border-line bg-popover text-popover-foreground shadow-[0_18px_40px_-14px_rgb(0_0_0/0.28),0_2px_6px_rgb(0_0_0/0.06)]"
    >
      <div className="flex items-start gap-3 px-4 pb-3 pt-4">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#16A34A]/12 text-[#16A34A] dark:bg-[#22C55E]/15 dark:text-[#4ADE80]">
          <Icon icon={Tick02Icon} strokeWidth={2.2} className="size-[18px]" />
        </span>
        <div className="min-w-0 flex-1 pt-px">
          <p className="text-[14px] font-semibold leading-5 tracking-[-0.045em]">
            {d.verb} {d.amount} {d.coin}
          </p>
          <p className="mt-0.5 text-[12px] leading-4 tracking-[-0.02em] text-mute">Order confirmed · {d.time}</p>
        </div>
        <button
          type="button"
          onClick={() => toast.dismiss(id)}
          aria-label="Dismiss"
          className="press -mr-1.5 -mt-1 grid size-7 place-items-center rounded-lg text-mute hover:bg-surface2 hover:text-ink"
        >
          <Icon icon={Cancel01Icon} className="size-4" />
        </button>
      </div>

      <div className="mx-4 flex items-center justify-between gap-3 rounded-[12px] bg-surface px-3.5 py-3">
        <div className="min-w-0">
          <p className="text-[11.5px] leading-4 tracking-[-0.02em] text-mute">{heroLabel}</p>
          <p className="mt-0.5 truncate text-[22px] font-semibold leading-7 tracking-[-0.06em] tabular-nums">
            {d.total} <span className="text-[13px] font-medium tracking-[-0.03em] text-mute">{d.target}</span>
          </p>
          <p className="text-[11.5px] leading-4 tracking-[-0.02em] text-mute">{heroSub}</p>
        </div>
        <CoinIcon id={d.coin} size={36} circle />
      </div>

      <dl className="space-y-2.5 px-4 py-3.5 text-[12.5px] leading-4 tracking-[-0.03em]">
        <Row k="Status">
          <span className="size-1.5 rounded-full bg-[#16A34A] dark:bg-[#4ADE80]" />
          Completed
        </Row>
        <Row k="Rate">{d.rate}</Row>
        <Row k="Wallet">
          <BnbIcon size={16} />
          <span className="truncate">{d.wallet}</span>
          <span className="whitespace-nowrap text-mute">{d.mask}</span>
        </Row>
      </dl>

      <div className="flex items-center justify-between border-t border-line bg-surface/70 px-4 py-2.5">
        <p className="text-[12px] leading-4 tracking-[-0.02em] text-mute">
          Order ID <span className="ml-1.5 font-medium tabular-nums text-ink">#{d.orderId}</span>
        </p>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(d.orderId);
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            } catch {
              /* clipboard unavailable */
            }
          }}
          className="press inline-flex h-7 items-center gap-1.5 rounded-lg px-2 text-[12px] font-medium tracking-[-0.03em] text-[#0369D8] hover:bg-[#0582FB]/10 dark:text-[#4DA3FF]"
        >
          <Icon icon={copied ? Tick02Icon : Copy01Icon} className="size-3.5" />
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}
