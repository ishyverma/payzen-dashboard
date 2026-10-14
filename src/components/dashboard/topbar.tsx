"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import { LinkSquare02Icon, Mail01Icon, Menu01Icon, Notification03Icon, SidebarLeftIcon } from "@hugeicons/core-free-icons";
import { Icon, type IconType } from "@/components/ui/icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

type Item = { id: number; title: string; body: string; time: string };
const NOTIFS: Item[] = [
  { id: 1, title: "BTC crossed $67,000", body: "Bitcoin is up 3.1% in the last 24 hours.", time: "2m" },
  { id: 2, title: "Order filled", body: "Your SOL buy order for 12.4 SOL was filled.", time: "1h" },
  { id: 3, title: "New login detected", body: "Chrome on macOS · Sonipat, IN.", time: "3h" },
];
const MESSAGES: Item[] = [
  { id: 1, title: "Support", body: "Your KYC verification is complete.", time: "10m" },
  { id: 2, title: "Payzen Team", body: "Welcome to Payzen! Here’s how to get started.", time: "1d" },
  { id: 3, title: "Billing", body: "Invoice #2043 is ready to download.", time: "2d" },
];

function Inbox({ icon, title, seed }: { icon: IconType; title: string; seed: Item[] }) {
  const [unread, setUnread] = useState(new Set(seed.map((s) => s.id)));
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            aria-label={unread.size ? `${title} (${unread.size} unread)` : title}
            className="press relative grid size-9 place-items-center rounded-[10px] border border-line2 bg-surface text-soft hover:bg-panel"
          />
        }
      >
        <Icon icon={icon} className="size-[18px]" />
        {unread.size > 0 && <span className="absolute right-[9px] top-[8px] size-[7px] rounded-full bg-[#EF4444] ring-2 ring-surface" />}
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(330px,calc(100vw-2rem))] rounded-[14px] p-0">
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-[14px] font-medium tracking-[-0.045em]">{title}</h2>
          <button
            type="button"
            disabled={unread.size === 0}
            onClick={() => setUnread(new Set())}
            className="press text-[12px] font-medium tracking-[-0.03em] text-[#0369D8] disabled:text-mute dark:text-[#4DA3FF]"
          >
            Mark all read
          </button>
        </div>
        <ul className="border-t">
          {seed.map((n) => (
            <li key={n.id}>
              <button
                type="button"
                onClick={() =>
                  setUnread((u) => {
                    const x = new Set(u);
                    x.delete(n.id);
                    return x;
                  })
                }
                className="flex w-full gap-3 border-b px-4 py-3 text-left last:border-0 hover:bg-surface"
              >
                <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", unread.has(n.id) ? "bg-brand" : "bg-transparent")} />
                <span className="min-w-0 flex-1">
                  <span className="flex justify-between gap-2 text-[13px] font-medium tracking-[-0.035em]">
                    <span>{n.title}</span>
                    <span className="font-normal text-mute">{n.time}</span>
                  </span>
                  <span className="mt-0.5 block text-[12.5px] leading-[1.4] tracking-[-0.025em] text-mute">{n.body}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export function Topbar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  return (
    <header className="flex h-[66px] shrink-0 items-center justify-between gap-3 pl-[15px] pr-[18px] max-sm:pr-3">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onToggle}
          aria-label="Open menu"
          className="press grid size-9 place-items-center rounded-lg text-soft hover:bg-ink/[0.06] lg:hidden"
        >
          <Icon icon={Menu01Icon} className="size-5" />
        </button>
        <AnimatePresence initial={false}>
          {collapsed && (
            <motion.button
              key="t"
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              onClick={onToggle}
              aria-label="Expand sidebar"
              className="press grid size-8 place-items-center rounded-lg text-mute hover:bg-ink/[0.06] hover:text-ink max-lg:hidden"
            >
              <Icon icon={SidebarLeftIcon} className="size-[18px]" />
            </motion.button>
          )}
        </AnimatePresence>
        <h1 className="truncate text-[15px] font-medium tracking-[-0.05em]">Dashboard</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Inbox icon={Mail01Icon} title="Messages" seed={MESSAGES} />
        <Inbox icon={Notification03Icon} title="Notifications" seed={NOTIFS} />
        <button
          type="button"
          aria-label="Share"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(window.location.href);
              toast.success("Link copied", { description: "Dashboard link is on your clipboard." });
            } catch {
              toast.error("Couldn’t copy the link");
            }
          }}
          className="press inline-flex h-9 items-center gap-2 rounded-[10px] bg-[#1A1A1C] px-3.5 text-[14px] font-medium tracking-[-0.04em] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.12)] hover:bg-[#2A2A2D] dark:bg-white dark:text-[#0E0E10] dark:shadow-none dark:hover:bg-[#E6E6EA] max-sm:w-9 max-sm:justify-center max-sm:px-0"
        >
          <Icon icon={LinkSquare02Icon} className="size-[17px]" />
          <span className="max-sm:sr-only">Share</span>
        </button>
      </div>
    </header>
  );
}
