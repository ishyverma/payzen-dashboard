"use client";

import { useTheme } from "next-themes";
import { AnimatePresence, motion } from "motion/react";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/ui/icon";
import { useMounted } from "@/lib/use-media";
import { wipeTheme } from "@/lib/theme-wipe";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = useMounted();
  const dark = mounted && resolvedTheme === "dark";
  const next = dark ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => wipeTheme(next, setTheme)}
      aria-label={`Switch to ${next} theme`}
      className="press relative grid size-9 place-items-center overflow-hidden rounded-[10px] border border-line2 bg-surface text-soft hover:bg-panel"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={dark ? "moon" : "sun"}
          initial={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 0.25, filter: "blur(4px)" }}
          transition={{ type: "spring", duration: 0.3, bounce: 0 }}
          className="grid place-items-center"
        >
          <Icon icon={dark ? Moon02Icon : Sun03Icon} className="size-[18px]" />
        </motion.span>
      </AnimatePresence>
    </button>
  );
}
