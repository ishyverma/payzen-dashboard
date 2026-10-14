"use client";

import { useState, type RefObject } from "react";
import { AnimatePresence, motion } from "motion/react";
import { toast } from "sonner";
import {
  AiMagicIcon,
  ArrowUp01Icon,
  CommandIcon,
  Search01Icon,
  SidebarLeftIcon,
  Tick02Icon,
  UnfoldMoreIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { NAV_GROUPS, type NavItem } from "./nav";

const EASE = [0.23, 1, 0.32, 1] as const;
const AVATAR = "https://api.dicebear.com/9.x/notionists/svg?seed=Sajibur&backgroundColor=b6e3f4";

type Props = {
  collapsed: boolean;
  isMobile: boolean;
  mobileOpen: boolean;
  onToggle: () => void;
  active: string;
  onNavigate: (item: NavItem) => void;
  searchRef: RefObject<HTMLInputElement | null>;
};

export function Sidebar({ collapsed, isMobile, mobileOpen, onToggle, active, onNavigate, searchRef }: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Record<string, boolean>>({ main: true, trading: true, general: true });
  const [claimed, setClaimed] = useState(false);

  const q = query.trim().toLowerCase();
  const groups = NAV_GROUPS.map((g) => ({ ...g, items: g.items.filter((i) => i.label.toLowerCase().includes(q)) })).filter((g) => g.items.length);

  const fade = cn("whitespace-nowrap transition-opacity duration-200 ease-out", collapsed ? "pointer-events-none opacity-0" : "opacity-100");

  const expandAndFocus = () => {
    if (!collapsed) return;
    onToggle();
    setTimeout(() => searchRef.current?.focus(), 120);
  };

  return (
    <motion.aside
      aria-label="Sidebar"
      inert={isMobile && !mobileOpen}
      initial={false}
      animate={{ width: isMobile ? 262 : collapsed ? 72 : 262 }}
      transition={{ duration: 0.26, ease: EASE }}
      className={cn(
        "relative flex h-full shrink-0 flex-col overflow-hidden bg-canvas p-[15px]",
        "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-50 max-lg:border-r max-lg:transition-transform max-lg:duration-[260ms] max-lg:ease-[cubic-bezier(0.32,0.72,0,1)]",
        mobileOpen ? "max-lg:translate-x-0 max-lg:shadow-2xl" : "max-lg:-translate-x-full",
      )}
    >
      {/* brand */}
      <div className="flex h-9 shrink-0 items-center">
        <div className="flex w-[42px] shrink-0 justify-center">
          <Logo size={28} />
        </div>
        <span aria-hidden={collapsed} className={cn("ml-1 text-[20px] font-medium tracking-[-0.065em]", fade)}>
          Payzen
        </span>
        <button
          type="button"
          onClick={onToggle}
          aria-label={isMobile ? "Close menu" : "Collapse sidebar"}
          tabIndex={collapsed ? -1 : 0}
          className={cn("press ml-auto grid size-8 place-items-center rounded-lg text-mute hover:bg-ink/[0.06] hover:text-ink", collapsed && "pointer-events-none opacity-0")}
        >
          <Icon icon={SidebarLeftIcon} className="size-[18px]" />
        </button>
      </div>

      {/* search */}
      <div
        onClick={expandAndFocus}
        className={cn(
          "mt-4 flex h-9 shrink-0 items-center overflow-hidden rounded-[10px] border border-line2 bg-surface text-mute transition-[background-color,border-color] duration-150 focus-within:border-brand/60 focus-within:bg-panel",
          collapsed && "cursor-pointer hover:bg-panel",
        )}
      >
        <span className="grid w-[40px] shrink-0 place-items-center">
          <Icon icon={Search01Icon} className="size-[18px]" />
        </span>
        <input
          ref={searchRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Escape" && (setQuery(""), e.currentTarget.blur())}
          placeholder="Search"
          aria-label="Search menu"
          tabIndex={collapsed ? -1 : 0}
          className={cn("min-w-0 flex-1 bg-transparent text-[14px] tracking-[-0.03em] text-ink outline-none [&::-webkit-search-cancel-button]:hidden placeholder:text-mute", fade)}
        />
        <Icon icon={CommandIcon} className={cn("mr-2.5 size-4", fade)} />
      </div>

      {/* nav */}
      <nav aria-label="Main" className="mt-3 min-h-0 flex-1 overflow-y-auto overflow-x-hidden [scrollbar-width:none]">
        {groups.length === 0 && <p className={cn("px-3 py-6 text-[13px] text-mute", fade)}>No results for “{query}”</p>}
        {groups.map((g, gi) => {
          const isOpen = open[g.id] || collapsed || !!q;
          return (
            <div key={g.id} className={gi ? "mt-2.5" : ""}>
              <button
                type="button"
                onClick={() => setOpen((o) => ({ ...o, [g.id]: !o[g.id] }))}
                aria-expanded={isOpen}
                tabIndex={collapsed ? -1 : 0}
                className={cn("flex h-6 w-full items-center justify-between rounded-md px-1 text-[12px] tracking-[-0.03em] text-mute hover:text-ink", fade)}
              >
                <span>{g.label}</span>
                <Icon icon={ArrowUp01Icon} className={cn("size-3.5 transition-transform duration-200 ease-out", !isOpen && "rotate-180")} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.ul
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: EASE }}
                    className="overflow-hidden px-px pb-px"
                  >
                    {g.items.map((item) => {
                      const isActive = active === item.id;
                      return (
                        <li key={item.id} className="mt-1 first:mt-1">
                          <Tooltip disabled={!collapsed}>
                            <TooltipTrigger
                              render={
                                <button
                                  type="button"
                                  onClick={() => onNavigate(item)}
                                  aria-current={isActive ? "page" : undefined}
                                  aria-label={item.label}
                                  className={cn(
                                    "press relative flex h-[34px] w-full items-center gap-2.5 rounded-[10px] px-3 text-[14px] tracking-[-0.035em]",
                                    isActive ? "bg-panel text-ink shadow-ring" : "text-mute hover:bg-ink/[0.05] hover:text-ink",
                                  )}
                                />
                              }
                            >
                              <Icon icon={item.icon} className="size-[18px]" />
                              <span aria-hidden={collapsed} className={cn("flex-1 text-left", fade)}>
                                {item.label}
                              </span>
                              {item.badge && (
                                <span
                                  className={cn(
                                    "grid h-5 min-w-5 place-items-center rounded-full bg-[#EF4444] px-1 text-[11px] font-medium text-white",
                                    collapsed && "absolute right-2 top-1.5 size-2 min-w-0 p-0 text-[0px]",
                                  )}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </TooltipTrigger>
                            <TooltipContent side="right">{item.label}</TooltipContent>
                          </Tooltip>
                        </li>
                      );
                    })}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* special offer: waits for the sidebar to finish opening, then rises with blur + fade */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            key="offer"
            initial={{ opacity: 0, y: 18, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.35, ease: EASE, delay: 0.24 } }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            className="mt-3 w-[232px] shrink-0"
          >
            <div className="relative overflow-hidden rounded-[16px] border border-line bg-panel bg-[radial-gradient(120%_90%_at_8%_0%,#FFE6D8_0%,transparent_55%),radial-gradient(90%_80%_at_100%_45%,#DCE6FF_0%,transparent_62%)] p-3.5 dark:bg-[radial-gradient(120%_90%_at_8%_0%,rgb(255_140_90/0.16)_0%,transparent_55%),radial-gradient(90%_80%_at_100%_45%,rgb(5_130_251/0.18)_0%,transparent_62%)]">
              <span className="grid size-7 place-items-center rounded-[8px] bg-[#151517] text-white dark:bg-white dark:text-[#151517]">
                <Icon icon={AiMagicIcon} className="size-4" />
              </span>
              <h3 className="mt-2.5 text-[15px] font-semibold tracking-[-0.055em]">Special Offer</h3>
              <p className="mt-0.5 text-[12.5px] leading-[1.35] tracking-[-0.035em] text-mute">Get 20% off for the first 3 months</p>
              <button
                type="button"
                disabled={claimed}
                onClick={() => {
                  setClaimed(true);
                  toast.success("Offer claimed", { description: "20% off applied to your first 3 months." });
                }}
                className="press mt-3 inline-flex h-[30px] items-center gap-1.5 rounded-[8px] bg-pill px-3 text-[12px] font-medium tracking-[-0.03em] shadow-ring hover:bg-surface disabled:text-mute"
              >
                {claimed && <Icon icon={Tick02Icon} className="size-3.5 text-[#16A34A]" />}
                {claimed ? "Claimed" : "Claim Now"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* user */}
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              aria-label="Account menu"
              className={cn(
                "press mt-3 shrink-0",
                collapsed ? "mx-auto rounded-full" : "flex h-[56px] w-full items-center rounded-[14px] border border-line2 bg-panel p-2.5 text-left hover:bg-surface",
              )}
            />
          }
        >
          <UserAvatar />
          {!collapsed && (
            <>
              <span className="ml-2.5 min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium leading-4 tracking-[-0.04em]">Sajibur</span>
                <span className="block truncate text-[11.5px] leading-4 tracking-[-0.03em] text-mute">hellosajibur@gmail.com</span>
              </span>
              <Icon icon={UnfoldMoreIcon} className="size-4 text-mute" />
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent side={collapsed ? "right" : "top"} align="end" className="w-max min-w-[210px] rounded-[12px]">
          {["Profile", "Billing", "Preferences"].map((l) => (
            <DropdownMenuItem key={l} onClick={() => toast(`${l} opens here`)}>
              {l}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive" onClick={() => toast.success("Signed out")}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.aside>
  );
}

function UserAvatar() {
  return (
    <Avatar className="size-9 shrink-0 outline outline-1 -outline-offset-1 outline-black/10 dark:outline-white/10">
      <AvatarImage src={AVATAR} alt="" />
      <AvatarFallback className="text-xs">SA</AvatarFallback>
    </Avatar>
  );
}
