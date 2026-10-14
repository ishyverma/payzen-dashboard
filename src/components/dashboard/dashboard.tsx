"use client";

import { useEffect, useRef, useState } from "react";
import { MotionConfig } from "motion/react";
import { toast } from "sonner";
import type { CoinId, Mode } from "@/lib/data";
import { useMedia } from "@/lib/use-media";
import { cn } from "@/lib/utils";
import type { NavItem } from "./nav";
import { PriceChart } from "./price-chart";
import { Reveal } from "./reveal";
import { Sidebar } from "./sidebar";
import { StatCards } from "./stat-cards";
import { Topbar } from "./topbar";
import { TradePanel } from "./trade-panel";
import { Transactions } from "./transactions";

export function Dashboard() {
  const isMobile = useMedia("(max-width: 1023px)");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("dashboard");
  const [coin, setCoin] = useState<CoinId>("BTC");
  const [mode, setMode] = useState<Mode>("buy");
  const searchRef = useRef<HTMLInputElement>(null);
  const scroller = useRef<HTMLElement>(null);

  const eff = collapsed && !isMobile;
  const toggle = () => (isMobile ? setMobileOpen((o) => !o) : setCollapsed((c) => !c));

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
      if (!(e.metaKey || e.ctrlKey)) return;
      const k = e.key.toLowerCase();
      if (k === "b") {
        e.preventDefault();
        toggle();
      }
      if (k === "k") {
        e.preventDefault();
        if (isMobile) setMobileOpen(true);
        else setCollapsed(false);
        setTimeout(() => searchRef.current?.focus(), 200);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);

  const scrollTo = (id?: string) => {
    if (!id || id === "top") return scroller.current?.scrollTo({ top: 0, behavior: "smooth" });
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const navigate = (item: NavItem) => {
    setActive(item.id);
    if (isMobile) setMobileOpen(false);
    if (item.soon) return toast(`${item.label} is coming soon`);
    if (item.mode) setMode(item.mode);
    scrollTo(item.target);
  };

  const selectCoin = (id: CoinId) => {
    setCoin(id);
    setMode("buy");
    scrollTo("trade-panel");
    toast(`${id} selected`, { description: "Enter an amount and place your order." });
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="flex h-dvh overflow-hidden bg-canvas">
        <div
          aria-hidden
          onClick={() => setMobileOpen(false)}
          className={cn("fixed inset-0 z-40 bg-black/40 transition-opacity duration-200 ease-out lg:hidden", mobileOpen ? "opacity-100" : "pointer-events-none opacity-0")}
        />
        <Sidebar collapsed={eff} isMobile={isMobile} mobileOpen={mobileOpen} onToggle={toggle} active={active} onNavigate={navigate} searchRef={searchRef} />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar collapsed={eff} onToggle={toggle} />
          <main id="main" tabIndex={-1} ref={scroller} className="min-h-0 flex-1 overflow-y-auto pr-2 outline-none max-sm:pr-0">
            <div className="min-h-full space-y-3 rounded-t-[20px] border border-b-0 bg-panel p-[15px] max-sm:p-3">
              <StatCards onSelect={selectCoin} />
              <div className="grid grid-cols-[minmax(0,1fr)_364px] gap-4 max-xl:grid-cols-1">
                <Reveal i={4} className="min-w-0">
                  <PriceChart />
                </Reveal>
                <Reveal i={5}>
                  <TradePanel coin={coin} setCoin={setCoin} mode={mode} setMode={setMode} />
                </Reveal>
              </div>
              <Reveal i={6}>
                <Transactions />
              </Reveal>
            </div>
          </main>
        </div>
      </div>
    </MotionConfig>
  );
}
