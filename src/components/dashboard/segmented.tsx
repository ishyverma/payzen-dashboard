"use client";

import { useId, type ReactNode } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

type Opt<T extends string> = { value: T; label: ReactNode; aria: string };

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  bordered,
  className,
  itemClassName,
  label,
}: {
  value: T;
  onChange: (v: T) => void;
  options: Opt<T>[];
  bordered?: boolean;
  className?: string;
  itemClassName?: string;
  label: string;
}) {
  const id = useId();
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("relative inline-flex items-center rounded-[10px] bg-surface2 p-[3px]", bordered && "border border-line", className)}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            aria-pressed={on}
            aria-label={o.aria}
            onClick={() => onChange(o.value)}
            className={cn(
              "press relative z-0 grid h-[26px] min-w-[34px] place-items-center rounded-[7px] px-2.5 text-[12px] font-medium tracking-[-0.03em]",
              on ? "text-ink" : "text-mute hover:text-ink",
              itemClassName,
            )}
          >
            {on && (
              <motion.span
                layoutId={id}
                transition={{ type: "spring", duration: 0.3, bounce: 0 }}
                className="absolute inset-0 -z-10 rounded-[7px] bg-pill shadow-ring"
              />
            )}
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
