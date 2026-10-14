"use client";

import { motion } from "motion/react";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { COINS, TOP_COINS, type CoinId } from "@/lib/data";
import { CoinIcon } from "./coin-icon";
import { Reveal } from "./reveal";

const BARS = 48;

export function StatCards({ onSelect }: { onSelect: (id: CoinId) => void }) {
  return (
    <section id="overview" aria-labelledby="overview-h" className="grid scroll-mt-3 grid-cols-4 gap-3 max-xl:grid-cols-2 max-sm:grid-cols-1">
      <h2 id="overview-h" className="sr-only">Market overview</h2>
      {TOP_COINS.map((id, i) => {
        const c = COINS[id];
        const filled = Math.round(BARS * c.fill);
        return (
          <Reveal key={id} i={i}>
            <article className="rounded-[20px] border border-line bg-surface p-2 pb-2.5">
              <div className="flex h-[26px] items-center justify-between pr-0.5">
                <div className="flex items-center gap-2">
                  <CoinIcon id={id} size={26} />
                  <h3 className="text-[14px] font-medium tracking-[-0.045em]">
                    {c.name} <span className="text-mute">({id})</span>
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => onSelect(id)}
                  aria-label={`Trade ${c.name}`}
                  className="press grid size-7 place-items-center rounded-lg text-mute hover:bg-ink/[0.06] hover:text-ink"
                >
                  <Icon icon={ArrowUpRight01Icon} className="size-4" />
                </button>
              </div>
              <div className="mt-2.5 rounded-[12px] border border-line bg-panel px-3 pb-1.5 pt-[11px]">
                <p className="text-[24px] font-semibold leading-[26px] tracking-[-0.065em]">{c.price}</p>
                <p className="mt-2 text-[12.5px] leading-4 tracking-[-0.035em] text-mute">
                  <span className="font-medium text-ink">+{c.change.toFixed(2)}%</span> vs last month
                </p>
                <div className="mt-[13px] flex h-[28px] gap-[2px]" aria-hidden>
                  {Array.from({ length: BARS }, (_, b) => (
                    <motion.span
                      key={b}
                      initial={{ opacity: 0, scaleY: 0.5 }}
                      animate={{ opacity: 1, scaleY: 1 }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1], delay: 0.15 + b * 0.006 }}
                      style={{ backgroundColor: b < filled ? c.color : "var(--bar-off)", originY: 1 }}
                      className="flex-1 rounded-[1.5px]"
                    />
                  ))}
                </div>
              </div>
            </article>
          </Reveal>
        );
      })}
    </section>
  );
}
